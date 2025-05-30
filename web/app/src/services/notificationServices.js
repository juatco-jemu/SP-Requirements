import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import express, { json } from "express";
import cors from "cors";
import serviceAccount from "./ignore/serviceAccountKey.json" assert { type: "json" };

process.env.GOOGLE_APPLICATION_CREDENTIALS;

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true, // optional, needed if you're using cookies/auth headers
  })
);

initializeApp({
  credential: cert(serviceAccount),
});

app.get("/", (req, res) => {
  res.send("Welcome to the Firebase Notification Server");
});

app.post("/sendNotification", async (req, res) => {
  var { fcmTokens, title, body } = req.body;
  title = title || "Default Title";
  body = body || "Default Body";
  fcmTokens = fcmTokens || [];

  if (!fcmTokens || !Array.isArray(fcmTokens) || fcmTokens.length === 0) {
    return res.status(400).json({ error: "Invalid FCM tokens" });
  }

  const message = {
    tokens: fcmTokens,
    notification: {
      title: title,
      body: body,
    },
  };

  try {
    const response = await getMessaging().sendEachForMulticast(message);
    console.log("Notification sent:", response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
