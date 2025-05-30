import React from "react";
import { CustomModal } from "./CustomModal.tsx";
import { CustomButton } from "./ui/CustomButton.tsx";
import { TextInput } from "./ui/TextInput.tsx";

type AddNonExistingCollectionModalProps = {
  onClose: () => void;
  onSave: (newCollection: {
    amount: number;
    natureOfCollection: string;
    accountCode: string;
    responsibilityCode: string;
    objectCode: string;
    objectDescription: string;
    mfoPap: string;
  }) => void;
};

export const AddNonExistingCollectionModal = ({ onClose, onSave }: AddNonExistingCollectionModalProps) => {
  const [amount, setAmount] = React.useState<number>(0);
  const [natureOfCollection, setNatureOfCollection] = React.useState<string>("");
  const [accountCode, setAccountCode] = React.useState<string>("");
  const [responsibilityCode, setResponsibilityCode] = React.useState<string>("");
  const [objectCode, setObjectCode] = React.useState<string>("");
  const [objectDescription, setObjectDescription] = React.useState<string>("");
  const [mfoPap, setMfoPap] = React.useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "amount":
        setAmount(parseFloat(value));
        break;
      case "natureOfCollection":
        setNatureOfCollection(value);
        break;
      case "accountCode":
        setAccountCode(value);
        break;
      case "responsibilityCode":
        setResponsibilityCode(value);
        break;
      case "objectCode":
        setObjectCode(value);
        break;
      case "objectDescription":
        setObjectDescription(value);
        break;
      case "mfoPap":
        setMfoPap(value);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    const newCollection = {
      amount,
      natureOfCollection,
      accountCode,
      responsibilityCode,
      objectCode,
      objectDescription,
      mfoPap,
    };
    onSave(newCollection);
    onClose();
  };

  return (
    <CustomModal onClose={onClose} className="w-full max-w-3xl h-full max-h-[430px] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">Add Other Collection</h3>
      <div className="flex items-center gap-4 mb-4 mr-2 p-4 flex-col border-2 border-gray-300 rounded-md">
        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium text-gray-700">Nature Of Collection</label>
          <TextInput
            type="text"
            name="natureOfCollection"
            value={natureOfCollection}
            onChange={handleInputChange}
            className="mt-1 block w-1/2 border border-gray-300 rounded-md shadow-sm"
          />
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <TextInput
            type="number"
            name="amount"
            value={amount}
            onChange={handleInputChange}
            className="mt-1 block w-1/2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        {/* div for 2 columns */}
        <div className="flex gap-4 w-full p-3 justify-around">
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Code</label>
            <TextInput
              type="text"
              name="accountCode"
              value={accountCode}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
            <label className="mt-2 block text-sm font-medium text-gray-700">Responsibility Code</label>
            <TextInput
              type="text"
              name="responsibilityCode"
              value={responsibilityCode}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Object Code</label>
            <TextInput
              type="text"
              name="objectCode"
              value={objectCode}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
            <label className=" mt-2 block text-sm font-medium text-gray-700">Object Description</label>
            <TextInput
              type="text"
              name="objectDescription"
              value={objectDescription}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">MFO/PAP</label>
            <TextInput
              type="text"
              name="mfoPap"
              value={mfoPap}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <CustomButton variant="cancel" className="mr-2" onClick={onClose}>
          Cancel
        </CustomButton>
        <CustomButton onClick={handleSave} variant="green">
          Save
        </CustomButton>
      </div>
    </CustomModal>
  );
};
