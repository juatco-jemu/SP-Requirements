import { CollectionDetails, TransactionDetails } from "../../../../../data/models/TransactionModel.tsx";
import React from "react";
import { CustomButton } from "../../../../../components/ui/CustomButton.tsx";
import { CustomModal } from "../../../../../components/CustomModal.tsx";

type TableData = TransactionDetails & CollectionDetails;

export const columnsData: Array<{
  header: string;
  accessor: keyof TableData | "actions" | "accountCode" | any;
  render?: (transaction: TableData) => JSX.Element;
}> = [
  { header: "Date", accessor: "createdAt" },
  { header: "Reference/\nOR No./DS", accessor: "refNumber" },
  { header: "Responsibility Center Code", accessor: "responsibilityCode" },
  { header: "Name of\nPayor", accessor: "userName" },
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
