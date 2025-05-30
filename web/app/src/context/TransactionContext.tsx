import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { decryptData } from "../utils/encryption.js";
import {
  deleteTransaction,
  fetchSessionTransactions,
  fetchSuggestionsByClientName,
  fetchSuggestionsByStudentNumber,
  fetchTransactionById,
  fetchTransactionsByClientName,
  fetchTransactionsByClientOrStudentNumber,
  fetchTransactionsByDateRange,
  updateTransaction,
} from "../services/dexieDB.js";
import { useClientDetails } from "./ClientDetailsContext.tsx";
import { useUser } from "./UserContext.tsx";

// Define the type for the context value
type TransactionContextType = {
  transactions: any[];
  loading: boolean;
  error: string | null;
  getTransactionsByDateRange: (startDate: any, endDate: any, sortBy: string) => Promise<void>;
  getTransactionsToday: () => Promise<void>;
  getTransactionsByStudentNumber: (studentNumber: string) => Promise<any[]>;
  getTransactionsByClientName: (name: string) => Promise<any[]>;
  getSuggestionsbyClientName: (name: string) => Promise<any[]>;
  getSuggestionsbyStudentNumber: (studentNumber: string) => Promise<any[]>;
  getTransactionById: (transactionId: string) => Promise<any>;
  deleteTransactionData: (transactionId: string) => Promise<void>;
  updateTransactionData: (transactionId: string, updatedData: any) => Promise<void>;
  resetTransactions: () => void;
};

// Create the context with a default value of undefined
const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Define the type for the provider's children prop
interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const { getClientDetails } = useClientDetails();
  const { user } = useUser();

  const getTransactionsByDateRange = async (
    startDate: { setHours: (arg0: number, arg1: number, arg2: number, arg3: number) => any },
    endDate: { setHours: (arg0: number, arg1: number, arg2: number, arg3: number) => any },
    sortBy: string
  ) => {
    // console.log("Start date in context:", startDate);
    // console.log("End date in context:", endDate);
    console.log("cashierId in context:", user?.uid);
    const data = await fetchTransactionsByDateRange(
      startDate.setHours(0, 0, 0, 0),
      endDate.setHours(23, 59, 59, 999),
      sortBy,
      user?.uid
    );
    // console.log("Transactions by date range:", data, sortBy);
    setTransactions(data);
  };

  const getTransactionsToday = async () => {
    try {
      const data = await fetchSessionTransactions(
        new Date().setHours(0, 0, 0, 0),
        new Date().setHours(23, 59, 59, 999),
        user?.uid
      );
      console.log("cashierId in context:", user?.uid);
      console.log("Transactions by date range:", data);
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions by date range:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionsByStudentNumber = async (studentNumber: string) => {
    try {
      const data = await fetchTransactionsByClientOrStudentNumber(studentNumber);
      // console.log("Transactions by student number context page:", data);
      return data;
    } catch (error) {
      console.error("Error fetching transactions by student number:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionsByClientName = async (name: string) => {
    try {
      const data = await fetchTransactionsByClientName(name);
      // console.log("Transactions by client name context page:", data);
      return data;
    } catch (error) {
      console.error("Error fetching transactions by client name:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestionsbyClientName = async (name: string) => {
    try {
      const data = await fetchSuggestionsByClientName(name);
      // console.log("Transactions by client name context page:", data);
      return data;
    } catch (error) {
      console.error("Error fetching transactions by client name:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestionsbyStudentNumber = async (studentNumber: string) => {
    try {
      const data = await fetchSuggestionsByStudentNumber(studentNumber);
      console.log("Transactions by student number context page:", data);
      return data;
    } catch (error) {
      console.error("Error fetching transactions by student number:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransactionData = async (transactionId: string) => {
    try {
      await deleteTransaction(transactionId);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionById = async (transactionId: string) => {
    try {
      const data = await fetchTransactionById(transactionId);
      const clientDetails = await getClientDetails(data.clientId);
      const transactionDetails = { ...data, clientDetails };
      // console.log("Transactions by id context page:", transactionDetails);
      return transactionDetails;
    } catch (error) {
      console.error("Error fetching transactions by client name:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionData = async (transactionId: string, updatedData: any) => {
    try {
      await updateTransaction(transactionId, updatedData);
      console.log("Transaction updated successfully");
    } catch (error) {
      console.error("Error updating transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetTransactions = () => {
    setTransactions([]);
  };

  // Provide the transactions data and methods to the children components
  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        getTransactionsByDateRange,
        getTransactionsByStudentNumber,
        getTransactionsByClientName,
        getTransactionsToday,
        getTransactionById,
        getSuggestionsbyClientName,
        getSuggestionsbyStudentNumber,
        deleteTransactionData,
        updateTransactionData,
        resetTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to access the transaction context
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};
