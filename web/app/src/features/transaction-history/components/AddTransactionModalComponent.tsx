import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CustomModal } from "../../../components/CustomModal.tsx";
import { CustomButton } from "../../../components/ui/CustomButton.tsx";
import { collegeAccountCodes } from "../../../data/constants/collegeCodes.ts";

import { CircleX } from "lucide-react";
import { getLastReferenceNumber, saveLastReferenceNumber } from "../../../services/localForage.js";
import { formattedDisplayDateToday } from "../../../utils/formatting.tsx";
import { ClientModel } from "../../../data/models/Clients.tsx";
import { TransactionDetails } from "../../../data/models/TransactionModel.tsx";
import { saveTransaction } from "../../../services/dexieDB.js";
import { GenerateReceiptFile } from "../features/print-receipt/features/generateReceipt.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import { NatureDropdown } from "../../../components/RevolvingFundDropdown.tsx";
import { Option } from "../../../types/RevolvingFundItems.ts";
import { PaymentMethodSelector } from "../../../components/PaymentMethodSelector.tsx";
import { SearchInput } from "../../../components/SearchInput.tsx";
import { useClientDetails } from "../../../context/ClientDetailsContext.tsx";
import { set } from "rsuite/esm/internals/utils/date/index";
import { TextInput } from "../../../components/ui/TextInput.tsx";

type AddTransactionModalProps = {
  onClose: () => void;
  onSave: () => void;
  isPayorDetailsPage?: boolean;
  client?: ClientModel;
};

export function setNextORNumber(lastReferenceNumber: string) {
  const nextNumber = (parseInt(lastReferenceNumber, 10) + 1).toString().padStart(lastReferenceNumber?.length, "0");
  return nextNumber;
}

export function AddTransactionModal({ onClose, onSave, client, isPayorDetailsPage }: AddTransactionModalProps) {
  const [clientInfo, setClientInfo] = useState<ClientModel | undefined>(client ? client : undefined);
  const [name, setName] = useState(clientInfo?.name || "");
  const [isStudent, setIsStudent] = useState(clientInfo?.type === "non-student" ? false : true);
  const [studentNumber, setStudentNumber] = useState(clientInfo?.studentInfo?.studentNumber || "");
  const [date, setDate] = useState(formattedDisplayDateToday());
  const [college, setCollege] = useState("");
  const [collections, setCollections] = useState<{ amount: number; name: string }[]>([]);
  const [ORNumber, setORNumber] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [lastReferenceNumber, setLastReferenceNumber] = useState("");
  const [showGenerateReceiptModal, setShowGenerateReceiptModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetails>();
  const { user } = useUser();
  const { getClientDetails } = useClientDetails();
  const [selectedNature, setSelectedNature] = useState<Option | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  useEffect(() => {
    getLastReferenceNumber().then(setLastReferenceNumber);
    const nextNumber = setNextORNumber(lastReferenceNumber);
    setORNumber(nextNumber);
  }, [lastReferenceNumber]);

  const handleGenerateReceipt = () => {
    setShowGenerateReceiptModal(true);
  };

  // saving transactions directly from the homepage>add transaction button
  // assumes that the client is new
  const handleSaveTransaction = () => {
    //create Client Object
    const newClient: ClientModel = {
      id: clientInfo?.id || undefined,
      name: name,
      type: isStudent ? "student" : "non-student",
      studentInfo: isStudent ? { studentNumber, college } : undefined,
    };

    let newTransaction: TransactionDetails = {
      id: uuidv4(),
      collections,
      createdAt: new Date(),
      updatedAt: new Date(),
      cashierId: user?.uid || "",
      refNumber: ORNumber || "-",
      paymentMethod: paymentMethod,
      history: [],
    };

    try {
      saveTransaction(newTransaction, newClient);
      setShowSuccessMessage(true);
      saveLastReferenceNumber(ORNumber);

      setSelectedTransaction(newTransaction);
      onSave();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleAddCollection = () => {
    setCollections([...collections, { amount: 0, name: "" }]);
    // setNatureOfCollection("");
  };

  const handleRemoveCollection = (index: number) => {
    setCollections(collections.filter((_, i) => i !== index));
  };

  const handleCollectionChange = (index: number, field: string, value: string) => {
    setCollections((prevCollections) =>
      prevCollections.map((collection, i) => {
        if (i === index) {
          const floatValue = parseFloat(value);
          return { ...collection, [field]: field === "amount" ? floatValue : value };
        }
        return collection;
      })
    );
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false); // Close the success message modal
    onClose(); // Close the main modal
  };
  const handleNatureSelect = (selectedOption: Option | null) => {
    setSelectedNature(selectedOption);
    console.log("Selected Nature in parent:", selectedOption);
  };
  const handleChangePaymentMethod = (paymentMethod: string) => {
    setPaymentMethod(paymentMethod);
  };

  const handleAddClientDetails = async (clientId: string) => {
    const client = await getClientDetails(clientId);
    console.log("Client details:", client.name);

    // If getClientDetails returns an array, pick the first item; otherwise, use as is
    setClientInfo(client);
    setName(client.name);
    setIsStudent(client.type === "non-student" ? false : true);
    setStudentNumber(client.studentInfo?.studentNumber || "");
    setCollege(client.studentInfo?.college || "");
  };

  return (
    <>
      <CustomModal onClose={onClose} className="w-full max-w-2xl max-h-screen overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">Add New Transaction</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <TextInput
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          {!isPayorDetailsPage && (
            <>
              <SearchInput isHeader={false} onClick={(clientId) => handleAddClientDetails(clientId)} />
              <label className="block text-sm font-medium text-gray-700 mb-1">or Create New Payor</label>
            </>
          )}

          <TextInput
            placeholder="Enter Name of New Payor"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-3 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div className="flex mb-4">
          <input
            type="checkbox"
            checked={!isStudent} // Invert the checked state
            onChange={(e) => setIsStudent(!e.target.checked)} // Invert the state change
            className="mt-1 mr-3"
          />
          <label className="block text-sm font-medium text-gray-700">Non-UPLB Student?</label>
        </div>

        {isStudent && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Student Number</label>
              <TextInput
                placeholder="Enter Student Number"
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">College</label>
              <select
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select College</option>
                {Object.keys(collegeAccountCodes).map((collegeKey) => (
                  <option key={collegeKey} value={collegeKey}>
                    {collegeKey}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {collections.map((collection, index) => (
          <div key={index} className="flex mb-4 space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Nature of Collection</label>

              <NatureDropdown
                onSelect={(selectedOption) => {
                  handleNatureSelect(selectedOption);
                  if (selectedOption) {
                    handleCollectionChange(index, "name", selectedOption.nature);
                    handleCollectionChange(index, "accountCode", selectedOption.accountCode);
                    handleCollectionChange(index, "responsibilityCode", selectedOption.responsibilityCode);
                    handleCollectionChange(index, "objectCode", selectedOption.objectCode);
                    handleCollectionChange(index, "GLCode", selectedOption.objectCode);
                    handleCollectionChange(index, "objectDescription", selectedOption.objectDescription);
                    handleCollectionChange(index, "mfoPap", selectedOption.mfoPap);
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <TextInput
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <PaymentMethodSelector onPaymentMethodChange={handleChangePaymentMethod} />
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Ref/OR No (Last Ref/OR No: {lastReferenceNumber} )
            </label>
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
          <TextInput
            placeholder="Enter OR Number"
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
          <CustomButton onClick={handleSaveTransaction} className="bg-up_green hover:bg-up_green-hover text-white">
            Save
          </CustomButton>
        </div>
      </CustomModal>
      {showSuccessMessage && (
        <CustomModal onClose={handleCloseSuccessMessage}>
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
