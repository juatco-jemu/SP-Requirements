# 💵 Cashier App

A modern, offline-first cashier management system built for the University of the Philippines Los Banos as a Special Problem requirement. The app allows cashiers to process transactions, manage queues, generate summaries, and sync securely with the cloud using Firebase. With Dexie.js, it ensures seamless offline functionality and advanced local querying.

---

## 📋 Features

- 🔐 Secure multi-cashier login (Firebase Auth + Offline fallback)
- 🧾 Generate official receipts (PDF) with dynamic templates
- 📊 Daily collection summaries
- 🔎 Search by user or transaction with advanced filters
- 📥 Offline-first transaction system using Dexie.js
- 🔔 Queue management system with real-time updates
- 📱 Mobile app integration using Firebase Cloud Messaging (FCM)
- 🧹 Automatic cleanup of expired appointments

---

## 🛠️ Tech Stack

| Layer         | Technology                           |
| ------------- | ------------------------------------ |
| Frontend      | React.js, Tailwind CSS               |
| Backend       | Firebase (Auth, Firestore, FCM)      |
| Local Storage | Dexie.js (IndexedDB)                 |
| Notification  | Firebase Cloud Messaging (FCM)       |
| PDF           | reactPDF                             |

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- Firebase project
- Code editor (VS Code recommended)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/cashier-app.git
   cd cashier-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup Firebase**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a project
   - Enable:
     - Firebase Authentication (Email/Password)
     - Firestore Database
     - Cloud Messaging
   - Get your Firebase config from the project settings

4. **Configure environment variables**

   Create a `.env` file in the root:

   ```env
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Build for production**

   ```bash
   npm run build
   ```

---

## 🧪 Development Notes

- **Dexie.js** is used to store and query transactions locally with IndexedDB, allowing full offline support.
- **Firebase Auth** is used for online login, with hashed fallback credentials for offline login sessions.
- **Queue System** works with Firestore and optionally triggers notifications using FCM.
- **Transaction History** is stored per session locally and uploaded monthly (encrypted) to Firestore.
- **PDF Receipts** follow a pre-designed template that aligns names and collections with underlines for official documentation.

---

## 📂 Folder Structure

```
cashier-app/
├── public/
├── src/
│   ├── auth/             # Authentication logic
│   ├── features/         # Transaction, queue, summary, etc.
│   ├── services/         # Firebase, Dexie, FCM, helpers
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Login, Home, etc.
│   ├── App.tsx
│   └── main.tsx
├── .env
├── index.html
└── package.json
```

---

## 🔐 Security

- Local login credentials are hashed and encrypted.
- Cloud data (transactions) are encrypted before upload.
- No financial account numbers are stored.
- Firestore rules ensure per-cashier access isolation.
- Transactions can only be modified post-login and by the active session.

---

## 🔮 Roadmap

- [ ] Admin dashboard to manage cashiers and appointments
- [ ] End-of-day automated summary email/export

---

## 📧 Contact

Developed by **[Jemuel Juatco]**  
📬 Email: [jemueljuatco29@gmail.com]  


---

## 📄 License

MIT License © [Year] [Your Name]
