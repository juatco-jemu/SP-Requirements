// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvTQlSiZu5RfWBMEsAvzNAzg8yQyL0380",
  authDomain: "uplb-easypay-2024.firebaseapp.com",
  projectId: "uplb-easypay-2024",
  storageBucket: "uplb-easypay-2024.firebasestorage.app",
  messagingSenderId: "247001946565",
  appId: "1:247001946565:web:a8e0a3664c2f86cb4113ac",
  measurementId: "G-2MQWNKLN6M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

async function checkAndDeleteOldQueues() {
  const now = new Date();
  const twoDaysAgo = new Date(now.setDate(now.getDate() - 2)); // 2 days ago

  // Get the current time and check if it's past 2pm
  const currentHour = new Date().getHours();
  if (currentHour < 14) {
    console.log("Not 2pm yet, skipping queue cleanup.");
    return;
  }

  // Query Firestore for queues older than 2 days
  const q = query(
    collection(db, "queues"),
    where("createdAt", "<=", twoDaysAgo) // Check if createdAt is less than 2 days ago
  );

  try {
    const querySnapshot = await getDocs(q);

    // Delete the old queues
    querySnapshot.forEach(async (docSnapshot) => {
      const queueDocRef = doc(db, "queues", docSnapshot.id);
      await deleteDoc(queueDocRef); // Delete the document
      console.log(`Queue with ID ${docSnapshot.id} deleted.`);
    });
  } catch (error) {
    console.error("Error deleting old queues:", error);
  }
}

// Function to check every hour if it's time for the queue cleanup
function startQueueCleanupSchedule() {
  // Run the cleanup immediately when the app starts
  checkAndDeleteOldQueues();

  // Set an interval to check every hour
  setInterval(() => {
    checkAndDeleteOldQueues();
  }, 60 * 60 * 1000); // 60 minutes * 60 seconds * 1000 milliseconds
}

// Run the queue cleanup schedule when the cashier app starts
window.addEventListener("load", startQueueCleanupSchedule);

// Set local persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting local persistence:", error);
});

export const uploadChangesToFirebase = async (offlineChanges) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const userRef = db.collection("users").doc(user.uid); // Adjust the path to your Firestore collection

      // Assume offlineChanges is an array of changes to be merged with the user's existing data
      const batch = db.batch();

      offlineChanges.forEach((change, index) => {
        const docRef = userRef.collection("offlineChanges").doc(`change-${index}`);
        batch.set(docRef, change);
      });

      await batch.commit();
      console.log("Offline changes uploaded to Firebase.");
    } else {
      throw new Error("User not authenticated.");
    }
  } catch (error) {
    console.error("Error uploading changes to Firebase:", error);
    throw new Error("Unable to upload changes to Firebase.");
  }
};

export { db, auth };
