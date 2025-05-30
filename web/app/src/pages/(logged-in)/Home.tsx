import React, { useEffect, useState } from "react";
import { PageHeader } from "../../components/PageHeader.tsx";
import { TransactionSummary } from "../../features/transaction-summary/TransactionSummary.tsx";
import { QueueSidebar } from "../../features/queue-system/QueueSidebar.tsx";
import { TransactionHistory } from "../../features/transaction-history/TransactionHistory.tsx";
import { PayorDetailsPage } from "../../features/view-payor-details/PayorDetails.tsx";
import { CustomButton } from "../../components/ui/CustomButton.tsx";
import { PageFooter } from "../../components/PageFooter.tsx";
import { TransactionProvider } from "../../context/TransactionContext.tsx";
import { ArrowLeft, Search } from "lucide-react";
import { useUser } from "../../context/UserContext.tsx";
import { ClientDetailsProvider } from "../../context/ClientDetailsContext.tsx";
import { SearchInput } from "../../components/SearchInput.tsx";

export function Home() {
  const [showPayorDetails, setShowPayorDetails] = useState(false);
  const { userDisplayName, userDesignation, userLogout } = useUser();
  const [cashierDetails, setCashierDetails] = useState({
    name: "",
    designation: "",
  });

  useEffect(() => {
    setCashierDetails({
      name: userDisplayName,
      designation: userDesignation,
    });
  }, [userDisplayName, userDesignation]);

  return (
    <div className="h-full flex flex-grow overflow-hidden">
      <div className="w-96 bg-gray-100 overflow-y-auto">
        <QueueSidebar />
      </div>

      <div className="flex-grow overflow-y-auto">
        <TransactionSummary />
        <TransactionHistory />
      </div>
    </div>
  );
}
