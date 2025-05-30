import React, { useEffect, useState } from "react";
import { CustomModal } from "../../../components/CustomModal.tsx";
import { CustomButton } from "../../../components/ui/CustomButton.tsx";
import { TextInput } from "../../../components/ui/TextInput.tsx";
import { getDefaultQueueExpirationDuration, updateQueueExpirationDuration } from "../api/queueAPI.js";
import { MessageModal } from "../../../components/SuccessModal.tsx";

interface QueueSettingsModalProps {
  onClose: () => void;
}

export const QueueSettingsModal = ({ onClose }: QueueSettingsModalProps) => {
  const [defaultExpiration, setDefaultExpiration] = useState<number | Promise<any>>(2);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    getDefaultQueueExpirationDuration().then((res) => {
      setDefaultExpiration(res);
    });
  }, []);

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    if (!isNaN(value) && Number.isInteger(value)) {
      setDefaultExpiration(value);
    }
  };

  const handleOnSave = async () => {
    const expirationValue = await defaultExpiration;
    if (expirationValue < 1) {
      alert("Default expiration must be at least 1 day");
      return;
    }
    updateQueueExpirationDuration(expirationValue).then(() => {
      setShowSuccessModal(true);
    });
    console.log("Save default expiration");
  };

  return (
    <CustomModal onClose={onClose}>
      <h3 className="text-xl font-semibold mb-2">Queue Settings</h3>
      <label className="block text-sm font-medium text-gray-700 mt-4">Default Expiration of Queues in Days</label>
      <div className="flex flex-row justify-between w-full max-w-5xl">
        <TextInput
          value={defaultExpiration}
          onChange={handleExpirationChange}
          type="number"
          className="mr-4 block w-full border border-gray-300 rounded-md shadow-sm"
          placeholder="Enter number of Days"
        />

        <CustomButton variant="green" className=" px-4" onClick={handleOnSave}>
          Save
        </CustomButton>
      </div>
      <div className="mt-4 flex justify-end gap-4">
        <CustomButton variant="cancel" className="mt-4 px-4" onClick={onClose}>
          Close
        </CustomButton>
      </div>
      {showSuccessModal && (
        <MessageModal
          message="Default Queue Duration has been successfully updated! Please wait up to 1 hour to apply settings"
          onClose={onClose}
        />
      )}
    </CustomModal>
  );
};
