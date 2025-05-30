import React, { useEffect, useState } from "react";
import { CustomModal } from "./CustomModal.tsx";
import { CustomButton } from "./ui/CustomButton.tsx";
import { CircleX } from "lucide-react";
import { NatureDropdown } from "./RevolvingFundDropdown.tsx";
import { Option } from "../types/RevolvingFundItems.ts";
import { TextInput } from "./ui/TextInput.tsx";
import { set } from "rsuite/esm/internals/utils/date/index";
import { AddNonExistingCollectionModal } from "./AddNonExistingCollectionModal.tsx";

type AddMoreCollectionModalProps = {
  onClose: () => void;
  onSave: (newCollections: { amount: number; name: string }[]) => void;
  currentCollections: { amount: number; name: string }[];
};

export const AddMoreCollectionModal = ({ onClose, onSave, currentCollections }: AddMoreCollectionModalProps) => {
  const [collections, setCollections] = useState<
    { amount: number; name: string; accountCode?: string; isLoaded?: boolean }[]
  >([]);
  const [selectedNature, setSelectedNature] = useState<Option | null>(null);
  const [showAddOtherCollectionModal, setShowAddOtherCollectionModal] = useState(false);

  useEffect(() => {
    setCollections(currentCollections);
  }, [currentCollections]);

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

  const handleRemoveCollection = (index: number) => {
    setCollections(collections.filter((_, i) => i !== index));
  };
  const handleAdd = () => {
    onSave(collections);
    onClose();
  };
  const handleAddCollection = () => {
    setCollections([...collections, { amount: 0, name: "" }]);
    // setNatureOfCollection("");
  };
  const handleNatureSelect = (selectedOption: Option | null) => {
    setSelectedNature(selectedOption);
    console.log("Selected Nature in parent:", selectedOption);
  };

  const handleAddOtherCollection = () => {
    setShowAddOtherCollectionModal(true);
  };
  return (
    <CustomModal onClose={onClose} className="w-full max-w-lg h-full max-h-96 overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">Add New Collection</h3>
      <div className="mb-4">
        {collections?.map((collection, index) => (
          <div key={index} className="flex flex-col mb-4 border-b border-gray-200 pb-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nature of Collection</label>
                <div style={{ width: "250px" }}>
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
                        collection.accountCode = selectedOption.accountCode;
                        collection.isLoaded = true;
                      }
                    }}
                    placeholder={collection.name || undefined}
                  />
                </div>
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
                <CustomButton
                  className="mt-4"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoveCollection(index)}
                >
                  <CircleX className="text-red-600" />
                </CustomButton>
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Account Code</label>
              <TextInput
                type="text"
                placeholder="Account Code"
                value={collection?.accountCode || ""}
                onChange={(e) => handleCollectionChange(index, "accountCode", e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm text-gray-500 caret-transparent"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <CustomButton variant="yellow" onClick={handleAddCollection}>
          Add Collection
        </CustomButton>
        <CustomButton variant={"ghost"} className="ml-2" onClick={handleAddOtherCollection}>
          Add Other Collection
        </CustomButton>
      </div>
      <div className="flex justify-end mt-4">
        <CustomButton variant="cancel" className="mr-2" onClick={onClose}>
          Cancel
        </CustomButton>
        <CustomButton onClick={handleAdd} variant="green">
          Save
        </CustomButton>
      </div>
      {showAddOtherCollectionModal && (
        <AddNonExistingCollectionModal
          onClose={() => setShowAddOtherCollectionModal(false)}
          onSave={() => {
            setShowAddOtherCollectionModal(false);
          }}
        />
      )}
    </CustomModal>
  );
};
