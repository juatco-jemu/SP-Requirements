import React from "react";
import { CustomModal } from "../../../../components/CustomModal.tsx";
import { CustomButton } from "../../../../components/ui/CustomButton.tsx";

type SuccessModalProps = {
  onClose: () => void;
  message: string;
};

export const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, message }) => {
  return (
    <CustomModal onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Success</h2>
      <p>{message}</p>
      <div className="flex justify-end mt-4">
        <CustomButton onClick={onClose}>Close</CustomButton>
      </div>
    </CustomModal>
  );
};
