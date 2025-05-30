import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Layout } from "./components/Layout.tsx";
import { Home } from "./pages/(logged-in)/Home.tsx";
import { PayorDetailsPages } from "./pages/(logged-in)/PayorDetailsPage.tsx";
import { auth } from "./services/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { SignInPage } from "./pages/authentication/SignIn.tsx";
import { SignUpPage } from "./pages/authentication/SignUp.tsx";

import {
  invalidateExpiredAppointmentsClientSide,
  scheduleDailyTaskAt,
} from "./services/invalidateAppointmentClientSide.js";
import { useNetworkStatus } from "./hooks/NetworkStatus.js";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "./context/AuthContext.tsx";

function App() {
  const { user, loading } = useAuth();
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (!isOnline) {
      toast.error("Internet lost connection, going offline mode!", {
        position: "bottom-left",
        autoClose: 5000,
      });
    } else {
      toast.success("Connection restored. You are back online.", {
        position: "bottom-left",
        autoClose: 3000,
      });
    }
  }, [isOnline]);

  useEffect(() => {
    invalidateExpiredAppointmentsClientSide();
  }, []);

  useEffect(() => {
    scheduleDailyTaskAt(14, 0, invalidateExpiredAppointmentsClientSide);
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />

          <Route element={<Layout isOnline={isOnline} />}>
            <Route path="/home" element={user ? <Home /> : <Navigate to="/sign-in" />} />
            <Route path="/client-details" element={user ? <PayorDetailsPages /> : <Navigate to="/sign-in" />} />
          </Route>
          <Route path="*" element={<Navigate to={user ? "/home" : "/sign-in"} />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
