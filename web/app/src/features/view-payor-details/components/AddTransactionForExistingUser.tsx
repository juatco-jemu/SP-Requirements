import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CustomModal } from "../../../components/CustomModal.tsx";
import { CustomButton } from "../../../components/ui/CustomButton.tsx";
import { natureOfCollectionValues } from "../../../data/constants/natureOfCollection.ts";
import { TransactionDetails } from "../../../data/models/TransactionModel.tsx";
import { CircleX } from "lucide-react";
import { getLastReferenceNumber, saveLastReferenceNumber } from "../../../services/localForage.js";
import { formattedDisplayDateToday } from "../../../utils/formatting.tsx";
import { generateShortUUID } from "../../../utils/uidgenerator.js";
import { saveTransaction } from "../../../services/dexieDB.js";
import { GenerateReceiptFile } from "../../transaction-history/features/print-receipt/features/generateReceipt.tsx";
import { useUser } from "../../../context/UserContext.tsx";

type AddTransactionModalProps = {
  onClose: () => void;
  onSave: (transaction: any) => void;
  userDetails: any;
};

export function AddTransactionExistingUserModal({ onClose, onSave, userDetails }: AddTransactionModalProps) {
  const [date, setDate] = useState(formattedDisplayDateToday());
  const [collections, setCollections] = useState<{ amount: number; natureOfCollection: string }[]>([]);
  const [ORNumber, setORNumber] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [lastReferenceNumber, setLastReferenceNumber] = useState("");
  const [showGenerateReceiptModal, setShowGenerateReceiptModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetails>();
  const { user, getUserDetails } = useUser();

  useEffect(() => {
    getLastReferenceNumber().then(setLastReferenceNumber);
    getUserDetails();
  }, []);

  const handleGenerateReceipt = () => {
    setShowGenerateReceiptModal(true);
  };

  const handleSave = () => {
    let newTransaction: TransactionDetails = {
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      refNumber: ORNumber || "-",
      collections: collections.map((collection) => ({
        amount: collection.amount,
        name: collection.natureOfCollection, // Assuming name is the same as natureOfCollection
      })),
      clientId: userDetails.id,
      cashierId: user?.uid || "",
      history: [],
      studentRefNumber: generateShortUUID(),
    };
    newTransaction.history.push(newTransaction);
    console.log("cashierId", user?.uid);

    saveTransaction(newTransaction)
      .then(() => {
        setShowSuccessMessage(true); // Show success message
        // Set the client name

        setSelectedTransaction(newTransaction); // Set the selected transaction for the
        onSave(newTransaction); // Notify parent to update transaction data
      })
      .catch((error: any) => {
        console.error("Error saving transaction:", error);
      });
    saveLastReferenceNumber(ORNumber); // Save the last reference number
  };

  const handleAddCollection = () => {
    setCollections([...collections, { amount: 0, natureOfCollection: "" }]);
    // setNatureOfCollection("");
  };

  const handleRemoveCollection = (index: number) => {
    setCollections(collections.filter((_, i) => i !== index));
  };

  const handleCollectionChange = (index: number, field: string, value: string) => {
    const newCollections = collections.map((collection, i) => {
      if (i === index) {
        const floatValue = parseFloat(value);
        return { ...collection, [field]: field === "amount" ? floatValue : value };
      }
      return collection;
    });
    setCollections(newCollections);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false); // Close the success message modal
    onClose(); // Close the main modal
  };

  return (
    <>
      <CustomModal onClose={onClose}>
        <h3 className="text-xl font-semibold mb-4">Add New Transaction</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            readOnly
            type="text"
            value={userDetails.name}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Student Number</label>
          <input
            readOnly
            type="text"
            value={userDetails.studentInfo?.studentNumber || "N/A"}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">College</label>
          <input
            readOnly
            type="text"
            value={userDetails.studentInfo?.college || "N/A"}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {collections.map((collection, index) => (
          <div key={index} className="flex mb-4 space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Nature</label>
              <select
                value={collection.natureOfCollection}
                onChange={(e) => handleCollectionChange(index, "natureOfCollection", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select Nature of Collection</option>
                {natureOfCollectionValues.map((nature) => (
                  <option key={nature} value={nature}>
                    {nature}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={isNaN(parseFloat(collection.amount.toString())) ? "" : collection.amount}
                onChange={(e) => handleCollectionChange(index, "amount", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="flex items-end">
              <CustomButton className="mt-4" size="icon" variant="ghost" onClick={() => handleRemoveCollection(index)}>
                <CircleX className="text-red-600" />
              </CustomButton>
            </div>
          </div>
        ))}
        <div className="mb-4">
          <CustomButton onClick={handleAddCollection}>Add Collection</CustomButton>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Ref/OR No (Last Ref/OR No: {lastReferenceNumber} )
          </label>
          <input
            type="text"
            value={ORNumber}
            onChange={(e) => setORNumber(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="flex justify-end mt-3">
          <CustomButton variant="cancel" className="mr-2" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton onClick={handleSave} variant="green">
            Save
          </CustomButton>
        </div>
      </CustomModal>
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
      {showGenerateReceiptModal && selectedTransaction && (
        <GenerateReceiptFile transaction={selectedTransaction} onClose={onClose} />
      )}
    </>
  );
}
