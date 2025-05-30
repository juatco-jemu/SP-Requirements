import React, { useEffect, useState } from "react";
import { CustomButton } from "../../../components/ui/CustomButton.tsx";
import { CollectionDetails, TransactionDetails } from "../../../data/models/TransactionModel.tsx";
import { CustomModal } from "../../../components/CustomModal.tsx";
import { useTransactions } from "../../../context/TransactionContext.tsx";
import { CustomTable } from "../../../components/CustomTable.tsx";
import { mapFlatter } from "../../../utils/flatMap.js";

type TableData = TransactionDetails & CollectionDetails;

interface ViewTransactionHistoryProps {
  transaction: TransactionDetails | any;

  onClose: () => void;
}

const columns: Array<{
  header: string;
  accessor: keyof TableData | any;
}> = [
  { header: "Reference/\nOR No./DS", accessor: "refNumber" },
  { header: "Name of\nPayor", accessor: "clientName" },
  { header: "Object Code", accessor: "objectCode" },
  { header: "Nature of Collection", accessor: "natureOfCollection" },
  { header: "Account Code", accessor: "accountCode" },
  { header: "MFO/PAP", accessor: "mfoPap" },
  { header: "Collection", accessor: "amount" },
  { header: "GL Code", accessor: "GLCode" },
  { header: "GL Code Description", accessor: "GLCodeDescription" },
  { header: "Created at", accessor: "createdAt" },
  { header: "Updated at", accessor: "updatedAt" },
];

export function ViewTransactionHistory({ transaction, onClose }: ViewTransactionHistoryProps) {
  const [formData, setFormData] = useState<TableData[]>([]);

  const { getTransactionById, loading, error } = useTransactions();

  useEffect(() => {
    const fetchTransaction = async () => {
      const data = await getTransactionById(transaction.id);
      console.log("Transaction data modal:", data);
      let dataHistory = data?.history;
      console.log("Data History:", dataHistory);
      if (dataHistory?.length > 0) {
        const flattenedData = mapFlatter(dataHistory);
        setFormData(flattenedData);
      } else {
        setFormData([]);
      }
    };
    fetchTransaction();
  }, [transaction, getTransactionById]);

  return (
    <CustomModal onClose={onClose} className="w-full max-w-6xl max-h-screen overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">View Transaction History</h3>
      {loading ? (
        <div className="flex justify-center items-center">Loading...</div>
      ) : error ? (
        <div className="flex justify-center items-center">Error: {error}</div>
      ) : formData.length > 0 ? (
        <CustomTable<TableData> columns={columns} data={formData} />
      ) : (
        <div className="flex justify-center items-center mx-6">No transaction history found</div>
      )}
      <div className="flex justify-end mt-3">
        <CustomButton variant="cancel" className="mr-2" onClick={onClose}>
          Close
        </CustomButton>
      </div>
    </CustomModal>
  );
}
