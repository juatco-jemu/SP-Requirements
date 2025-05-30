import React, { useEffect, useState } from "react";
import { QueueSidebar } from "../../features/queue-system/QueueSidebar.tsx";
import { useTransactions } from "../../context/TransactionContext.tsx";
import { useClientDetails } from "../../context/ClientDetailsContext.tsx";
import { useLocation } from "react-router-dom";
import { formatMoney } from "../../utils/formatting.tsx";
import { CustomTable } from "../../components/CustomTable.tsx";
import { BackButton } from "../../components/ui/BackButton.tsx";
import { CustomButton } from "../../components/ui/CustomButton.tsx";
import { AddTransactionModal } from "../../features/transaction-history/components/AddTransactionModalComponent.tsx";

type PayorCollectionData = {
  date: string;
  refNumber: string;
  collectionAmount: number;
  natureOfCollection: string;
};

const columns: Array<{ header: string; accessor: keyof PayorCollectionData }> = [
  { header: "Date", accessor: "date" },
  { header: "Ref/OR No.", accessor: "refNumber" },
  { header: "Nature of Collection", accessor: "natureOfCollection" },
  { header: "Collection", accessor: "collectionAmount" },
];

export function PayorDetailsPages() {
  const { loading, error, getTransactionsByClientName } = useTransactions();
  const { getClientDetails } = useClientDetails();
  const [clientDetails, setClientDetails] = useState<any>(null);
  const [clientTransactions, setClientTransactions] = useState<any[]>([]);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);

  const location = useLocation();
  const clientIdFromNav = location.state?.clientId;

  useEffect(() => {
    if (clientIdFromNav) {
      getClientDetails(clientIdFromNav).then((data) => {
        setClientDetails(data);
      });
    }
  }, [clientIdFromNav, getClientDetails]);

  useEffect(() => {
    async function fetchTransactions() {
      if (clientDetails && clientDetails.name) {
        const data = await getTransactionsByClientName(clientDetails.name);
        setClientTransactions(data);
        // console.log("Client transactions:", clientDetails);
      }
    }
    fetchTransactions();
  }, [clientDetails, getTransactionsByClientName, clientTransactions]);

  const handleRefreshTransactions = async () => {
    console.log("refreshing transactions");
  };

  const flattenedData = clientTransactions.flatMap((transaction) =>
    transaction.collections.map((collection: { name: string; amount: number }) => ({
      date: new Date(transaction.createdAt).toLocaleDateString(),
      refNumber: transaction.refNumber || "N/A",
      natureOfCollection: collection.name,
      collectionAmount: formatMoney(collection.amount),
    }))
  );

  return (
    <div className="h-full flex flex-grow overflow-hidden">
      <div className="w-96 bg-gray-100 overflow-y-auto">
        <QueueSidebar />
      </div>
      <div className="mt-6 ml-3">
        <BackButton />
      </div>
      <div className="flex-grow overflow-y-auto ml-6">
        <>
          <h1 className="text-2xl font-bold mt-6">Payor Details</h1>
          <div className="flex justify-between w-1/2 py-6">
            <div>
              <h3 className="text-lg font-semibold">Name: {clientDetails?.name || "N/A"}</h3>
              <h3 className="text-lg font-semibold">
                Student Number: {clientDetails?.studentInfo?.studentNumber || "N/A"}
              </h3>
            </div>
            <div>
              <h3 className="text-lg font-semibold">College: {clientDetails?.studentInfo?.college || "N/A"}</h3>
              <h3 className="text-lg font-semibold">Email: {clientDetails?.studentInfo?.email || "N/A"}</h3>
            </div>
          </div>
          <div className="flex flex-grow justify-between pt-6">
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <div className="flex mr-6">
              <CustomButton variant="yellow" onClick={() => setShowAddTransactionModal(true)}>
                Add New Collection
              </CustomButton>
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <p>Loading transactions...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <CustomTable columns={columns} data={flattenedData} itemsPerPage={5} />
            )}
            {clientTransactions.length === 0 && (
              <div className="text-center text-gray-500 mt-24">No Collections recorded yet</div>
            )}
            {showAddTransactionModal && (
              <AddTransactionModal
                onSave={handleRefreshTransactions}
                onClose={() => setShowAddTransactionModal(false)}
                client={clientDetails}
                isPayorDetailsPage={true}
              />
            )}
          </div>
        </>
      </div>
    </div>
  );
}
