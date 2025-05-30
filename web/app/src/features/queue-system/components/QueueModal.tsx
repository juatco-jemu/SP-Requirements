import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CustomModal } from "../../../components/CustomModal.tsx";
import { CustomButton } from "../../../components/ui/CustomButton.tsx";
import { ConfirmationModal } from "./ConfirmationModal.tsx";
import { collegeAccountCodes } from "../../../data/constants/collegeCodes.ts";
import { saveTransaction } from "../../../services/dexieDB.js";
import { getLastReferenceNumber, saveLastReferenceNumber } from "../../../services/localForage.js";
import { formattedDisplayDateToday, formatTimestamp } from "../../../utils/formatting.tsx";
import { ClientModel } from "../../../data/models/Clients.tsx";
import { TransactionDetails, CollectionDetails } from "../../../data/models/TransactionModel.tsx";
import { cancelTransaction, confirmTransaction } from "../api/queueAPI.js";
import {
  AddTransactionModal,
  setNextORNumber,
} from "../../transaction-history/components/AddTransactionModalComponent.tsx";
import { AddMoreCollectionModal } from "../../../components/AddMoreCollectionModal.tsx";
import { Timestamp } from "firebase/firestore";
import { MessageModal } from "../../../components/SuccessModal.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import { GenerateReceiptFile } from "../../transaction-history/features/print-receipt/features/generateReceipt.tsx";
import { loadJsonFromLocalStorage } from "../../../utils/excelToJson.ts";
import { PaymentMethodSelector } from "../../../components/PaymentMethodSelector.tsx";
import { on } from "rsuite/esm/DOMHelper/index";
import { sendNotification } from "../../../services/sendNotification.js";
import { Check } from "lucide-react";

type QueueModalProps = {
  selectedQueue: {
    ticketNumber: string;
    id: string;
    uid: string;
    queueIndex: number;
    refNumber: string;
    date: string;
    userName: string;
    college: string;
    collections: (CollectionDetails & { isLoaded?: boolean })[];
    studentNumber: string;
    email: string;
    expiresAt: Timestamp;
    createdAt: Timestamp;
    transactionId: string;
    tokens: string[];
  };
  ticketNumber: string;
  closeModal: () => void;
  onRemoveQueue: (queueId: number) => void;
  onTransactionSaved: () => void; // Callback to update the parent component when a transaction is saved
};

export function QueueModal({
  selectedQueue,

  closeModal,
  onRemoveQueue,
  onTransactionSaved,
}: QueueModalProps) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationTitle, setConfirmationTitle] = useState("");
  const [confirmationAction, setConfirmationAction] = useState<() => void>(() => {});
  const [addORNumberModal, setAddORNumberModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [ORNumber, setORNumber] = useState("");
  const [lastReferenceNumber, setLastReferenceNumber] = useState("");
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showGenerateReceiptModal, setShowGenerateReceiptModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetails>();
  const { user } = useUser();

  const cancellationMessage = {
    fcmTokens: selectedQueue.tokens,
    title: "Payment Cancelled",
    body: `Your payment for ${selectedQueue.ticketNumber} has been cancelled.`,
  };

  const successfulMessage = {
    fcmTokens: selectedQueue.tokens,
    title: "Payment Successful",
    body: `Your payment for ${selectedQueue.ticketNumber} has been successful.`,
  };

  useEffect(() => {
    getLastReferenceNumber().then(setLastReferenceNumber);
    const nextNumber = setNextORNumber(lastReferenceNumber);
    setORNumber(nextNumber);
  }, []);

  useEffect(() => {
    if (selectedQueue.collections.length > 0) {
      selectedQueue.collections.map((collection) => {
        console.log("collection name:", collection.name + " - " + selectedQueue.college);
        const collectionName = collection.name + " - " + selectedQueue.college;
        const data = loadJsonFromLocalStorage();
        const selectedOption = data.find((option: any) => option.nature === collectionName);
        console.log("selectedOption:", selectedOption);

        if (selectedOption) {
          collection.isLoaded = true; // Mark the collection as loaded
          collection.accountCode = selectedOption.accountCode || "-";
        }
      });
    }
  }, [selectedQueue]);

  const handleCancelPaymentModal = () => {
    setConfirmationMessage("Are you sure to cancel this payment? This cannot be undone.");
    setConfirmationTitle("Cancel Payment?");
    setConfirmationAction(() => handleConfirmCancelPayment);
    setShowConfirmationModal(true);
  };

  const handleConfirmCancelPayment = async () => {
    console.log("Canceling payment:");
    closeModal();
    await cancelTransaction(selectedQueue, selectedQueue.transactionId);
    sendNotification(cancellationMessage);
    alert("Payment cancelled successfully");
    setShowCancellationModal(true); // Show cancellation message modal
    onRemoveQueue(selectedQueue.queueIndex); // Remove the queue from the list
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleAddReferenceNumber = () => {
    const newClient: ClientModel = {
      email: selectedQueue.email || "-",
      studentInfo: { studentNumber: selectedQueue.studentNumber, college: selectedQueue.college },
      name: selectedQueue.userName,
      id: selectedQueue.uid,
      type: selectedQueue.studentNumber ? "student" : "non-student",
    };

    // const setCollections = (selectedQueue: { collections: any[]; }) => {
    //   return selectedQueue.collections.map((collection) => ({
    //     amount: collection.amount,
    //     name: collection.name,
    //   }));
    // }

    const newCollections = selectedQueue.collections.map((collection) => {
      console.log("collection name:", collection.name + " - " + selectedQueue.college);
      const collectionName = collection.name + " - " + selectedQueue.college;
      const data = loadJsonFromLocalStorage();
      const selectedOption = data.find((option: any) => option.nature === collectionName);
      console.log("selectedOption:", selectedOption);

      if (selectedOption) {
        collection.isLoaded = true; // Mark the collection as loaded
      }

      return {
        amount: collection.amount,
        name: selectedOption?.nature || collection.name,
        accountCode: selectedOption?.accountCode || collection.accountCode || "-",
        responsibilityCode: selectedOption?.responsibilityCode || collection.responsibilityCode || "-",
        objectCode: selectedOption?.objectCode || collection.objectCode || "-",
        GLCode: selectedOption?.objectCode || collection.GLCode || "-",
        objectDescription: selectedOption?.objectDescription || collection.objectDescription || "-",
        mfoPap: selectedOption?.mfoPap || collection.mfoPap || "-",
      };
    });

    let newTransaction: TransactionDetails = {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      refNumber: ORNumber || "-",
      collections: newCollections,
      clientId: selectedQueue.uid,
      cashierId: user?.uid || "",
      paymentMethod: paymentMethod,
      history: [],
    };

    saveTransaction(newTransaction, newClient) // Save the transaction locally
      .then(() => {
        setAddORNumberModal(false); // Close OR number modal
        setSelectedTransaction(newTransaction); // Set the selected transaction for the
        onTransactionSaved(); // Notify parent to update transaction data
        setShowSuccessMessage(true); // Show success message
        sendNotification(successfulMessage);
      })
      .catch((error: any) => {
        console.error("Error saving transaction:", error);
      });
    saveLastReferenceNumber(ORNumber); // Save the last reference number
    confirmTransaction(selectedQueue, selectedQueue.transactionId, newCollections); // Confirm the transaction in the firestore database
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false); // Close the success message modal
    closeModal(); // Close the main modal
  };

  const getAccountCode = (college: string) => {
    return collegeAccountCodes[college] || "getting account code failed";
  };

  const handleAddMoreCollection = (newCollections: any) => {
    console.log("New Collections:", newCollections);
    selectedQueue.collections = newCollections;
    setShowAddCollectionModal(false);
  };
  const handleGenerateReceipt = () => {
    console.log("Generate Receipt:", selectedTransaction);
    setShowGenerateReceiptModal(true);
  };
  const handlePaymentMethodChange = (paymentMethod: string) => {
    setPaymentMethod(paymentMethod);
    console.log("Payment Method:", paymentMethod);
  };

  return (
    <>
      <CustomModal onClose={closeModal} className="w-full max-w-xl max-h-screen overflow-y-auto">
        <h3 className="text-xl font-semibold mb-2">Ticket No. {selectedQueue.ticketNumber}</h3>
        <p className="text-lg font-semibold">Name: {selectedQueue.userName}</p>
        <p className="text-md font-semibold">College: {selectedQueue.college}</p>
        <p className="text-md font-semibold">Account Code: {getAccountCode(selectedQueue.college)}</p>
        <hr className="h-1 mx-auto my-3 rounded dark:bg-gray-500" />
        <p className="text-xl font-semibold my-2">Nature of Collection</p>
        <ul>
          {selectedQueue.collections.map((collection, index) => (
            <li key={index}>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="text-lg">{collection.name}</span>
                  <span>{collection.isLoaded && <Check className="text-up_green ml-1" />}</span>
                </div>

                <span className="font-semibold">PHP {collection.amount.toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
        <br />
        <CustomButton
          variant="ghost"
          className="pl-1 text-up_green hover:text-up_green_hover hover:bg-gray-200"
          onClick={() => setShowAddCollectionModal(true)}
        >
          Edit Collection
        </CustomButton>
        <br />
        <p className="text-xl font-semibold my-2">Payment Method</p>
        <PaymentMethodSelector onPaymentMethodChange={handlePaymentMethodChange} />

        <hr className="h-1 mx-auto my-3 rounded dark:bg-gray-500" />
        <div className="flex justify-between">
          <p className="text-lg font-semibold">Total:</p>
          <p className="text-lg font-semibold">
            PHP {selectedQueue.collections.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
          </p>
        </div>

        <div className="flex justify-between">
          <div>
            {/* <p>Client Ref No.:</p> */}
            <p>Created At:</p>
            <p>Expires At:</p>
          </div>
          <div className="text-right">
            {/* <p>{selectedQueue.refNumber}</p> */}
            <p>{formatTimestamp(selectedQueue.createdAt)}</p>
            <p>{formatTimestamp(selectedQueue.expiresAt)}</p>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <CustomButton variant="cancel" className="mt-4  px-4" onClick={handleCancelPaymentModal}>
            Cancel Payment
          </CustomButton>
          <CustomButton className="mt-4 px-4" variant="green" onClick={() => setAddORNumberModal(true)}>
            Confirm Payment
          </CustomButton>
        </div>
        {showCancellationModal && (
          <MessageModal onClose={() => setShowCancellationModal(false)} message="Payment Successfully cancelled" />
        )}
      </CustomModal>

      {showConfirmationModal && (
        <ConfirmationModal
          title={confirmationTitle}
          message={confirmationMessage}
          onConfirm={confirmationAction}
          onCancel={handleCloseConfirmationModal}
        />
      )}

      {addORNumberModal && (
        <CustomModal
          onClose={() => setAddORNumberModal(false)}
          className="w-full max-w-lg max-h-screen overflow-y-auto"
        >
          <h3 className="text-xl font-semibold mb-2">Add Reference/OR Number</h3>

          <p>To Confirm the payment, please type in the Reference Number</p>
          <br />
          <br />
          <div className="flex items-center">
            <p>Last Reference Number: {lastReferenceNumber} </p>
            <CustomButton
              variant="ghost"
              className="text-sm font-bold ml-1 text-up_green"
              onClick={() => {
                const nextNumber = setNextORNumber(lastReferenceNumber);
                setORNumber(nextNumber);
              }}
            >
              Next OR Number: {setNextORNumber(lastReferenceNumber)}
            </CustomButton>
          </div>
          <input
            type="text"
            placeholder="Reference/OR Number"
            value={ORNumber}
            onChange={(e) => setORNumber(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
          <div className="mt-4 flex justify-end gap-4">
            <CustomButton variant="cancel" className="mt-4 px-4" onClick={() => setAddORNumberModal(false)}>
              Cancel
            </CustomButton>
            <CustomButton className="mt-4 px-4" variant="green" onClick={handleAddReferenceNumber}>
              Confirm
            </CustomButton>
          </div>
        </CustomModal>
      )}

      {showSuccessMessage && (
        <CustomModal onClose={() => setShowSuccessMessage(false)}>
          <h3 className="text-xl font-semibold mb-2">Payment Successful</h3>
          <p>The payment has been successfully confirmed</p>
          <div className="mt-4 flex justify-end gap-4">
            <CustomButton className="mt-4 px-4" variant="cancel" onClick={handleCloseSuccessMessage}>
              Close
            </CustomButton>
            <CustomButton className="mt-4 px-4" variant="green" onClick={handleGenerateReceipt}>
              Print Receipt
            </CustomButton>
          </div>
        </CustomModal>
      )}

      {showAddCollectionModal && (
        <AddMoreCollectionModal
          currentCollections={selectedQueue.collections}
          onSave={handleAddMoreCollection}
          onClose={() => setShowAddCollectionModal(false)}
        />
      )}
      {showGenerateReceiptModal && selectedTransaction && (
        <GenerateReceiptFile transaction={selectedTransaction} onClose={closeModal} />
      )}
    </>
  );
}
