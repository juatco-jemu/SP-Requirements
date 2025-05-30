import React, { useEffect, useState } from "react";
import { CustomButton } from "../../../components/ui/CustomButton";
import { CustomModal } from "../../../components/CustomModal";
import { CircleX } from "lucide-react";
import { formattedDisplayDateToday } from "../../../utils/formatting";
import { TextInput } from "../../../components/ui/TextInput";

type CollectionDeposit = {
  amount: number;
  depositName: string;
  date: string;
};

interface AddDepositsModalProps {
  collections: CollectionDeposit[];
  totalDeposits: number;
  onClose: () => void;
  onSave: (collections: CollectionDeposit[], totalDeposits: number) => void;
}

export function AddDepositsModal({
  collections: initialCollections,
  totalDeposits: initialDeposit,
  onSave,
  onClose,
}: AddDepositsModalProps) {
  const [collections, setCollections] = useState<CollectionDeposit[]>(() => {
    const savedCollections = sessionStorage.getItem("CRR/RCDCollections");
    return savedCollections ? JSON.parse(savedCollections) : initialCollections;
  });
  const [totalDeposits, setTotalDeposits] = useState(() => {
    const savedTotalDeposits = sessionStorage.getItem("CRR/RCDTotalDeposits");
    return savedTotalDeposits ? JSON.parse(savedTotalDeposits) : initialDeposit;
  });

  useEffect(() => {
    const total = collections.reduce((sum, collection) => sum + collection.amount, 0);
    setTotalDeposits(total);
    sessionStorage.setItem("CRR/RCDCollections", JSON.stringify(collections));
    sessionStorage.setItem("CRR/RCDTotalDeposits", JSON.stringify(total));
  }, [collections]);

  const handleAddDepositToCollection = () => {
    setCollections([...collections, { amount: 0, depositName: "", date: formattedDisplayDateToday() }]);
    // setNatureOfCollection("");
  };

  const handleRemoveCollection = (index: number) => {
    setCollections(collections.filter((_, i) => i !== index));
  };

  const handleCollectionChange = (index: number, field: string, value: string) => {
    const newCollections = collections.map((collection, i) => {
      if (i === index) {
        const floatValue = parseFloat(value);
        return {
          ...collection,
          [field]: field === "amount" ? floatValue : value,
        };
      }
      return collection;
    });
    setCollections(newCollections);
  };

  const handleAddDeposit = () => {
    console.log("Add deposit");
    console.log(collections);
    onSave(collections, totalDeposits);
  };

  return (
    <>
      <CustomModal onClose={onClose} className="w-full max-w-3xl">
        <h3 className="text-xl font-semibold mb-4">Add Deposits</h3>

        {collections.map((collection, index) => (
          <div key={index} className="flex mb-4 space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Deposit Type</label>
              <TextInput
                value={collection.depositName || ""}
                onChange={(e) => handleCollectionChange(index, "depositName", e.target.value)}
                placeholder="eg. Cash Deposit, ADA, etc."
                className="mt-1 w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <TextInput
                value={collection.date}
                onChange={(e) => handleCollectionChange(index, "date", e.target.value)}
                placeholder="MM/DD/YYYY"
                className="mt-1 w-full"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <TextInput
                type="number"
                value={isNaN(parseFloat(collection.amount.toString())) ? "" : collection.amount}
                onChange={(e) => handleCollectionChange(index, "amount", e.target.value)}
                className="mt-1 w-full"
              />
            </div>
            <div className="flex items-end">
              <CustomButton className="mt-4" size="icon" variant="ghost" onClick={() => handleRemoveCollection(index)}>
                <CircleX className="text-red-600" />
              </CustomButton>
            </div>
          </div>
        ))}
        <div className="flex mb-4">
          <div>
            <CustomButton onClick={handleAddDepositToCollection} variant="yellow">
              Add Deposit
            </CustomButton>
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <CustomButton variant="cancel" className="mr-2" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton onClick={handleAddDeposit} variant="green">
            Add
          </CustomButton>
        </div>
      </CustomModal>
    </>
  );
}
