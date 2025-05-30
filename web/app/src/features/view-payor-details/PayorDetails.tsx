import React, { useEffect, useState } from "react";
import { CustomButton } from "../../components/ui/CustomButton.tsx";
import { CustomTable } from "../../components/CustomTable.tsx";
import { CustomSearchClientInput } from "../../components/CustomInput.tsx";

import { AddTransactionExistingUserModal } from "./components/AddTransactionForExistingUser.tsx";
import { useTransactions } from "../../context/TransactionContext.tsx";

import { CustomModal } from "../../components/CustomModal.tsx";
import { formatMoney } from "../../utils/formatting.tsx";
import { useClientDetails } from "../../context/ClientDetailsContext.tsx";
import { RefreshCw, Search } from "lucide-react";
import { SearchInput } from "./components/SearchInput.tsx";

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

export function PayorDetailsPage() {
  const [payorDetails, setPayorDetails] = useState<any | null>(null);
  const [studentNotFound, setStudentNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [returnedTransactions, setReturnedTransactions] = useState<any[]>([]);
  const { loading, error, getTransactionsByStudentNumber, getTransactionsByClientName, getTransactionsToday } =
    useTransactions();
  const { getClientDetails } = useClientDetails();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (returnedTransactions.length > 0) {
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  }, [returnedTransactions]);

  const handleSearch = async (searchInput: string) => {
    let transactions: any[] = [];

    // check if the search input is a student number
    if (!isNaN(parseInt(searchInput))) {
      try {
        transactions = await getTransactionsByStudentNumber(searchInput);
      } catch (error) {
        console.error("Error searching for student client details:", error);
      }
    } else {
      try {
        transactions = await getTransactionsByClientName(searchInput);
        console.log("fetched Transactions by client name:", transactions);
      } catch (error) {
        console.error("Error searching for client details:", error);
      }
    }

    if (transactions.length > 0) {
      setReturnedTransactions(transactions);
      let details = await getClientDetails(transactions[0].clientId);
      console.log("Details in details page:", details);
      setPayorDetails(details);
    } else {
      setStudentNotFound(true);
      setReturnedTransactions(transactions);
      setPayorDetails(null);
    }
  };

  const flattenedData = returnedTransactions.flatMap((transaction) =>
    transaction.collections.map((collection: { name: string; amount: number }) => ({
      date: new Date(transaction.createdAt).toLocaleDateString(),
      refNumber: transaction.refNumber || "N/A",
      natureOfCollection: collection.name,
      collectionAmount: formatMoney(collection.amount),
    }))
  );

  const handleRefreshTransactions = () => {
    try {
      getTransactionsToday();
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Search for Payor</h1>

      <div className="flex flex-grow justify-between pt-6">
        {/* <CustomSearchClientInput onSearch={handleSearch} /> */}
        <SearchInput />
      </div>

      {showDetails ? (
        <>
          <h1 className="text-2xl font-bold mt-6">Payor Details</h1>
          <div className="flex justify-between w-1/2 py-6">
            <div>
              <h3 className="text-lg font-semibold">Name: {payorDetails?.name || "N/A"}</h3>

              <h3 className="text-lg font-semibold">
                Student Number: {payorDetails?.studentInfo?.studentNumber || "N/A"}{" "}
              </h3>
            </div>
            <div>
              <h3 className="text-lg font-semibold">College: {payorDetails?.studentInfo?.college || "N/A"}</h3>
              <h3 className="text-lg font-semibold">Email: {payorDetails?.studentInfo?.email || "N/A"}</h3>
            </div>
          </div>

          <div className="flex flex-grow justify-between pt-6">
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <div className="flex">
              <CustomButton onClick={handleRefreshTransactions} variant="ghost" size="icon" className="mr-3">
                <RefreshCw />
              </CustomButton>
              <CustomButton className="px-6 mr-3" onClick={() => setShowModal(true)}>
                Add New Transaction
              </CustomButton>
            </div>
          </div>
          <div className="mt-4">
            {loading ? (
              <p>Loading transactions...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <CustomTable columns={columns} data={flattenedData} />
            )}
            {returnedTransactions.length === 0 && (
              <div className="text-center text-gray-500 mt-24">No Collections recorded yet</div>
            )}
          </div>
        </>
      ) : null}
      {showModal && (
        <AddTransactionExistingUserModal
          userDetails={payorDetails}
          onSave={handleRefreshTransactions}
          onClose={() => setShowModal(false)}
        />
      )}
      {studentNotFound && (
        <CustomModal onClose={() => setStudentNotFound(false)} className="justify-center">
          <h3 className="text-xl font-semibold mb-4">Payor not found!</h3>
          <div className="flex justify-end">
            <CustomButton
              onClick={() => setStudentNotFound(false)}
              variant="default"
              className="bg-up_maroon text-white hover:bg-up_maroon-hover"
            >
              Close
            </CustomButton>
          </div>
        </CustomModal>
      )}
    </div>
  );
}
