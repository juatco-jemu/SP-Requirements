import React from "react";
import { CustomButton } from "../../../components/ui/CustomButton.tsx";

type QueueItemProps = {
  queue: { id: string; queueIndex: number };
  // queueIndex: number;
  onClick: () => void;
  ticketNumber: string;
  isPendingList?: boolean;
};

export function QueueItem({ queue, ticketNumber, onClick, isPendingList }: QueueItemProps) {
  return (
    <CustomButton
      onClick={onClick}
      className="py-3 px-5 rounded text-center"
      variant={isPendingList ? "cancel" : "green"}
    >
      Ticket No. {ticketNumber}
    </CustomButton>
  );
}
