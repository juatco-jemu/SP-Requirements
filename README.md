# 🎓 UPLB EASYPAY

A full-stack, offline-first **Cashier Information System** designed for the University of the Philippines Los Baños (UPLB) ICS Special Problem (SP) requirement. This project features both a **web-based cashier application** and a **Flutter-based student mobile companion app**, seamlessly integrated using Firebase and local storage solutions.

---

## 📦 Overview

This system modernizes cashier operations by allowing:

- 👨‍💼 Cashiers to process transactions, manage queues, generate reports, and work offline.
- 📱 Students to queue digitally, schedule appointments, and view transaction history from their phones.

---

## 🖥️ Web Cashier App

Built with **React**, **Firebase**, and **Dexie.js**, this app allows cashier personnel to:

- Log in with secure credentials
- Manage queues and appointments in real-time
- Process, encrypt, and store transactions locally and in the cloud
- Generate daily transaction summaries
- Print official receipts with aligned PDF templates
- Work fully offline and sync when online

---

## 📱 Mobile App

Built with **Flutter**, the student app enables:

- Firebase-authenticated login
- Viewing of personal transaction history
- Sending transaction orders to the cashier
- Receiving queue and appointment notifications
- Scheduling cashier appointments

---

## 🎯 Academic Purpose

This project is developed in partial fulfillment of the requirements for the **Special Problem** course under the **Institute of Computer Science, UPLB**. It follows proper software engineering practices including version control, offline-first architecture, security measures, and modular code organization.

---

## ⚙️ Technologies Used

- **React + Vite + Tailwind CSS** (Web)
- **Flutter + Dart** (Mobile)
- **Firebase** (Authentication, Firestore, Cloud Messaging)
- **Dexie.js** (IndexedDB wrapper for offline persistence)
- **reactPDF** (PDF receipt generation)
- **FCM** (For real-time student-cashier sync)

---

## 🛡️ Security Considerations

- All sensitive data is encrypted before upload
- Local-only session transactions are sandboxed per cashier
- Firebase security rules protect per-user data access
- No financial account or payment card info is stored

---


## 👨‍💻 Developed by

**Jemuel Juatco**  
UPLB Institute of Computer Science  
UP 📬 jjuatco@up.edu.ph  
📌 Batch 2019

---

