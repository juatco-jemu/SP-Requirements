import React from "react";
import { CustomModal } from "./CustomModal.tsx";
import { CustomButton } from "./ui/CustomButton.tsx";

type MessageModalProps = {
  onClose: () => void;
  message: string;
  isError?: boolean;
};

export const MessageModal: React.FC<MessageModalProps> = ({ onClose, message, isError }) => {
  return (
    <CustomModal onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">{isError ? "Error" : "Success"}</h2>
      <p>{message}</p>
      <div className="flex justify-end mt-4">
        <CustomButton variant={isError ? "cancel" : "green"} onClick={onClose}>
          Close
        </CustomButton>
      </div>
    </CustomModal>
  );
};
