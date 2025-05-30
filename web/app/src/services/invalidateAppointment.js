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
