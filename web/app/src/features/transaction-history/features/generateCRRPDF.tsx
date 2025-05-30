import React, { useEffect, useState } from "react";
import { CustomButton } from "../../../components/ui/CustomButton.tsx";
import { Document, Page, Text, View, PDFViewer } from "@react-pdf/renderer";
import { useTransactions } from "../../../context/TransactionContext.tsx";
import { pdfStyles as styles } from "./components/ui/pdfStyles.tsx";
import { formatMoney, formattedDateTodayStringLong, formattedDisplayDateToday } from "../../../utils/formatting.tsx";
import { AddDepositsModal } from "../components/AddDepositsModal.tsx";
import { CustomModal } from "../../../components/CustomModal.tsx";
import { useUser } from "../../../context/UserContext.tsx";

type GenerateCRRFileProps = {
  columns: Array<{ header: string; accessor: string }>;
  data: any[];
  onClose: () => void;
  excludedColumns?: string[];
  additionalColumns?: Array<{ header: string; accessor?: string }>;
};

type CollectionDeposit = {
  amount: number;
  depositName: string;
  date: string;
};

const crrHeaderTitle = "CASH RECEIPTS RECORD";
const dateToday = formattedDateTodayStringLong();
const certificationMessage =
  "I hereby certify on my official oath that the foregoing is a correct and complete record\n" +
  "of all collections and deposits had by me in my capacity as Collecting Officer of UPLB Cashier's Office\n" +
  `during the period of ${dateToday} to ${dateToday}, inclusives, as indicated in the corresponding columns.`;

export const GenerateCRRFile = ({
  columns,
  data,
  onClose,
  excludedColumns = [],
  additionalColumns = [],
}: GenerateCRRFileProps) => {
  const { transactions } = useTransactions(); // Use the context to get the transactions data
  const [totalAmountCollected, setTotalAmountCollected] = useState(0);
  const [showAddDepositsModal, setShowAddDepositsModal] = useState(false);
  const [deposits, setDeposits] = useState<{ amount: number; depositName: string; date: string }[]>([]);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const { userDisplayName, userDesignation } = useUser();

  const accountableOfficer = userDisplayName || "Juan Dela Cruz";
  const officialDesignation = userDesignation || "Cashier";
  useEffect(() => {
    if (transactions.length > 0) {
      setTotalAmountCollected(
        transactions.reduce((acc, transaction) => {
          // Calculate the total amount from all collections
          return (
            acc + transaction.collections.reduce((sum: number, c: { amount: string }) => sum + parseFloat(c.amount), 0)
          );
        }, 0)
      );
    }
  }, [transactions]);

  // Function to generate the table body, excluding specific columns
  const generateTableBody = () => {
    return data.map((row, rowIndex) => (
      <View style={styles.tableRow} key={rowIndex}>
        {columns
          .filter((col) => !excludedColumns.includes(col.accessor)) // Exclude columns based on accessor
          .map((col, colIndex) => (
            <Text style={styles.tableCell} key={colIndex}>
              {row[col.accessor]}
            </Text>
          ))}
        {renderAdditionalColumnBody(row)}
      </View>
    ));
  };

  // Function to generate the table header, excluding specific columns
  const generateTableHeader = () => {
    return columns
      .filter((col) => !excludedColumns.includes(col.accessor)) // Exclude columns based on accessor
      .map((col, index) => (
        <Text style={styles.boldTableCell} key={index}>
          {col.header}
        </Text>
      ));
  };

  const renderAdditionalColumnHeaders = () => {
    return additionalColumns.map((col, index) => (
      <Text style={styles.boldTableCell} key={index}>
        {col.header}
      </Text>
    ));
  };

  const renderAdditionalColumnBody = (row: any) => {
    return additionalColumns.map((col, index) => (
      <Text style={styles.tableCell} key={index}>
        {col.accessor ? row[col.accessor] : ""} {/* If accessor exists, show data */}
      </Text>
    ));
  };

  const renderEmptyCells = (count: number) => {
    return Array.from({ length: count }).map((_, index) => (
      <Text style={styles.tableCell} key={index}>
        {" "}
      </Text>
    ));
  };

  const renderAdditionalDeposits = (collections: any[]) => {
    return (
      <View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>{formattedDisplayDateToday()}</Text>
          <Text style={[styles.tableCell, styles.boldTableCell]}>DEPOSITS</Text>
          {renderEmptyCells(7)} {/* Empty cells for additional columns if necessary */}
        </View>
        {collections.map((collection, index) => (
          <View key={index} style={styles.tableRow}>
            {renderEmptyCells(2)} {/* Empty cells for all columns except the 6th one */}
            <Text style={styles.tableCell}>{collection.depositName}</Text>
            <Text style={styles.tableCell}>{collection.date}</Text>
            {renderEmptyCells(3)} {/* Empty cells for additional columns if necessary */}
            <Text style={styles.tableCell}>{formatMoney(collection.amount)}</Text>
            {renderEmptyCells(1)} {/* Empty cells for additional columns if necessary */}
          </View>
        ))}
        <View style={styles.tableRow}>
          {renderEmptyCells(2)} {/* Empty cells for all columns except the 6th one */}
          <Text style={styles.boldTableCell}>TOTAL</Text>
          {renderEmptyCells(3)} {/* Empty cells for additional columns if necessary */}
          <Text style={styles.boldTableCell}>{formatMoney(totalAmountCollected)}</Text>
          <Text style={styles.boldTableCell}>{formatMoney(totalDeposits)} </Text>
          {renderEmptyCells(1)} {/* Empty cells for additional columns if necessary */}
        </View>
      </View>
    );
  };

  const handleAddDeposits = () => {
    setShowAddDepositsModal(true);
  };

  const handleOnSave = (newCollections: CollectionDeposit[], newTotalDeposits: number) => {
    setDeposits(newCollections);
    setTotalDeposits(newTotalDeposits);
    setShowAddDepositsModal(false);
  };
  const rowsPerPage = 17;
  const totalPages = Math.floor(data.length / rowsPerPage) + 1;

  const Header = () => {
    return (
      <>
        {/* Add Header */}
        <Text style={[styles.header, { marginTop: 20 }]}>{crrHeaderTitle}</Text>
        <Text style={styles.subheader}>Agency</Text>

        {/* Add Admin Info */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              <View style={styles.columnStack}>
                <Text style={styles.nameLabel}>{accountableOfficer}</Text> {/* Name */}
                <Text>{"\n"}Accountable Officer</Text> {/* Title */}
              </View>
            </Text>
            <Text style={styles.tableCell}>
              <View style={styles.columnStack}>
                <Text style={styles.nameLabel}>{officialDesignation}</Text> {/* Name */}
                <Text>{"\n"}Official Designation</Text> {/* Title */}
              </View>
            </Text>
            <View style={styles.tableCell}>
              <Text style={styles.nameLabel}>UPLB Cashier's Office</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const Footer = () => (
    <View style={styles.footer}>
      <Text>Automatically generated report</Text>
    </View>
  );

  const pdfDocument = (
    <Document>
      {/* Set the page size to A4 landscape */}

      {Array.from({ length: totalPages }, (_, pageIndex) => {
        const startRow = pageIndex * rowsPerPage;
        const endRow = startRow + rowsPerPage;
        const pageData = data.slice(startRow, endRow);
        return (
          <Page key={pageIndex} size="A4" orientation="landscape" style={styles.page}>
            {pageIndex === 0 && <Header />}
            {/* Table with Data */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                {generateTableHeader()}
                {renderAdditionalColumnHeaders()}
              </View>
              {pageData.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.tableRow}>
                  {columns.map(
                    (column, colIndex) =>
                      !excludedColumns.includes(column.accessor) && (
                        <Text key={colIndex} style={styles.tableCell}>
                          {row[column.accessor]}
                        </Text>
                      )
                  )}
                  {renderAdditionalColumnBody(row)}
                </View>
              ))}

              {/* {pageIndex === totalPages - 1 && (
                <View style={styles.tableRow}>
                  {columns
                    .filter((col, index) => index !== 4 && !excludedColumns.includes(col.accessor)) 
                    .map((_col, index) => (
                      <Text style={styles.tableCell} key={index}>

                      </Text>
                    ))}
                  <Text style={styles.boldTableCell}>{formatMoney(totalAmountCollected)}</Text>
                 
                  {renderAdditionalColumnBody({})} 
                </View>
              )} */}

              {pageIndex === totalPages - 1 && renderAdditionalDeposits(deposits)}
            </View>
            {pageIndex === totalPages - 1 && (
              <>
                <View break>
                  <View style={[styles.tableRow, { marginTop: 20 }]} wrap={false}>
                    <Text style={[styles.tableCell, { fontFamily: "Helvetica-Bold", fontSize: 12 }]}>
                      {" "}
                      C E R I T I F I C A T I O N
                    </Text>
                  </View>

                  <View style={[styles.tableRow]}>
                    <View style={[styles.tableCell]}>
                      <Text style={[styles.tableCell, { padding: 60, fontSize: 12, border: "0" }]}>
                        {certificationMessage}
                      </Text>

                      <View style={[styles.signatureBlock, { marginTop: 40 }]}>
                        <Text style={styles.nameLabel}>{accountableOfficer}</Text>
                        <Text>Name and Signature</Text>
                        <Text style={styles.nameLabel}>
                          {"\n"}
                          {dateToday}
                        </Text>
                        <Text>Date</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.AOBlock}>
                  <Text style={[styles.tableCell, { border: "0" }]}>
                    For accountable{"\n"}Officer's Use{"\n\n"} AO 6/15/02
                  </Text>
                </View>
              </>
            )}

            <Footer />
          </Page>
        );
      })}
    </Document>
  );

  return (
    <CustomModal onClose={onClose} className="w-full max-w-6xl">
      <h3 className="text-xl font-semibold mb-4">Cash Receipts Record PDF Preview</h3>

      {/* Display PDF preview */}
      <div className="mb-4" style={{ height: "500px" }}>
        <PDFViewer width="100%" height="100%">
          {pdfDocument}
        </PDFViewer>
      </div>

      <div className="flex justify-end mt-4">
        <CustomButton onClick={handleAddDeposits} variant="yellow">
          Add Deposits
        </CustomButton>
        <CustomButton variant="cancel" onClick={onClose}>
          Close
        </CustomButton>
      </div>
      {showAddDepositsModal && (
        <AddDepositsModal
          onClose={() => setShowAddDepositsModal(false)}
          totalDeposits={totalDeposits}
          collections={deposits}
          onSave={handleOnSave}
          totalAmountCollected={totalAmountCollected}
        />
      )}

      {showAddDepositsModal && (
        <AddDepositsModal
          onClose={() => setShowAddDepositsModal(false)}
          totalDeposits={totalDeposits}
          collections={deposits}
          onSave={handleOnSave}
          totalAmountCollected={totalAmountCollected}
        />
      )}
    </CustomModal>
  );
};
