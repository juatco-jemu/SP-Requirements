import React from "react";
import { CustomModal } from "../../../components/CustomModal.tsx";
import { CustomButton } from "../../../components/ui/CustomButton.tsx";

type DeleteConfirmationModalProps = {
  onClose: () => void;
  onDelete: () => void;
};

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onClose, onDelete }) => {
  return (
    <CustomModal onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Delete Transaction</h2>
      <p>Are you sure you want to delete this transaction?</p>
      <div className="flex justify-end mt-4">
        <CustomButton onClick={onClose}>Cancel</CustomButton>
        <CustomButton onClick={onDelete} variant="cancel">
          Delete
        </CustomButton>
      </div>
    </CustomModal>
  );
};
