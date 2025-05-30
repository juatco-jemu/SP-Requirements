import React, { useState, useEffect, ReactNode } from "react";
import { PageHeader } from "./PageHeader.tsx";
import { useUser } from "../context/UserContext.tsx";
import { PageFooter } from "./PageFooter.tsx";
import { Outlet } from "react-router-dom";

type LayoutProps = {
  isOnline: boolean;
  children: ReactNode;
};

export const Layout = ({ children, isOnline }: LayoutProps) => {
  const { userDisplayName, userDesignation, userLogout } = useUser();
  const [cashierDetails, setCashierDetails] = useState({
    name: "",
    designation: "",
  });

  useEffect(() => {
    console.log("User Display Name:", userDisplayName);
    console.log("User Designation:", userDesignation);
    setCashierDetails({
      name: userDisplayName,
      designation: userDesignation,
    });
  }, [userDisplayName, userDesignation]);

  // reset state when user logs out
  const handleLogout = () => {
    userLogout();
    setCashierDetails({
      name: "",
      designation: "",
    });
  };

  return (
    <div className="h-screen flex flex-col select-none">
      <PageHeader
        userDisplayName={userDisplayName}
        userDesignation={cashierDetails.designation}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {!isOnline && (
          <div className="flex bg-up_yellow items-center justify-center">
            Offline Mode! You will not be able to receive online payment requests.
          </div>
        )}
        <Outlet />
      </main>
      <PageFooter />
    </div>
  );
};
