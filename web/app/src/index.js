import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { UserProvider } from "./context/UserContext.tsx";
import { TransactionProvider } from "./context/TransactionContext.tsx";
import { ClientDetailsProvider } from "./context/ClientDetailsContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <ClientDetailsProvider>
          <TransactionProvider>
            <App />
          </TransactionProvider>
        </ClientDetailsProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);
