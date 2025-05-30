import React from "react";
import { CustomModal } from "../../../components/CustomModal.tsx";
import { CustomButton } from "../../../components/ui/CustomButton.tsx";

interface AnnouncementsModalProps {
  onClose: () => void;
}

export const AnnouncementsModal = ({ onClose }: AnnouncementsModalProps) => {
  return (
    <CustomModal onClose={onClose} className="flex flex-col justify-between w-full max-w-5xl h-96">
      <h3 className="text-xl font-semibold mb-2">Announcements</h3>
      <p className="flex justify-center">Announcements are not yet available</p>
      <div className="mt-4 flex justify-end gap-4">
        <CustomButton variant="cancel" className="mt-4 px-4" onClick={onClose}>
          Close
        </CustomButton>
      </div>
    </CustomModal>
  );
};
