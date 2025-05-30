import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { fetchCashierDetails } from "../services/authService";
import { endCashierSession, startCashierSession } from "../services/dexieDB";
// import { signInOffline } from "../services/authService"; // Ensure the correct paths to your authService

interface User {
  uid: string; // Firebase UID if online
  email: string | null;
  userDetails?: { name: string; designation: string };
}

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  userDisplayName: string;
  userDesignation: string;
  setUserName: (name: string) => void;
  userLogout: () => void;
  userLogIn: (user: User) => void;
  getUserDetails: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userDisplayName, setUserName] = useState<string>("");
  const [userDesignation, setUserDesignation] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const getUserDetails = async () => {
    try {
      // Fetch user details from the database
      const user = await fetchCashierDetails();
      if (user) {
        setUser(user);
        setUserName(user.userDetails.name || "Unknown");
        setUserDesignation(user.userDetails.designation || "Unknown");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const userLogIn = (user: User) => {
    setUser(user);
    if (user) {
      setUserName(user.userDetails?.name || "Unknown");
      setUserDesignation(user.userDetails?.designation || "Unknown");
      startCashierSession(user.uid);
    }
  };
  const userLogout = () => {
    setUser(null);
    setUserName("");
    setUserDesignation("");
    endCashierSession(user?.uid);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        userDisplayName,
        userDesignation,
        setUserName,
        userLogout,
        userLogIn,
        getUserDetails,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
