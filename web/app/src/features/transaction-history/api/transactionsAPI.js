import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../services/firebase.js";
import { encryptData, decryptData } from "../../../utils/encryption.js";

export const getTransactions = async (filter) => {
  try {
    const q = query(collection(db, "transactions"), where(filter.field, "==", filter.value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const decryptedData = decryptData(doc.data().transactionData);
      return { id: doc.id, ...decryptedData };
    });
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

export const addTransaction = async (transaction) => {
  try {
    const encryptedTransaction = {
      ...transaction,
      transactionData: encryptData(transaction.transactionData),
    };

    const docRef = await addDoc(collection(db, "transactions"), encryptedTransaction);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
};
