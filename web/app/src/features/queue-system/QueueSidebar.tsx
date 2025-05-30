import React, { useState, useEffect } from "react";
import { QueueItem } from "./components/QueueItem.tsx";
import { QueueModal } from "./components/QueueModal.tsx";
import { listenToQueue, listenToPastQueue } from "./api/queueAPI.js";
import { useTransactions } from "../../context/TransactionContext.tsx"; // Import the hook
import { formattedDate, formattedQueueNumber } from "../../utils/formatting.tsx";
import { CustomButton } from "../../components/ui/CustomButton.tsx";
import { ArrowRight, ChevronLeft, ChevronRight, Megaphone, Settings } from "lucide-react";
import { QueueSettingsModal } from "./components/QueueSettingsModal.tsx";
import { AnnouncementsModal } from "./components/AnnouncementModal.tsx";
import { Timestamp } from "firebase/firestore";

interface QueueItems {
  id: string;
  uid: string;
  queueIndex: number;
  refNumber: string;
  date: string;
  userName: string;
  college: string;
  collections: { amount: number; name: string }[];
  studentNumber: string;
  email: string;
  expiresAt: Timestamp;
  createdAt: Timestamp;
  ticketNumber: string;
  transactionId: string;
}

export function QueueSidebar() {
  const [selectedQueue, setSelectedQueue] = useState<null | QueueItems>(null);
  const { transactions, getTransactionsToday } = useTransactions(); // Use the context
  const [queueList, setQueueList] = useState<QueueItems[]>([]);
  const [pastQueueList, setPastQueueList] = useState<QueueItems[]>([]);
  const [showQueueSettings, setShowQueueSettings] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [pendingQueues, setPendingQueues] = useState(false);

  const formattedQueuePrefix = formattedQueueNumber();

  useEffect(() => {
    // This will automatically update when the transactions are refreshed
    // console.log("Transactions updated:", transactions);
  }, [transactions]); // Re-render on transaction update

  const yearMonthDate = formattedDate();
  // console.log("Year-Month-Date:", yearMonthDate);

  useEffect(() => {
    const unsubscribe = listenToQueue(yearMonthDate, (newQueue: React.SetStateAction<QueueItems[]>) => {
      setQueueList(newQueue); // Assuming newQueue is an array of queues
    });

    return () => unsubscribe();
  }, [yearMonthDate]);

  useEffect(() => {
    const unsubscribePast = listenToPastQueue((newQueue: React.SetStateAction<QueueItems[]>) => {
      console.log("Past Queue List:", newQueue);
      setPastQueueList(newQueue); // Assuming newQueue is an array of queues
    });

    return () => unsubscribePast();
  }, []);

  const handleQueueClick = (queue: QueueItems) => {
    setSelectedQueue(queue);
  };

  const handleRemoveQueue = () => {
    console.log("Removing queue:", selectedQueue);
    setSelectedQueue(null);
  };

  const closeModal = () => {
    setSelectedQueue(null);
  };

  const handleRefreshTransactions = () => {
    // Refresh transactions
    getTransactionsToday();
  };

  return (
    <aside className="flex flex-col h-full overflow-y-auto scrollbar-hidden ml-1 bg-gray-100 px-4 pb-4">
      {pendingQueues ? (
        <>
          <div className="flex flex-row sticky top-0 bg-gray-100 z-10 justify-between items-center py-4">
            <h2 className="font-bold text-xl">Pending Queues</h2>
            <div className="flex gap-0">
              <CustomButton variant="ghost" onClick={() => setPendingQueues(false)}>
                <ChevronLeft className="text-up_green" />
              </CustomButton>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {pastQueueList.length === 0 && <div className="text-center text-gray-500 mt-24">No queues available</div>}
            {pastQueueList.map((queue) => (
              <QueueItem
                key={queue.ticketNumber}
                queue={queue}
                onClick={() => handleQueueClick(queue)}
                ticketNumber={queue.ticketNumber}
                isPendingList={true}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-row sticky top-0 bg-gray-100 z-10 justify-between items-center py-4">
            <h2 className="font-bold text-xl">Payment Queues</h2>
            <div className="flex gap-0">
              {/* <CustomButton variant="ghost" onClick={() => setShowAnnouncement(true)}>
                <Megaphone className="text-up_green" />
              </CustomButton> */}
              <CustomButton variant="ghost" onClick={() => setShowQueueSettings(true)}>
                <Settings className="text-up_maroon" />
              </CustomButton>
              <CustomButton variant="ghost" onClick={() => setPendingQueues(true)}>
                <ChevronRight className="text-up_green" />
              </CustomButton>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {queueList.length === 0 && <div className="text-center text-gray-500 mt-24">No queues available</div>}
            {queueList.map((queue) => (
              <QueueItem
                key={queue.queueIndex}
                queue={queue}
                onClick={() => handleQueueClick(queue)}
                ticketNumber={queue.ticketNumber}
                isPendingList={false}
              />
            ))}
          </div>
        </>
      )}
      {selectedQueue && (
        <QueueModal
          selectedQueue={selectedQueue}
          closeModal={closeModal}
          onRemoveQueue={handleRemoveQueue}
          onTransactionSaved={handleRefreshTransactions}
          ticketNumber={selectedQueue.ticketNumber}
        />
      )}
      {showQueueSettings && <QueueSettingsModal onClose={() => setShowQueueSettings(false)} />}
      {showAnnouncement && <AnnouncementsModal onClose={() => setShowAnnouncement(false)} />}
    </aside>
  );
}
