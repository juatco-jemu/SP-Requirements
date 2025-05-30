import React from "react";
import { CustomModal } from "./CustomModal";
import { CustomButton } from "./ui/CustomButton";

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
        <CustomButton variant="green" onClick={onClose}>
          Close
        </CustomButton>
      </div>
    </CustomModal>
  );
};
