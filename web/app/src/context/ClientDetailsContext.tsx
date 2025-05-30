import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { decryptData } from "../utils/encryption.js";
import { fetchClientDetails } from "../services/dexieDB.js";
import { set } from "date-fns";

// Define the type for the context value
type ClientDetailsContextType = {
  loading: boolean;
  error: string | null;
  getClientDetails: (clientId: string) => Promise<any[]>;
  setClientID: (clientId: string) => void;
  clientId: string;
};

// Create the context with a default value of undefined
const ClientDetailsContext = createContext<ClientDetailsContextType | undefined>(undefined);

// Define the type for the provider's children prop
interface ClientDetailsProviderProps {
  children: ReactNode;
}

export const ClientDetailsProvider: React.FC<ClientDetailsProviderProps> = ({ children }) => {
  //   const [clientDetails, setClientDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string>("");

  const getClientDetails = async (clientId: string) => {
    try {
      const data = await fetchClientDetails(clientId);
      // console.log("Client details in context:", data);
      return data;
    } catch (error) {
      console.error("Error fetching client details:", error);
      setError("Error fetching client details");
    } finally {
      setLoading(false);
    }
  };

  const setClientID = (clientId: string) => {
    setClientId(clientId);
    console.log("Client ID in context:", clientId);
  };

  // Provide the transactions data and methods to the children components
  return (
    <ClientDetailsContext.Provider
      value={{
        loading,
        error,
        //   clientDetails,
        getClientDetails,
        setClientID,
        clientId,
      }}
    >
      {children}
    </ClientDetailsContext.Provider>
  );
};

// Custom hook to access the transaction context
export const useClientDetails = () => {
  const context = useContext(ClientDetailsContext);
  if (!context) {
    throw new Error("useClientDetails must be used within a ClientDetailsProvider");
  }
  return context;
};
