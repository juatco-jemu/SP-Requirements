import React, { useEffect, useState } from "react";
import { useTransactions } from "../../context/TransactionContext.tsx"; // Import the custom hook
import { AddTransactionModal } from "./components/AddTransactionModalComponent.tsx";
import { Pencil, ReceiptText, RefreshCw, History } from "lucide-react";
import { CustomButton } from "../../components/ui/CustomButton.tsx";
import { CollectionDetails, TransactionDetails } from "../../data/models/TransactionModel.tsx";
import { GenerateCRRFile } from "./features/generateCRRPDF.tsx";
import { CustomTable } from "../../components/CustomTable.tsx";
import { EditTransactionModal } from "./components/EditTransactionModal.tsx";
import { SuccessModal } from "./components/ui/SuccessModal.tsx";
import { GenerateRCDFile } from "./features/generateRCD.tsx";
import { GenerateReceiptFile } from "./features/print-receipt/features/generateReceipt.tsx";

import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
import { ViewTransactionHistory } from "./components/TransactionHistoryModal.tsx";
import { mapFlatter } from "../../utils/flatMap.js";

type TableData = TransactionDetails & CollectionDetails;

export function TransactionHistory() {
  const { transactions, loading, error, getTransactionsByDateRange, getTransactionsToday, getTransactionById } =
    useTransactions();
  const [data, setData] = useState<TableData[]>([]);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [showCRRPDFModal, setShowCRRPDFModal] = useState(false);
  const [showRCDPDFModal, setShowRCDPDFModal] = useState(false);
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetails>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showGenerateReceiptModal, setShowGenerateReceiptModal] = useState(false);
  const [showTransactionHistoryModal, setShowTransactionHistoryModal] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [sortBy, setSortBy] = useState<string>("createdAt");

  const columns: Array<{
    header: string;
    accessor: keyof TableData | "actions" | "accountCode" | any;
    render?: (transaction: TableData) => JSX.Element;
  }> = [
    { header: "Date", accessor: "createdAtDate" },
    { header: "Reference/\nOR No./DS", accessor: "refNumber" },
    { header: "Responsibility Center Code", accessor: "responsibilityCode" },
    { header: "Name of\nPayor", accessor: "clientName" },
    { header: "Object Code", accessor: "objectCode" },
    { header: "Nature of\nCollection", accessor: "natureOfCollection" },
    { header: "Account Code", accessor: "accountCode" },
    { header: "MFO/PAP", accessor: "mfoPap" },
    { header: "Collection", accessor: "amount" },
    { header: "GL Code", accessor: "GLCode" },
    { header: "GL Code\nDescription", accessor: "GLCodeDescription" },

    {
      header: "Actions",
      accessor: "actions",
      render: (transaction: TableData) => (
        <div className="flex mt-4">
          <CustomButton
            size="icon"
            variant="ghost"
            className="text-up_yellow"
            onClick={() => {
              setSelectedTransaction(transaction);
              setShowEditTransactionModal(true);
            }}
          >
            <Pencil />
          </CustomButton>
          <CustomButton
            size="icon"
            variant="ghost"
            className="ml-2 text-up_green"
            onClick={() => {
              setSelectedTransaction(transaction);
              console.log("Selected transaction:", transaction);
              setShowGenerateReceiptModal(true);
            }}
          >
            <ReceiptText />
          </CustomButton>
          <CustomButton
            size="icon"
            variant="ghost"
            className="ml-2 text-up_green"
            onClick={() => {
              setSelectedTransaction(transaction);
              setShowTransactionHistoryModal(true);
            }}
          >
            <History />
          </CustomButton>
        </div>
      ),
    },
  ];

  useEffect(() => {
    handleRefreshTransactions();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      const fetchData = async () => {
        try {
          const data = await Promise.all(transactions.map((transaction) => getTransactionById(transaction.id)));
          const flattenedData = mapFlatter(data);
          setData(flattenedData);
        } catch (error) {
          console.error("Error fetching transaction details, error:", error);
        }
      };
      fetchData();
    } else {
      setData([]);
    } // Reset the data if transactions are empty
  }, [transactions, getTransactionById]);

  const handleFilter = async () => {
    try {
      getTransactionsByDateRange(startDate, endDate, sortBy);
    } catch (error) {
      console.error("Error filtering transactions by date:", error);
    }
  };

  const handleResetFilter = async () => {
    setStartDate(new Date());
    setEndDate(new Date());
    try {
      await getTransactionsToday();
    } catch (error) {
      console.error("Error resetting filter:", error);
    }
  };

  const handleRefreshTransactions = async () => {
    try {
      await getTransactionsToday();
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    }
  };

  const handleDateChange = (date: Date | [Date, Date] | null) => {
    if (Array.isArray(date)) {
      setStartDate(date[0]);
      setEndDate(date[1]);
    } else {
      getTransactionsToday();
    }
  };
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Collection History</h1>
      <div className="flex flex-grow justify-between">
        <div className="flex items-center">
          <DateRangePicker
            preventOverflow
            onChange={handleDateChange}
            format="MM/dd/yyyy"
            character=" to "
            value={[startDate, endDate]}
            defaultCalendarValue={[new Date(), new Date()]}
          />
          <div className="flex items-center">
            <label htmlFor="sort-by" className="mr-2">
              Sort By:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-md"
            >
              <option value="createdAt">Date</option>
              <option value="refNumber">Reference Number</option>
            </select>
          </div>
          <CustomButton className="ml-3 px-4 bg-up_yellow hover:bg-up_yellow-hover" onClick={handleFilter}>
            Filter
          </CustomButton>
          <CustomButton
            className="ml-3 px-4 bg-up_maroon text-white hover:bg-up_maroon-hover hover:text-white"
            onClick={handleResetFilter}
          >
            Reset
          </CustomButton>
        </div>
        <div className="flex">
          <CustomButton onClick={handleRefreshTransactions} variant="ghost" size="icon" className="mr-3">
            <RefreshCw />
          </CustomButton>
          <CustomButton variant="yellow" onClick={() => setShowAddTransactionModal(true)}>
            Add New Collection
          </CustomButton>
          <CustomButton variant="green" onClick={() => setShowCRRPDFModal(true)} className="ml-3">
            Generate CRR
          </CustomButton>
          <CustomButton variant="green" onClick={() => setShowRCDPDFModal(true)} className="ml-3">
            Generate RCD
          </CustomButton>
        </div>
      </div>
      <div className="mt-3">
        {loading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-500 mt-24">No transactions found</div>
        ) : (
          <CustomTable<TableData>
            columns={columns}
            data={data}
            itemsPerPage={5}
            boldColumns={["refNumber", "amount", "clientName"]}
          />
        )}

        {showAddTransactionModal && (
          <AddTransactionModal onSave={handleRefreshTransactions} onClose={() => setShowAddTransactionModal(false)} />
        )}
        {showCRRPDFModal && (
          <GenerateCRRFile
            columns={columns}
            data={data}
            onClose={() => setShowCRRPDFModal(false)}
            excludedColumns={["GLCode", "mfoPap", "college", "actions", "GLCodeDescription", "responsibilityCode"]}
            additionalColumns={[{ header: "Deposit" }, { header: "Undeposited Collections" }]}
          />
        )}
        {showRCDPDFModal && (
          <GenerateRCDFile
            columns={columns}
            data={data}
            onClose={() => setShowRCDPDFModal(false)}
            excludedColumns={["college", "actions", "objectCode", "accountCode"]}
          />
        )}
        {showEditTransactionModal && (
          <EditTransactionModal
            transaction={selectedTransaction}
            onSave={handleRefreshTransactions}
            onClose={() => setShowEditTransactionModal(false)}
          />
        )}

        {showSuccessModal && (
          <SuccessModal
            onClose={() => {
              setShowSuccessModal(false);
              setSuccessMessage("");
            }}
            message={successMessage}
          />
        )}

        {showGenerateReceiptModal && selectedTransaction && (
          <GenerateReceiptFile transaction={selectedTransaction} onClose={() => setShowGenerateReceiptModal(false)} />
        )}
        {showTransactionHistoryModal && (
          <ViewTransactionHistory
            transaction={selectedTransaction}
            onClose={() => setShowTransactionHistoryModal(false)}
          />
        )}
      </div>
    </div>
  );
}
