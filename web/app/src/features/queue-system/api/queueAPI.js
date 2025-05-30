import {
  collection,
  addDoc,
  getDoc,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
  query,
  deleteDoc,
  serverTimestamp,
  setDoc,
  writeBatch,
  where,
  collectionGroup,
  documentId,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../../services/firebase.js";
import { formatTimeStampToQueueDateFormat } from "../../../utils/formatting.tsx";

//listen for real-time updates
export const listenToQueue = (yearMonthDate, callback) => {
  const q = query(collection(db, `queues/${yearMonthDate}/queue`), orderBy("createdAt"));
  return onSnapshot(q, async (snapshot) => {
    const queue = await Promise.all(
      snapshot.docs.map(async (snapDoc, index) => {
        const data = snapDoc.data();
        const userDocRef = doc(db, "users", data.userId);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : {};
        const userTokenRef = collection(userDocRef, "fcmTokens");
        const userTokenSnap = await getDocs(userTokenRef);

        const fcmTokens = userTokenSnap.docs.map((doc) => doc.data().token); // Adjust field name as needed
        return {
          id: snapDoc.id,
          queueIndex: index + 1,
          ...data,
          uid: data.userId,
          email: userData.email || "Unknown",
          userName: userData.displayName || "Unknown",
          college: userData.college || "Unknown",
          studentNumber: userData.studentNo || "Unknown",
          tokens: fcmTokens,
        };
      })
    );
    callback(queue);
  });
};

export const listenToPastQueue = (callback) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set time to midnight
  const midnightTimestamp = Timestamp.fromDate(now);
  const q = query(collectionGroup(db, "queue"), where("createdAt", "<", midnightTimestamp));
  return onSnapshot(q, async (snapshot) => {
    const queue = await Promise.all(
      snapshot.docs.map(async (subDoc, index) => {
        const data = subDoc.data();
        const userDoc = await getDoc(doc(db, "users", data.userId));
        const userData = userDoc.exists() ? userDoc.data() : {};
        return {
          id: subDoc.id,
          queueIndex: index + 1,
          ...data,
          uid: data.userId,
          email: userData.email || "Unknown",
          userName: userData.displayName || "Unknown",
          college: userData.college || "Unknown",
          studentNumber: userData.studentNo || "Unknown",
        };
      })
    );
    callback(queue);
  });
};

export const confirmTransaction = async (queue, transactionId, newCollections) => {
  try {
    console.log("transaction Id: ", transactionId);
    const yearMonthDate = formatTimeStampToQueueDateFormat(queue.createdAt);
    console.log("yearMonthDate: ", yearMonthDate);
    // update transaction status to Completed in the transaction collection

    const batch = writeBatch(db);
    // Update transaction status to Completed in the transaction collection
    const transactionDocRef = doc(db, "transactions", transactionId);
    batch.update(transactionDocRef, { status: "Completed", collections: newCollections });

    // Delete the queue document
    const queueDocRef = doc(db, `queues/${yearMonthDate}/queue`, queue.id);
    batch.delete(queueDocRef);

    // Commit the batch
    await batch.commit();

    console.log("Transaction confirmed successfully!");
  } catch (e) {
    console.error("Error confirming transaction: ", e);
  }
};

export const cancelTransaction = async (queue, transactionId) => {
  try {
    console.log("transaction Id: ", transactionId);
    const yearMonthDate = formatTimeStampToQueueDateFormat(queue.createdAt);
    console.log("yearMonthDate: ", yearMonthDate);
    // update transaction status to Completed in the transaction collection

    const batch = writeBatch(db);
    // Update transaction status to Completed in the transaction collection
    const transactionDocRef = doc(db, "transactions", transactionId);
    batch.update(transactionDocRef, { status: "Cancelled" });

    // Delete the queue document
    const queueDocRef = doc(db, `queues/${yearMonthDate}/queue`, queue.id);
    batch.delete(queueDocRef);

    // Commit the batch
    await batch.commit();

    console.log("Transaction confirmed successfully!");
  } catch (e) {
    console.error("Error confirming transaction: ", e);
  }
};

export const getDefaultQueueExpirationDuration = async () => {
  try {
    const docRef = doc(db, "settings", "DefaultQueueDuration");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().duration;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
};

export const updateQueueExpirationDuration = async (newDuration) => {
  try {
    const docRef = doc(db, "settings", "DefaultQueueDuration");
    await updateDoc(docRef, {
      duration: newDuration,
    });
    console.log("Document successfully updated!");
  } catch (error) {
    console.error("Error updating document:", error);
  }
};
