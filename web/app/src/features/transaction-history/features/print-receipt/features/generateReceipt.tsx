import React, { useEffect, useState } from "react";
import { CustomButton } from "../../../../../components/ui/CustomButton.tsx";
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image } from "@react-pdf/renderer";
import templateSrc from "../../../../../assets/template/receipt_template_v2.jpg"; // Ensure this path is correct and the file exists
import { TransactionDetails } from "../../../../../data/models/TransactionModel.tsx";
import { pdfStyles } from "../../components/ui/pdfStyles.tsx";
import { formatMoney } from "../../../../../utils/formatting.tsx";
import { ToWords } from "to-words";
import { useTransactions } from "../../../../../context/TransactionContext.tsx";
import { useUser } from "../../../../../context/UserContext.tsx";
import { CustomModal } from "../../../../../components/CustomModal.tsx";
import { collegeAccountCodes } from "../../../../../data/constants/collegeCodes.ts";
import { EditTransactionModal } from "../../../components/EditTransactionModal.tsx";
import ToggleSwitch from "../../../../../components/ui/ToggleSwitch.tsx";
import { collection } from "firebase/firestore";

type GenerateReceiptFileProps = {
  transaction: TransactionDetails | any;
  onClose: () => void;
};

const leftMargin = 4;
const topMargin = 6;
const rightMargin = 225;

const styles = StyleSheet.create({
  page: { position: "relative", height: "100%" },
  template: {
    width: "100%",
    height: "auto",
    objectFit: "contain", // Ensure image fills the space appropriately
  },
  fundCode: { position: "absolute", top: 92 + topMargin, left: 60 + leftMargin, fontSize: 12 },
  clientName: { position: "absolute", top: 115 + topMargin, left: 60 + leftMargin, fontSize: 12 },
  date: { position: "absolute", top: 115 + topMargin, left: 270 + leftMargin, fontSize: 12 },
  collectionName: { position: "absolute", left: 40 + leftMargin, top: 172 + topMargin },
  accountCode: {
    position: "absolute",
    left: 210 + leftMargin,
    top: 172 + topMargin,
    maxWidth: 100,
  },
  collectionAmount: { position: "absolute", right: rightMargin, top: 172 + topMargin },
  columnStack: { display: "flex", flexDirection: "column" },
  columnStackOverflow: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 100,
  },
  text: { fontSize: 11, paddingBottom: 5 },
  textOverflow: {
    display: "flex",
    flexDirection: "column",
    fontSize: 11,
    paddingBottom: 5,
    maxWidth: 100,
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
  totalAmount: {
    position: "absolute",
    top: 290 + topMargin,
    // left: 287 + leftMargin,
    right: rightMargin,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  totalAmountInWords: {
    position: "absolute",
    top: 315 + topMargin,
    left: 25 + leftMargin,
    fontSize: 12,
    overflow: "hidden",
    width: 350,
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    textIndent: 100,
  },
  collectingOfficer: {
    position: "absolute",
    top: 460 + topMargin,
    left: 252 + leftMargin,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  cash: {
    position: "absolute",
    top: 365 + topMargin,
    left: 136 + leftMargin,
    fontSize: 12,
    width: 8,
    height: 8,
    backgroundColor: "black",
  },
  check: {
    position: "absolute",
    top: 365 + topMargin,
    left: 200 + leftMargin,
    fontSize: 12,
    width: 8,
    height: 8,
    backgroundColor: "black",
  },
  ada: {
    position: "absolute",
    top: 365 + topMargin,
    left: 263 + leftMargin,
    fontSize: 12,
    width: 8,
    height: 8,
    backgroundColor: "black",
  },
  checkBank: {
    position: "absolute",
    top: 404 + topMargin,
    left: 35 + leftMargin,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  checkNumber: {
    position: "absolute",
    top: 404 + topMargin,
    left: 146 + leftMargin,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  checkDate: {
    position: "absolute",
    top: 404 + topMargin,
    left: 280 + leftMargin,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
});

const numberToWords = (num: number) => {
  const toWords = new ToWords({ localeCode: "en-PH" });
  return toWords.convert(num, { currency: true });
};

export const GenerateReceiptFile = ({ transaction, onClose }: GenerateReceiptFileProps) => {
  const { userDisplayName } = useUser();
  const { getTransactionById, loading, error, getTransactionsToday } = useTransactions();
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | any>({
    clientDetails: {},
    collections: [],
    createdAt: "",
  });
  const [showTemplate, setShowTemplate] = useState(true);
  const [showNumWords, setShowNumWords] = useState(true);
  const [showTotalAmount, setShowTotalAmount] = useState(true);
  const [showAccountCode, setShowAccountCode] = useState(true);
  const [showCollectionAmount, setShowCollectionAmount] = useState(true);
  const [showCollectionName, setShowCollectionName] = useState(true);
  const [showFundCode, setShowFundCode] = useState(true);

  const [collectionDeposit, setCollectionDeposit] = useState(
    JSON.parse(sessionStorage.getItem("CRR/RCDCollections")!) || []
  );
  console.log("Collection Deposit", collectionDeposit);

  const toggleTemplateVisibility = () => {
    setShowTemplate(!showTemplate);
  };
  const toggleNumWordsVisibility = () => {
    setShowNumWords(!showNumWords);
  };
  const toggleTotalAmountVisibility = () => {
    setShowTotalAmount(!showTotalAmount);
  };
  const toggleAccountCodeVisibility = () => {
    setShowAccountCode(!showAccountCode);
  };
  const toggleCollectionAmountVisibility = () => {
    setShowCollectionAmount(!showCollectionAmount);
  };
  const toggleCollectionNameVisibility = () => {
    setShowCollectionName(!showCollectionName);
  };
  const toggleFundCodeVisibility = () => {
    setShowFundCode(!showFundCode);
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      const data = await getTransactionById(transaction.id);

      setTransactionDetails(data);
    };
    fetchTransaction();
  }, [transaction, getTransactionById]);

  const [totalAmountCollected, setTotalAmountCollected] = useState(0);
  const [accountCode, setAccountCode] = useState("");
  const [fundCode, setFundCode] = useState("164");
  const [editReceiptModal, setEditReceiptModal] = useState(false);
  const [checkDetails, setCheckDetails] = useState({
    checkNumber: "",
    checkDate: "",
    bankName: "",
  });

  const handleEditReceiptSave = (fundCode: string) => {
    setFundCode(fundCode);

    setEditReceiptModal(false);
  };

  const handleSaveCheckDetails = (checkDetails: any) => {
    setCheckDetails(checkDetails);

    // check if the payment method is check

    // check the collectiondeposit array if it already contains the check details and has the same date
    const checkExists = collectionDeposit.some(
      (item: { depositName: string; date: string }) =>
        item.depositName === "Check" && item.date === checkDetails.checkDate
    );

    // if it exists, add the amount to the existing check details
    if (checkExists) {
      const updatedCollection = collectionDeposit.map((item: { depositName: string; date: any; amount: number }) => {
        if (item.depositName === "Check" && item.date === checkDetails.checkDate) {
          return { ...item, amount: item.amount + totalAmountCollected };
        }
        return item;
      });
      setCollectionDeposit(updatedCollection);
    } else {
      // push the details to the collectionDeposit array
      collectionDeposit.push({ amount: totalAmountCollected, depositName: "Check", date: checkDetails.checkDate });
      // append check details to CRR/RCDCollections session storage
    }
    console.log("Check Details", collectionDeposit);
    sessionStorage.setItem("CRR/RCDCollections", JSON.stringify(collectionDeposit));
  };

  useEffect(() => {
    if (transactionDetails.collections && transactionDetails.collections.length > 0) {
      setTotalAmountCollected(
        transactionDetails.collections.reduce((acc: number, collection: { amount: number }) => {
          // Calculate the total amount from all collections

          return acc + collection.amount;
        }, 0)
      );
    }
    const getCollegeAccountCode = () => {
      return collegeAccountCodes[transactionDetails.clientDetails?.studentInfo?.college];
    };
    setAccountCode(
      transaction.accountCode === "-" || transaction.accountCode === undefined
        ? getCollegeAccountCode()
        : transaction.accountCode
    );
  }, [transactionDetails, transaction]);

  const pdfDocument = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Display the receipt template */}
        <View style={pdfStyles.columnStack}>
          {showTemplate && <Image src={templateSrc} style={styles.template} />}
          <Text style={styles.fundCode}>{showFundCode ? fundCode : ""}</Text>
          <Text style={styles.clientName}>{transactionDetails.clientDetails?.name}</Text>
          <Text style={styles.date}>{new Date(transactionDetails.createdAt).toLocaleDateString()}</Text>
        </View>

        {showCollectionName && (
          <View style={[styles.columnStack, styles.collectionName]}>
            {transactionDetails.collections &&
              transactionDetails.collections.map(
                (
                  collection: {
                    name: string;
                  },
                  index: React.Key | null | undefined
                ) => (
                  <Text key={index} style={styles.text}>
                    {collection.name}
                  </Text>
                )
              )}
          </View>
        )}
        {showAccountCode && (
          <View style={[styles.columnStackOverflow, styles.accountCode]}>
            {transactionDetails.collections?.map((collection: any, index: React.Key | null | undefined) => (
              <Text key={index} style={styles.textOverflow}>
                {collection.accountCode}
              </Text>
            ))}
          </View>
        )}
        {showCollectionAmount && (
          <View style={[styles.columnStack, styles.collectionAmount]}>
            {transactionDetails.collections?.map(
              (collection: { amount: string | number }, index: React.Key | null | undefined) => (
                <Text key={index} style={styles.text}>
                  {formatMoney(collection.amount)}
                </Text>
              )
            )}
          </View>
        )}
        {showTotalAmount && <Text style={styles.totalAmount}>{formatMoney(totalAmountCollected)}</Text>}
        {showNumWords && <Text style={styles.totalAmountInWords}>{numberToWords(totalAmountCollected)}</Text>}
        {transaction.paymentMethod === "CASH" && <Text style={styles.cash}>{""}</Text>}
        {transaction.paymentMethod === "Check" && <Text style={styles.check}>{""}</Text>}
        {transaction.paymentMethod === "ADA/Bank Transfers" && <Text style={styles.ada}>{""}</Text>}
        {transaction.paymentMethod === "Check" && <Text style={styles.checkBank}>{checkDetails.bankName}</Text>}
        {transaction.paymentMethod === "Check" && <Text style={styles.checkNumber}>{checkDetails.checkNumber}</Text>}
        {transaction.paymentMethod === "Check" && <Text style={styles.checkDate}>{checkDetails.checkDate}</Text>}
        <Text style={styles.collectingOfficer}>{userDisplayName}</Text>
      </Page>
    </Document>
  );

  return (
    <CustomModal onClose={onClose} className="w-full max-w-6xl">
      <h3 className="text-xl font-semibold mb-4">Print Receipt Preview</h3>

      {/* Display PDF preview */}
      <div className="mb-4 flex flex-row" style={{ height: "500px" }}>
        <PDFViewer width="80%" height="100%">
          {pdfDocument}
        </PDFViewer>
        <div className="flex flex-col justify-center">
          <label className="text-md font-medium text-gray-700 mb-4 ml-12">Toggle Visibility</label>
          <div className="flex mt-1 mx-4">
            <ToggleSwitch isOn={showTemplate} onToggle={toggleTemplateVisibility} />
            <label className="text-sm font-medium text-gray-700 mb-2 ml-2">Template</label>
          </div>
          <div className="flex mt-4 mx-4">
            <ToggleSwitch isOn={showFundCode} onToggle={toggleFundCodeVisibility} />
            <label className="text-sm font-medium text-gray-700 mb-2 ml-2">Fund Code</label>
          </div>
          <div className="flex mt-4 mx-4">
            <ToggleSwitch isOn={showCollectionName} onToggle={toggleCollectionNameVisibility} />
            <label className="text-sm font-medium text-gray-700 mb-2 ml-2">Nature</label>
          </div>
          <div className="flex mt-4 mx-4">
            <ToggleSwitch isOn={showAccountCode} onToggle={toggleAccountCodeVisibility} />
            <label className="text-sm font-medium text-gray-700 mb-2 ml-2">Account Code</label>
          </div>
          <div className="flex mt-4 mx-4">
            <ToggleSwitch isOn={showCollectionAmount} onToggle={toggleCollectionAmountVisibility} />
            <label className="text-sm font-medium text-gray-700 mb-2 ml-2">Amount</label>
          </div>
          <div className="flex mt-4 mx-4">
            <ToggleSwitch isOn={showTotalAmount} onToggle={toggleTotalAmountVisibility} />
            <label className="text-sm font-medium text-gray-700 mb-2 ml-2">Total</label>
          </div>
          <div className="flex mt-4 mx-4">
            <ToggleSwitch isOn={showNumWords} onToggle={toggleNumWordsVisibility} />
            <label className="text-sm font-medium text-gray-700 mb-2 ml-2">Amount Words</label>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        {/* Edit Receipt */}
        <CustomButton
          onClick={() => {
            setEditReceiptModal(true);
          }}
          variant="yellow"
          className="px-6 mr-2"
        >
          Edit Receipt
        </CustomButton>
        {/* Close button */}
        <CustomButton onClick={onClose} variant="cancel" className="px-6">
          Close
        </CustomButton>
      </div>
      {editReceiptModal && (
        <EditTransactionModal
          transaction={transaction}
          onSave={() => {
            getTransactionsToday();
          }}
          onClose={() => setEditReceiptModal(false)}
          isEditReceipt={true}
          fundCodeSave={handleEditReceiptSave}
          initialFundCode={fundCode}
          saveCheckDetails={handleSaveCheckDetails}
          initialCheckDetails={checkDetails}
        />
      )}
    </CustomModal>
  );
};
