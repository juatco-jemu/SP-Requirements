# 📱 EASYPAY Mobile App (Flutter)

A mobile application built with Flutter that allows students to manage their cashier-related activities, including sending transaction orders (appointment making), viewing history, and checking their queue status — all connected in real-time to the cashier's system via Firebase.

---

## 📋 Features

- 🔐 Firebase Authentication (Email & Password)
- 🧾 View personal transaction history
- 🧑‍🎓 Student-based user collections
- 📨 Send transaction orders to the cashier
- 🔔 Receive real-time queue notifications via FCM
- 🗓️ Schedule appointments with the cashier
- ☁️ Cloud-based data storage with Firestore
- 🔒 Encrypted data transmission and access control

---

## 🛠️ Tech Stack

| Component     | Technology                     |
| ------------- | ------------------------------ |
| UI            | Flutter, Dart                  |
| Backend       | Firebase (Auth, Firestore)     |
| Notifications | Firebase Cloud Messaging (FCM) |
| State Mgmt    | Provider / Riverpod / Bloc     |
| Storage       | Firestore (per-user docs)      |

---

## ⚙️ Installation & Setup

### Prerequisites

- Flutter SDK
- Firebase Project (with Auth, Firestore, FCM enabled)
- Android Studio / Xcode / VS Code

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/cashier-flutter-app.git
   cd cashier-flutter-app
   ```

2. **Install dependencies**

   ```bash
   flutter pub get
   ```

3. **Set up Firebase**

   - Create a Firebase project.
   - Enable:
     - Firebase Authentication (Email/Password)
     - Firestore Database
     - Firebase Cloud Messaging
   - Download `google-services.json` (for Android) and `GoogleService-Info.plist` (for iOS).
   - Place them in:
     - `android/app/google-services.json`
     - `ios/Runner/GoogleService-Info.plist`

4. **Run the app**

   ```bash
   flutter run
   ```

---

## 🔐 Security

- Only authenticated users can send and view transaction data.
- All transaction history is scoped per student account.
- Sensitive data is encrypted before transmission and stored securely in Firestore.
- Firestore rules enforce access control.

---

## 📂 Folder Structure

```
lib/
├── models/             # Data models (User, Transaction, etc.)
├── services/           # Firebase, API, Notification services
├── views/              # Screens (Home, Login, History, etc.)
├── widgets/            # Reusable UI components
├── main.dart           # App entry point
```

---

## 🚀 Build & Release

To build the app for production:

```bash
flutter build apk   # Android

```

For Firebase Messaging on iOS, ensure you’ve configured APNs in Firebase Console.

---

## 🔮 Roadmap

- [ ] Support for iOS devices
- [ ] Add local caching of transaction history
- [ ] Offline appointment scheduling
- [ ] Dark mode support
- [ ] QR-based appointment check-in

---

## 📧 Contact

Developed by **[Jemuel Juatco]**  
📬 Email: [jemueljuatco29@gmail.com]

---

## 📄 License

MIT License © [Year] [Your Name]
