import React, { useEffect, useState } from "react";
import { CustomButton } from "../../../components/ui/CustomButton.tsx";
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from "@react-pdf/renderer";
import { useTransactions } from "../../../context/TransactionContext.tsx";
import { pdfStyles as styles } from "./components/ui/pdfStyles.tsx";
import { formatMoney, formattedDateTodayStringLong } from "../../../utils/formatting.tsx";
import { UPLBHeader } from "./components/UPLBReportHeader.tsx";
import { AddDepositsModal } from "../components/AddDepositsModal.tsx";
import { CustomModal } from "../../../components/CustomModal.tsx";
import { useUser } from "../../../context/UserContext.tsx";
import { TextInput } from "../../../components/ui/TextInput.tsx";
import { EditReportModal } from "./components/EditReportModal.tsx";
import { set } from "rsuite/esm/internals/utils/date/index";

type GenerateRCDFileProps = {
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

const rcdHeaderTitle = "REPORT OF COLLECTIONS AND DEPOSITS";

const dateToday = formattedDateTodayStringLong();

const rowsPerPage = 14;

export const GenerateRCDFile = ({ columns, data, onClose, excludedColumns = [] }: GenerateRCDFileProps) => {
  const { transactions } = useTransactions(); // Use the context to get the transactions data
  const { userDisplayName, userDesignation } = useUser();
  const [showAddDepositsModal, setShowAddDepositsModal] = useState(false);
  const [totalAmountCollected, setTotalAmountCollected] = useState(0);
  const [deposits, setDeposits] = useState<{ amount: number; depositName: string; date: string }[]>([]);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [bankName, setBankName] = useState("Land Bank of the Philippines");
  const [accountNumber, setAccountNumber] = useState("UPLB LBP RF 1892-1004-93");
  const [bankFund, setBankFund] = useState("164");
  const [reportNumber, setReportNumber] = useState("");
  const [undepositedCollectionPerLastReport, setUndepositedCollectionPerLastReport] = useState(0);
  const [editReportModal, setEditReportModal] = useState(false);

  let firstOR = "-";
  let lastOR = "-";
  let date1 = "-";
  let date2 = "-";

  if (data.length > 0) {
    firstOR = data[0].refNumber;
    lastOR = data[data.length - 1].refNumber;
    date1 = data[0].localeDateShort;
    date2 = data[data.length - 1].localeDateShort;
  }

  const accountableOfficer = userDisplayName;
  const officialDesignation = userDesignation;

  const totalPages = Math.floor(data.length / rowsPerPage) + 1;

  const certificationMessage = (
    <Text>
      {" \t "}I hereby certify on my official oath that the above is a true statement of all collections and deposits
      had by me during the period stated above for which Official Receipt Nos.{" "}
      <Text style={styles.boldText}>{firstOR}</Text> to <Text style={styles.boldText}>{lastOR}</Text> inclusive, were
      actually issued by me in the amounts shown thereon. I also certify that I have not received money from whatever
      source without having issued the necessary Official Receipt in acknowledgement thereof. Collections received by
      sub-collectors are recorded above in lump-sum opposite their respective collection report numbers. I certify
      further that the balance shown above agrees with the balance appearing in my Cash Receipts Record.
    </Text>
  );
  useEffect(() => {
    if (transactions.length > 0) {
      setTotalAmountCollected(
        transactions.reduce((acc, transaction) => {
          // Calculate the total amount from all collections
          return acc + transaction.collections.reduce((sum: number, c: { amount: string }) => sum + c.amount, 0);
        }, 0)
      );
    }
  }, [transactions]);

  // Function to generate the table header, excluding specific columns
  const generateTableHeader = () => {
    return columns
      .filter((col) => !excludedColumns.includes(col.accessor) && col.accessor !== "GLCodeDescription") // Exclude columns based on accessor
      .map((col, index) => {
        let headerName = col.header;

        if (col.accessor === "userName") {
          headerName = "Payor";
        }
        if (col.accessor === "amountDisplay") {
          headerName = "Total per OR";
        }
        if (col.accessor === "natureOfCollection") {
          headerName = "Particulars";
        }
        if (col.accessor === "GLCode") {
          headerName = "GL Code\n Description";
        }
        return (
          <Text style={styles.boldTableCell} key={index}>
            {headerName}
          </Text>
        );
      });
  };

  const renderAdditionalDeposits = (collections: any[]) => {
    return (
      <View style={{ paddingTop: 5 }}>
        {collections.map((collection, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              { border: "0", paddingLeft: 30, paddingBottom: 5, justifyContent: "space-between", width: "60%" },
            ]}
          >
            <Text style={styles.subText}>
              Date: <Text>{collection.date}</Text>
            </Text>
            <Text style={styles.subText}>{collection.depositName}</Text>

            <Text style={styles.subText}>PHP {formatMoney(collection.amount)}</Text>
          </View>
        ))}
      </View>
    );
  };

  const Header = ({ pageIndex, totalPages }: { pageIndex: number; totalPages: number }) => {
    return (
      <>
        <UPLBHeader />

        <View style={styles.columnStack}>
          <Text style={[styles.header, { fontSize: 13 }]}>{rcdHeaderTitle}</Text>
          <Text style={styles.subText}>
            Period Coverage:{" "}
            <Text style={[styles.subText, { fontFamily: "Helvetica-Bold" }]}>
              {date1} to {date2}
            </Text>
          </Text>
        </View>

        <View style={[styles.tableRow, { justifyContent: "space-between", marginRight: 20 }]}>
          <Text>
            <Text style={styles.subText}> Bank Name / Account Number: </Text>
            <Text style={[styles.subText, { fontFamily: "Helvetica-Bold" }]}>{bankName} / </Text>
            <Text style={[styles.subText, { fontFamily: "Helvetica-Bold" }]}>{accountNumber} </Text>
          </Text>
          <Text>
            <Text style={styles.subText}> Report Number: </Text>
            <Text style={[styles.subText, { fontFamily: "Helvetica-Bold" }]}>{reportNumber} </Text>
          </Text>
        </View>
        <View style={[styles.tableRow, { marginVertical: 10, justifyContent: "space-between", marginRight: 20 }]}>
          <Text>
            <Text style={styles.subText}> Bank Fund: </Text>
            <Text style={[styles.subText, { fontFamily: "Helvetica-Bold" }]}>{bankFund} </Text>
          </Text>
          <Text>
            <Text style={styles.subText}>
              {" "}
              Sheet {pageIndex} of {totalPages + 1}{" "}
            </Text>
          </Text>
        </View>
      </>
    );
  };

  const handleOnSave = (newCollections: CollectionDeposit[], newTotalDeposits: number) => {
    setDeposits(newCollections);
    setTotalDeposits(newTotalDeposits);
    setShowAddDepositsModal(false);
  };

  const handleAddDeposits = () => {
    setShowAddDepositsModal(true);
  };

  const handleEditReportSave = (
    updatedBankName: string,
    updatedAccountNumber: string,
    updatedBankFund: string,
    updatedReportNumber: string,
    updatedUndepositedCollectionPerLastReport: number
  ) => {
    setBankName(updatedBankName);
    setAccountNumber(updatedAccountNumber);
    setBankFund(updatedBankFund);
    setReportNumber(updatedReportNumber);
    setEditReportModal(false);
    setUndepositedCollectionPerLastReport(updatedUndepositedCollectionPerLastReport);
  };

  const pdfDocument = (
    <Document>
      {/* Set the page size to A4 landscape */}
      {Array.from({ length: totalPages }, (_, pageIndex) => {
        const startRow = pageIndex * rowsPerPage;
        const endRow = startRow + rowsPerPage;
        const pageData = data.slice(startRow, endRow);
        // console.log("Page Data:", startRow, endRow, pageData);
        return (
          <Page key={pageIndex} size="A4" orientation="landscape" style={styles.page}>
            {/* Add Header */}
            <View style={styles.container}>
              <View style={styles.content}>
                <Header pageIndex={pageIndex + 1} totalPages={totalPages} />

                {/* Add Subheader */}

                {/* Table with Data */}
                <View style={styles.table}>
                  <View style={styles.tableRow}>{generateTableHeader()}</View>
                  {/* {generateTableBody()} */}

                  {pageData.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.tableRow}>
                      {columns.map(
                        (column, colIndex) =>
                          !excludedColumns.includes(column.accessor) &&
                          column.accessor !== "GLCodeDescription" && (
                            <Text key={colIndex} style={styles.tableCell}>
                              {
                                <Text style={[styles.textOverflow, styles.columnStackOverflow]}>
                                  {row[column.accessor]}
                                </Text>
                              }
                              {"\n"}
                              {column.accessor === "GLCode" && (
                                <Text style={styles.subText}>{row.GLCodeDescription}</Text>
                              )}
                            </Text>
                          )
                      )}
                    </View>
                  ))}

                  {pageIndex === totalPages - 1 && (
                    <View style={styles.tableRow}>
                      {columns
                        .filter(
                          (col, index) =>
                            index !== 3 &&
                            index !== 4 &&
                            index !== 2 &&
                            !excludedColumns.includes(col.accessor) &&
                            col.accessor !== "GLCodeDescription"
                        ) // Exclude the 6th column
                        .map((col, index) => (
                          <Text style={styles.tableCell} key={index}></Text>
                        ))}
                      <Text style={[styles.boldTableCell]}>{formatMoney(totalAmountCollected)}</Text>
                      <Text style={styles.boldTableCell}></Text>
                    </View>
                  )}
                </View>
                {/* <View style={{ flexGrow: 1 }} /> */}
                {pageIndex === totalPages - 1 && (
                  <Text style={[styles.footer, { flex: 1 }]}>Automatically generated report</Text>
                )}
                {pageIndex === totalPages - 1 && (
                  <View break>
                    <Header pageIndex={pageIndex + 2} totalPages={totalPages} />
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, { border: "2px solid black", padding: 2 }]}></Text>
                    </View>

                    {/*=========================================== Summary ===========================================*/}
                    <View style={[{ paddingHorizontal: 50, paddingVertical: 10, border: "0" }]}>
                      <Text style={[styles.subText, { paddingHorizontal: 4, textAlign: "left" }]}>Summary: </Text>
                      <View style={[styles.tableRow, { justifyContent: "space-between" }]}>
                        <Text style={styles.subText}> Undeposited Collection per last Report: </Text>

                        <Text style={styles.subText}> PHP {formatMoney(undepositedCollectionPerLastReport)} </Text>
                      </View>
                      <View style={[styles.tableRow, { justifyContent: "space-between" }]}>
                        <Text style={styles.subText}>
                          {" "}
                          Collections per OR Nos. <Text style={styles.boldText}>{firstOR}</Text> to{" "}
                          <Text style={styles.boldText}>{lastOR}</Text>{" "}
                        </Text>

                        <Text style={styles.subText}> PHP {formatMoney(totalAmountCollected)} </Text>
                      </View>
                      <Text style={[styles.subText, { paddingHorizontal: 4, textAlign: "left" }]}>Deposits: </Text>
                      {renderAdditionalDeposits(deposits)}
                      <View style={[styles.tableRow, { justifyContent: "space-between" }]}>
                        <Text style={styles.subText}> Undeposited Collection, this Report: </Text>

                        <Text style={styles.subText}> PHP {formatMoney(totalAmountCollected - totalDeposits)} </Text>
                      </View>
                    </View>

                    {/*==================================== Certification Message ====================================*/}
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableCell, { fontFamily: "Helvetica-Bold", border: "2px solid black" }]}>
                        {" "}
                        C E R I T I F I C A T I O N
                      </Text>
                    </View>
                    <View style={[styles.tableRow]}>
                      <View style={[styles.tableCell, { paddingTop: 10, border: "0" }]}>
                        <Text
                          style={[
                            styles.tableCell,
                            styles.subText,
                            {
                              marginBottom: 10,
                              paddingHorizontal: 50,
                              border: "0",
                              textAlign: "justify",
                            },
                          ]}
                        >
                          {certificationMessage}
                        </Text>

                        <View style={[styles.signatureBlock, { marginTop: 50, marginRight: 80 }]}>
                          <Text style={styles.nameLabel}>{accountableOfficer}</Text>
                          <Text>Name and Signature of Collecting officer</Text>
                          <View style={styles.tableRow}>
                            <View style={styles.columnStack}>
                              <Text style={styles.nameLabel}>
                                {"\n"}
                                {officialDesignation}
                              </Text>
                              <Text>Position</Text>
                            </View>
                            <View style={styles.columnStack}>
                              <Text style={styles.nameLabel}>
                                {"\n"}
                                {dateToday}
                              </Text>
                              <Text>Date</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
              {/* Footer */}
              <View style={styles.footer}>
                <Text>Automatically generated report</Text>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );

  return (
    <CustomModal onClose={onClose} className="w-full max-w-6xl">
      <h3 className="text-xl font-semibold mb-4">Report of Collections and Deposits PDF Preview</h3>

      {/* Display PDF preview */}
      <div className="mb-4" style={{ height: "500px" }}>
        <PDFViewer width="100%" height="100%">
          {pdfDocument}
        </PDFViewer>
      </div>

      <div className="flex justify-end mt-4">
        <CustomButton onClick={() => setEditReportModal(true)} variant="yellow" className="mr-3">
          Edit Report
        </CustomButton>
        <CustomButton onClick={handleAddDeposits} variant="yellow">
          Add Deposits
        </CustomButton>
        <CustomButton className="ml-3 bg-up_maroon text-white hover:bg-up_maroon-hover" onClick={onClose}>
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
      {editReportModal && (
        <EditReportModal
          initialValues={{ bankName, accountNumber, bankFund, reportNumber, undepositedCollectionPerLastReport }}
          onSave={handleEditReportSave}
          onClose={() => setEditReportModal(false)}
        />
      )}
    </CustomModal>
  );
};
