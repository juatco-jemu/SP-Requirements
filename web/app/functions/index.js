// /**
//  * Import function triggers from their respective submodules:
//  *
//  * const {onCall} = require("firebase-functions/v2/https");
//  * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
//  *
//  * See a full list of supported triggers at https://firebase.google.com/docs/functions
//  */

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started

// // exports.helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });
// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// admin.initializeApp();
// const db = admin.firestore();

// // Cloud Function to remove queues after 2 PM, two days later
// export const removeExpiredQueues = functions.pubsub.schedule("every 24 hours").onRun(async () => {
//   const now = admin.firestore.Timestamp.now();
//   const twoDaysAgo = new Date(now.toDate());
//   twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); // Subtract 2 days

//   const cutoffTime = new Date(twoDaysAgo);
//   cutoffTime.setHours(14, 0, 0, 0); // Set time to 2:00 PM

//   const cutoffTimestamp = admin.firestore.Timestamp.fromDate(cutoffTime);

//   try {
//     const snapshot = await db.collectionGroup("queue").where("createdAt", "<=", cutoffTimestamp).get();

//     const batch = db.batch();

//     snapshot.forEach((doc) => {
//       batch.delete(doc.ref); // Schedule deletion
//     });

//     await batch.commit();

//     console.log(`Deleted ${snapshot.size} expired queues.`);
//   } catch (error) {
//     console.error("Error removing expired queues:", error);
//   }
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.invalidateExpiredAppointments = functions.https.onRequest(async (req, res) => {
  const apiKey = req.get("x-api-key");
  const expectedApiKey = functions.config().myconfig.apikey;

  if (apiKey !== expectedApiKey) {
    return res.status(401).send("Unauthorized");
  }

  const now = admin.firestore.Timestamp.now();

  try {
    const snapshot = await db
      .collectionGroup("queue")
      .where("status", "==", "Pending")
      .where("expiresAt", "<=", now)
      .get();

    if (snapshot.empty) {
      return res.send("No expired appointments found.");
    }

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.update(doc.ref, { status: "Appointment Expired" });
    });

    await batch.commit();
    res.send(`Expired ${snapshot.size} appointments.`);
  } catch (error) {
    console.error("Error invalidating appointments:", error);
    res.status(500).send("Internal Server Error");
  }
});
