import React from "react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "../services/firebase.js";
import { signIn } from "../services/authService.js"; // Your signIn logic

type manualUser = {
  uid: any;
  email: any;
};

type AuthProviderProps = {
  children: ReactNode;
};

type AuthContextType = {
  user: User | manualUser | null;
  userDetails: any;
  loading: boolean;
  manualLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null | manualUser>(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const manualLogin = async (email: string, password: string) => {
    const result = await signIn(email, password);
    console.log("Manual login result:", result);
    setUser(result.user);
    setUserDetails(result.userDetails);
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setUserDetails(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userDetails, loading, manualLogin, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
