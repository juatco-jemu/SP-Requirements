import {
  getFirestore,
  getDoc,
  collectionGroup,
  query,
  where,
  getDocs,
  deleteDoc,
  writeBatch,
  Timestamp,
  doc,
  collection,
} from "firebase/firestore";
import { toast } from "react-toastify";

const db = getFirestore();

async function deleteQueuesWithoutSubcollections() {
  const queuesSnapshot = await getDocs(collection(db, "queues"));
  if (queuesSnapshot.empty) {
    console.log("No queues found.");
    return;
  }
  console.log(`Found ${queuesSnapshot.size} queues.`);

  const batch = writeBatch(db);
  let count = 0;
  for (const queueDoc of queuesSnapshot.docs) {
    const queueRef = collection(db, "queues", queueDoc.id, "queue");
    const subcollections = await getDocs(queueRef);

    if (subcollections.empty) {
      console.log(`Deleting queue without subcollections: ${queueRef.path}`);
      batch.delete(doc(db, "queues", queueDoc.id));
      count++;
    } else {
      console.log(`Queue has subcollections: ${queueRef.path}`);
    }
  }

  await batch.commit();
  console.log(`Deleted ${count} queues without subcollections.`);
  return count;
}

export async function invalidateExpiredAppointmentsClientSide() {
  const now = Timestamp.now();

  try {
    deleteQueuesWithoutSubcollections()
      .then(() => console.log("Cleanup complete."))
      .catch((error) => console.error("Error during cleanup:", error));

    // Query all 'queue' subcollections for pending appointments that have expired
    const q = query(collectionGroup(db, "queue"), where("status", "==", "Pending"), where("expiresAt", "<=", now));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No expired appointments found.");
      toast.info(`No Expired Appointments found!`, {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }

    let batch = writeBatch(db);
    let count = 0;

    for (const docSnap of snapshot.docs) {
      const queueRef = docSnap.ref;
      const data = docSnap.data();
      const transactionId = data.transactionId;

      if (!transactionId) {
        console.warn(`Missing transactionId in queue document: ${queueRef.path}`);
        continue;
      }

      const transactionRef = doc(db, "transactions", transactionId);

      // Update the status in the parent 'transactions' document
      batch.update(transactionRef, { status: "Appointment Expired" });

      // Update the status in the 'queue' document
      batch.update(queueRef, { status: "Appointment Expired" });

      // Delete the 'queue' document
      batch.delete(queueRef);

      toast.info(`It's 2PM! Expired Appointments successfully removed: ${data.ticketNumber}`, {
        position: "bottom-right",
        autoClose: 5000,
      });

      const userDocRef = doc(db, "users", data.userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userTokenRef = collection(userDocRef, "fcmTokens");
        const userTokenSnap = await getDocs(userTokenRef);

        const fcmTokens = userTokenSnap.docs.map((doc) => doc.data().token); // Adjust field name as needed
        console.log("User FCM tokens:", fcmTokens);

        if (fcmTokens.length > 0) {
          const message = {
            fcmTokens: fcmTokens,

            title: "Appointment Expired",
            body: "Your appointment has expired. Please reschedule.",
          };

          fetch("http://localhost:4000/sendNotification", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
        } else {
          console.warn(`No FCM tokens found for user: ${data.userId}`);
        }
      } else {
        console.warn(`User document not found: ${data.userId}`);
      }

      count++;

      // Commit the batch every 450 operations to stay within Firestore limits
      if (count % 450 === 0) {
        await batch.commit();
        batch = writeBatch(db);
      }
    }

    // Commit any remaining operations
    if (count % 450 !== 0) {
      await batch.commit();
    }

    console.log(`Expired and removed ${count} appointments.`);
  } catch (error) {
    console.error("Error invalidating appointments:", error);
  }
}

export function scheduleDailyTaskAt(hour, minute, task) {
  const now = new Date();
  const nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

  if (now > nextRun) {
    nextRun.setDate(nextRun.getDate() + 1);
    toast.info(`Task scheduled for ${nextRun.getDate() + 1} at ${hour}:${minute}`, {
      position: "bottom-right",
      autoClose: 5000,
    });
  }

  const delay = nextRun - now;

  setTimeout(() => {
    task();
    setInterval(task, 24 * 60 * 60 * 1000);
  }, delay);
}
