import React, { useEffect, useState } from "react";
import { CustomButton } from "../../../components/ui/CustomButton.tsx";
import { TransactionDetails, CollectionDetails } from "../../../data/models/TransactionModel.tsx";
import { CustomModal } from "../../../components/CustomModal.tsx";
import { useTransactions } from "../../../context/TransactionContext.tsx";
import { AddMoreCollectionModal } from "../../../components/AddMoreCollectionModal.tsx";
import { NatureDropdown } from "../../../components/RevolvingFundDropdown.tsx";
import { TextInput } from "../../../components/ui/TextInput.tsx";

interface EditTransactionModalProps {
  transaction: TransactionDetails | CollectionDetails | any;
  onSave: () => void;
  onClose: () => void;
  isEditReceipt?: boolean;
  fundCodeSave?: (fundCode: string) => void;
  initialFundCode?: string;
  saveCheckDetails?: (checkDetails: { checkDate: string; bankName: string; checkNumber: string }) => void;
  initialCheckDetails?: { checkDate: string; bankName: string; checkNumber: string };
}

export function EditTransactionModal({
  transaction,
  onSave,
  onClose,
  isEditReceipt,
  fundCodeSave,
  saveCheckDetails,
  initialFundCode,
  initialCheckDetails,
}: EditTransactionModalProps) {
  const [formData, setFormData] = useState<TransactionDetails>({
    ...transaction,
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { getTransactionById, updateTransactionData, loading, error } = useTransactions();
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const [collections, setCollections] = useState<CollectionDetails[]>(formData?.collections || []);
  const [fundCodeState, setFundCode] = useState<string>(initialFundCode || "164");
  const [checkDate, setCheckDate] = useState<string>(initialCheckDetails?.checkDate || "");
  const [checkBank, setCheckBank] = useState<string>(initialCheckDetails?.bankName || "");
  const [checkNumber, setCheckNumber] = useState<string>(initialCheckDetails?.checkNumber || "");

  useEffect(() => {
    const fetchTransaction = async () => {
      const data = await getTransactionById(transaction.id);
      setFormData(data);
      setCollections(data.collections);
      console.log("Transaction data:", data);
    };
    fetchTransaction();
  }, [transaction, getTransactionById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      setFormData((prev: any) => ({
        ...prev,
        clientDetails: {
          ...prev.clientDetails,
          name: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCollectionChange = (index: number, field: string, value: string) => {
    console.log("Collection change:", index, field, value);
    const newCollections = [...collections];
    (newCollections[index] as any)[field] = value;
    if (field === "amount") {
      newCollections[index].amount = parseFloat(value);
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      collections: newCollections,
    }));
  };

  const handleSave = async () => {
    console.log("FormData", formData);
    console.log("Saving transaction:", transaction.id);
    await updateTransactionData(transaction.id, formData);
    setShowSuccessMessage(true);
    onSave();
    if (isEditReceipt && fundCodeState) {
      if (fundCodeSave) {
        fundCodeSave(fundCodeState || "164");
        if (formData.paymentMethod === "Check" || formData.paymentMethod === "ADA/Bank Transfers") {
          saveCheckDetails?.({
            checkDate: checkDate,
            bankName: checkBank,
            checkNumber: checkNumber,
          });
        }
      }
    }
  };

  const handleAddMoreCollection = (newCollections: any) => {
    setCollections(newCollections);
    setFormData((prevFormData) => ({
      ...prevFormData,
      collections: newCollections,
    }));
    setShowAddCollectionModal(false);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center">Loading...</div>
      ) : error ? (
        <div className="flex justify-center items-center">Error: {error}</div>
      ) : (
        <CustomModal
          onClose={onClose}
          className={`w-full ${
            isEditReceipt && (formData.paymentMethod === "Check" || formData.paymentMethod === "ADA/Bank Transfers")
              ? "max-w-5xl"
              : "max-w-3xl"
          } max-h-screen overflow-y-auto`}
        >
          <h3 className="text-xl font-semibold mb-4">Edit Transaction</h3>
          <div className="flex gap-4">
            <div className="flex w-[300px] flex-col gap-4">
              <div className="mb-4">
                <label className="block text-m font-medium text-gray-700">Date</label>
                <TextInput
                  readOnly={true}
                  type="text"
                  name="date"
                  value={new Date(formData.createdAt).toLocaleDateString()}
                  onChange={handleInputChange}
                  className="mt-2 block w-full border border-gray-300 text-gray-500 rounded-md shadow-sm bg-gray-100 no-select"
                />
              </div>
              {isEditReceipt && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Fund Code</label>
                  <TextInput
                    type="text"
                    value={fundCodeState}
                    onChange={(e) => {
                      setFundCode(e.target.value);
                    }}
                    placeholder="eg. 164"
                    className="mt-1 w-full"
                  />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-m font-medium text-gray-700">Payor Name</label>

                <TextInput
                  type="text"
                  name="name" // Bind to formData.refNumber
                  value={formData.clientDetails?.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border text-gray-500 border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-m font-medium text-gray-700">Reference/OR No</label>
                <TextInput
                  type="text"
                  name="refNumber" // Bind to formData.refNumber
                  value={formData.refNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border text-gray-500 border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
            {isEditReceipt &&
              (formData.paymentMethod === "Check" || formData.paymentMethod === "ADA/Bank Transfers") && (
                <div className="flex w-full max-w-sm flex-col gap-4">
                  <label className="block text-m font-medium text-gray-700">Check Information</label>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <TextInput
                      type="text"
                      value={checkDate}
                      onChange={(e) => {
                        setCheckDate(e.target.value);
                      }}
                      placeholder="eg. MM/DD/YYYY"
                      className="mt-1 w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Drawee Bank</label>
                    <TextInput
                      type="text"
                      value={checkBank}
                      onChange={(e) => {
                        setCheckBank(e.target.value);
                      }}
                      placeholder="eg. BPI"
                      className="mt-1 w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Number</label>
                    <TextInput
                      type="text"
                      value={checkNumber}
                      onChange={(e) => {
                        setCheckNumber(e.target.value);
                      }}
                      placeholder="eg. 123456789"
                      className="mt-1 w-full"
                    />
                  </div>
                </div>
              )}
            {/* collections column */}
            <div>
              <label className="block text-m font-medium text-gray-700 sticky">Collections</label>

              {/* div for collections */}
              <div className="mt-2 overflow-y-auto max-h-96">
                {collections.map((collection, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 mb-4 mr-2 p-4 flex-col border-2 border-gray-300 rounded-md"
                  >
                    <div className="flex items-center gap-4">
                      <div style={{ width: "250px" }}>
                        <label className="block text-sm font-medium text-gray-700 sticky mb-1">
                          Nature Of Collection
                        </label>

                        <NatureDropdown
                          onSelect={(selectedOption) => {
                            if (selectedOption) {
                              handleCollectionChange(index, "name", selectedOption.nature);
                              handleCollectionChange(index, "accountCode", selectedOption.accountCode);
                              handleCollectionChange(index, "responsibilityCode", selectedOption.responsibilityCode);
                              handleCollectionChange(index, "objectCode", selectedOption.objectCode);
                              handleCollectionChange(index, "GLCode", selectedOption.objectCode);
                              handleCollectionChange(index, "objectDescription", selectedOption.objectDescription);
                              handleCollectionChange(index, "mfoPap", selectedOption.mfoPap);
                            }
                            if (selectedOption?.nature === "Cancelled OR") {
                              handleCollectionChange(index, "amount", "0");
                            }
                          }}
                          placeholder={collection.name}
                        />
                      </div>
                      <div className="flex-col gap-4 justify-center">
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <TextInput
                          type="number"
                          name="amount"
                          value={collection.amount}
                          onChange={(e) => handleCollectionChange(index, "amount", e.target.value)}
                          className="mt-1 block w-1/2 border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>
                    {/* div for 2 columns */}
                    <div className="flex gap-4 w-full p-3 justify-around">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Account Code</label>
                        <TextInput
                          type="text"
                          name="accountCode"
                          value={collection.accountCode}
                          onChange={(e) => handleCollectionChange(index, "accountCode", e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                        <label className="mt-2 block text-sm font-medium text-gray-700">Responsibility Code</label>
                        <TextInput
                          type="text"
                          name="responsibilityCode"
                          value={collection.responsibilityCode}
                          onChange={(e) => handleCollectionChange(index, "responsibilityCode", e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Object Code</label>
                        <TextInput
                          type="text"
                          name="objectCode"
                          value={collection.objectCode}
                          onChange={(e) => handleCollectionChange(index, "objectCode", e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                        <label className=" mt-2 block text-sm font-medium text-gray-700">Object Description</label>
                        <TextInput
                          type="text"
                          name="objectDescription"
                          value={collection.objectDescription}
                          onChange={(e) => handleCollectionChange(index, "objectDescription", e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">MFO/PAP</label>
                        <TextInput
                          type="text"
                          name="mfoPap"
                          value={collection.mfoPap}
                          onChange={(e) => handleCollectionChange(index, "mfoPap", e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <CustomButton
                  variant="ghost"
                  className="pl-1 text-up_green hover:text-up_green_hover hover:bg-gray-200"
                  onClick={() => setShowAddCollectionModal(true)}
                >
                  Add more
                </CustomButton>
              </div>
            </div>
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
      )}
      {showSuccessMessage && (
        <CustomModal onClose={onClose}>
          <h3 className="text-xl font-semibold mb-2">Edit Successful</h3>
          <p>The transaction has been successfully edited</p>
          <div className="mt-4 flex justify-end gap-4">
            <CustomButton className="mt-4 px-4" variant="green" onClick={onClose}>
              Close
            </CustomButton>
          </div>
        </CustomModal>
      )}
      {showAddCollectionModal && (
        <AddMoreCollectionModal
          currentCollections={collections}
          onSave={handleAddMoreCollection}
          onClose={() => setShowAddCollectionModal(false)}
        />
      )}
    </>
  );
}
