import React from "react";
import { CustomModal } from "../../../components/CustomModal.tsx";
import { CustomButton } from "../../../components/ui/CustomButton.tsx";

type ConfirmationModalProps = {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmationModal({ title, message, onCancel, onConfirm }: ConfirmationModalProps) {
  return (
    <CustomModal onClose={onCancel}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{message}</p>
      <div className="mt-4 flex justify-end gap-4">
        <CustomButton variant="cancel" className="mt-4 px-4" onClick={onCancel}>
          No
        </CustomButton>
        <CustomButton variant="green" className="mt-4 px-4" onClick={onConfirm}>
          Yes
        </CustomButton>
      </div>
    </CustomModal>
  );
}
