import Dexie from "dexie";
import { dClients, dTransactions } from "../data/dummy/dummyDexieData.js";
import { v4 as uuidv4 } from "uuid";
import { encryptData } from "../utils/encryption.js";
import { generateShortUUID } from "../utils/uidgenerator.js";

const db = new Dexie("EasyPayDB");

db.version(6).stores({
  transactions:
    "id,collections,createdAt,updatedAt,clientId,cashierId,clientRefNumber,refNumber,mfoPap,GLCode,objectCode,history,paymentMethod",
  clients: "id,name,type,studentInfo.studentNumber,studentInfo.college,transactions",
  cashiers: "id,transactions,cashierInfo",
  sessions: "++id, cashierId, loginTime, logoutTime, isActive",
  sessionTransactionHistory: "++id, transactionId, createdAt, cashierId",
});

export async function initializeDatabase() {
  // Sample Data

  try {
    await db.open();
    console.log("Dexie database initialized");
  } catch (error) {
    console.error("Failed to open Dexie database:", error);
  }
}
export async function generateTableData() {
  const clients = dClients;
  const transactions = dTransactions;

  try {
    // Add Clients
    await db.clients.bulkAdd(clients);
    console.log("Clients added successfully.");

    // Add Transactions
    await db.transactions.bulkAdd(transactions);
    console.log("Transactions added successfully.");

    // Update Clients with Transaction IDs
    for (let transaction of transactions) {
      await db.clients
        .where("id")
        .equals(transaction.clientId)
        .modify((client) => {
          client.transactions.push(transaction.id);
        });
    }
    console.log("Clients updated with transaction IDs.");

    // Update Cashiers with Transaction IDs
    for (let transaction of transactions) {
      await db.cashiers
        .where("id")
        .equals(transaction.cashierId)
        .modify((cashier) => {
          cashier.transactions.push(transaction.id);
        });
      console.log("Cashiers updated with transaction IDs.");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

export async function clearDexieDatabase() {
  try {
    await db.cashiers.clear();
    await db.clients.clear();
    await db.transactions.clear();
    console.log("Database cleared successfully.");
  } catch (error) {
    console.error("Error clearing database:", error);
  }
}

export async function addDummyTransaction() {
  try {
    // Generate a unique ID for the transaction
    const transactionId = uuidv4();

    // Transaction data object
    const transactionData = {
      id: transactionId,
      collections: [
        { name: "Tuition Fee", amount: 400 },
        { name: "LOA Fee", amount: 3560.23 },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      clientId: "student001",
      cashierId: "cashier001",
      clientRefNumber: generateShortUUID(),
      refNumber: generateShortUUID(),
      mfoPap: "123",
      GLCode: "456",
      objectCode: "789",
      history: [],
    };

    transactionData.history.push(transactionData);

    // Save transaction to the Dexie database
    await db.transactions.add(transactionData);

    console.log("Transaction saved successfully:", transactionData);
    return transactionData;
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw error;
  }
}

export async function fetchTransactionsByClientOrStudentNumber(identifier) {
  try {
    let transactions;

    // Check if the identifier is a student number
    const studentClient = await db.clients.where("studentInfo.studentNumber").equals(identifier).first();

    if (studentClient) {
      // If a student is found, fetch their transactions by studentNumber
      transactions = await db.transactions.where("clientId").equals(studentClient.id).toArray();
    } else {
      // If no student is found, fetch transactions by clientId
      transactions = await db.transactions.where("clientId").equals(identifier).toArray();
    }

    // Add user details to each transaction
    const transactionsWithDetails = await Promise.all(
      transactions.map(async (transaction) => {
        const user = await db.clients.get(transaction.clientId); // Fetch user details by clientId
        return {
          ...transaction,
          userDetails: user || null, // Include user details or null if not found
        };
      })
    );

    return transactionsWithDetails;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function fetchClientDetails(clientId) {
  try {
    const client = await db.clients.get(clientId);
    return client;
  } catch (error) {
    console.error("Error fetching client details:", error);
    return null;
  }
}

export async function fetchSuggestionsByClientName(name) {
  try {
    const lowerCaseName = name.toLowerCase();
    const clients = await db.clients.filter((client) => client.name.toLowerCase().includes(lowerCaseName)).toArray();
    return clients;
  } catch (error) {
    console.error("Error fetching client suggestions:", error);
    return [];
  }
}

export async function fetchSuggestionsByStudentNumber(studentNo) {
  try {
    console.log("studentNumber", studentNo);
    const clients = await db.clients
      .filter((client) => client.studentInfo?.studentNumber?.includes(studentNo))
      .toArray();
    return clients;
  } catch (error) {
    console.error("Error fetching client suggestions:", error);
    return [];
  }
}

export async function fetchTransactionsByClientName(name) {
  // fetch client by name
  try {
    const lowerCaseName = name.toLowerCase();
    const client = await db.clients.filter((client) => client.name.toLowerCase().includes(lowerCaseName)).first();

    if (client) {
      //get transactions by client id
      const transactions = await db.transactions.where("clientId").equals(client.id).toArray();
      return transactions;
    } else {
      console.log("Client not found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching transactions by client name:", error);
    return [];
  }
}

export async function fetchSessionTransactions(startDate, endDate, cashierId, sortBy = "createdAt") {
  try {
    const session = await db.sessions
      .where("cashierId")
      .equals(cashierId)
      .and((session) => session.isActive === true)
      .first();
    if (session) {
      const sessionTransactions = await fetchTransactionsByDateRange(
        startDate,
        endDate,
        sortBy,
        cashierId,
        "sessionTransactionHistory"
      );
      return sessionTransactions;
    } else {
      console.log("No active session found for cashier:", cashierId);
      return [];
    }
  } catch (error) {
    console.error("Error fetching session transactions:", error);
    return [];
  }
}

export async function fetchTransactionsByDateRange(
  startDate,
  endDate,
  sortBy = "createdAt",
  cashierId,
  database = "transactions",
  sortOrder = "asc"
) {
  try {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);
    // Ensure the sortBy field is valid
    // console.log("startDate", startDate);
    const validSortFields = ["createdAt", "refNumber"];
    if (!validSortFields.includes(sortBy)) {
      throw new Error(`Invalid sort field: ${sortBy}. Valid fields are ${validSortFields.join(", ")}.`);
    }

    // Ensure the sortOrder is valid
    const validSortOrders = ["asc", "desc"];
    if (!validSortOrders.includes(sortOrder)) {
      throw new Error(`Invalid sort order: ${sortOrder}. Use "asc" or "desc".`);
    }
    console.log("databse", database);
    // Fetch transactions within the date range and with the specified cashierId

    let transactions = await db.transactions
      .where("createdAt")
      .between(newStartDate, newEndDate, true, true)
      .filter((transaction) => transaction.cashierId === cashierId)
      .toArray();

    if (database === "sessionTransactionHistory") {
      let transactionSessionIds = await db.sessionTransactionHistory.toArray();
      let transactionSessionIdList = transactionSessionIds.map((session) => session.transactionId);
      console.log("transactionSessionIdList", transactionSessionIdList);
      transactions = transactions.filter((transaction) => transactionSessionIdList.includes(transaction.id));
    }

    let sortedTransactions = transactions.sort((a, b) => {
      const fieldA = a[sortBy];
      const fieldB = b[sortBy];

      if (sortOrder === "asc") {
        return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
      } else {
        return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
      }
    });
    console.log("sortedTransactions", sortedTransactions);

    return sortedTransactions;
  } catch (error) {
    console.error("Error fetching transactions by date range:", error);
    throw error;
  }
}

const checkExistingUser = async (clientId) => {
  if (!clientId) {
    console.error("Invalid client ID:", clientId);
    return false;
  }
  try {
    const user = await db.clients.get(clientId);
    console.log("user", user);
    return user ? true : false;
  } catch (error) {
    console.error("Error checking existing user:", error);
    throw error;
  }
};

const addNewClient = async (clientData) => {
  const newClient = {
    id: clientData.id ? clientData.id : uuidv4(),
    name: clientData.name,
    type: clientData.type,
    studentInfo: clientData.studentInfo,
    transactions: [], // Initialize with the current transaction ID
  };
  try {
    await db.clients.add(newClient);
    console.log("New client added successfully:", newClient);
    return newClient.id;
  } catch (error) {
    console.error("Error adding new client:", error);
    throw error;
  }
};

const updateClientTransactionsList = async (clientId, transactionId) => {
  try {
    await db.clients
      .where("id")
      .equals(clientId)
      .modify((client) => {
        client.transactions.push(transactionId);
      });
  } catch (error) {
    console.error("Error updating client transactions:", error);
    throw error;
  }
};

const updateCashierTransactionsList = async (cashierId, transactionId) => {
  try {
    await db.cashiers

      .where("id")
      .equals(cashierId)
      .modify((cashier) => {
        cashier.transactions.push(transactionId);
      });
  } catch (error) {
    console.error("Error updating cashier transactions:", error);
    throw error;
  }
};

export const startCashierSession = async (cashierId) => {
  try {
    // await initializeDatabase();
    const session = await db.sessions.add({
      cashierId: cashierId,
      sessionTransactionHistory: [],
      loginTime: new Date(),
      logoutTime: null,
      isActive: true,
    });

    console.log("Session started successfully:", session);
    await db.sessionTransactionHistory.clear();
  } catch (error) {
    console.error("Error starting session:", error);
    throw error;
  }
};

export const endCashierSession = async (cashierId) => {
  const session = await db.sessions
    .where("cashierId")
    .equals(cashierId)
    .and((session) => session.isActive === true)
    .first();
  if (session) {
    await db.sessions.update(session.id, { logoutTime: new Date(), isActive: false });
    console.log("Session ended successfully:", session);
    await db.sessionTransactionHistory.clear();
  } else {
    console.log("End session failed. No active session found for cashier:", cashierId);
  }
};

async function checkActiveSession(cashierId) {
  try {
    const session = await db.sessions
      .where("cashierId")
      .equals(cashierId)
      .and((session) => session.isActive === true)
      .first();
    return session;
  } catch (error) {
    console.error("Error fetching active session:", error);
    return null;
  }
}

export async function saveTransaction(transaction, userDetails) {
  let clientId = transaction.clientId || userDetails.id;
  // Check if the client exists
  const clientExists = await checkExistingUser(clientId);
  console.log("clientExists", clientExists);
  if (!clientExists && userDetails) {
    // If the client does not exist, add a new client
    clientId = await addNewClient(userDetails);
  }

  // Add the clientId to the transaction object
  transaction.clientId = clientId;

  //get clientDetails
  let clientDetails = await fetchClientDetails(clientId);

  let transactionWithClientDetails = { ...transaction, clientDetails };

  // add the transaction to transaction history with the client details
  transaction.history.push(transactionWithClientDetails);

  // then save the transaction to the transaction store
  try {
    // Save transaction to the Dexie database
    if (checkActiveSession(transaction.cashierId)) {
      console.log("Active session found for cashier:", transaction.cashierId);
      await db.transactions.add(transaction);
      await db.sessionTransactionHistory.add({
        transactionId: transaction.id,
        createdAt: transaction.createdAt,
        cashierId: transaction.cashierId,
      });
      await updateClientTransactionsList(clientId, transaction.id);
      await updateCashierTransactionsList(transaction.cashierId, transaction.id);
      console.log("Transaction saved successfully:", transaction);
    } else {
      console.log("No active session found for cashier:", transaction.cashierId);
    }
    return transaction;
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw error;
  }
}

const deleteTransactionFromClient = async (clientId, transactionId) => {
  try {
    await db.clients
      .where("id")
      .equals(clientId)
      .modify((client) => {
        client.transactions = client.transactions.filter((txnId) => txnId !== transactionId);
      });
  } catch (error) {
    console.error("Error deleting transaction from client:", error);
    throw error;
  }
};

export async function deleteTransaction(transactionId) {
  try {
    // Fetch the transaction to get the clientId
    const transaction = await db.transactions.get(transactionId);
    if (!transaction) {
      console.log(`Transaction with ID ${transactionId} not found.`);
      return;
    }

    // Delete the transaction from the transactions store
    await db.transactions.delete(transactionId);

    // Delete the transaction from the client's transactions array
    await deleteTransactionFromClient(transaction.clientId, transactionId);

    console.log("Transaction deleted successfully:", transactionId);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
}

export async function fetchTransactionById(transactionId) {
  try {
    const transaction = await db.transactions.get(transactionId);
    return transaction;
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);
    return null;
  }
}

export async function updateTransaction(transactionId, updatedTransaction) {
  try {
    // Fetch the transaction to get the clientId
    const transaction = await db.transactions.get(transactionId);
    if (!transaction) {
      console.log(`Transaction with ID ${transactionId} not found.`);
      return;
    }

    //update client information, if any, using the clientId
    if (updatedTransaction.clientId) {
      const client = await db.clients.get(updatedTransaction.clientId);
      if (client) {
        //update client information
        await db.clients.update(updatedTransaction.clientId, {
          ...client,
          name: updatedTransaction.clientDetails.name,
          type: updatedTransaction.clientDetails.type,
          studentInfo: updatedTransaction.clientDetails.studentInfo,
        });
      }
    }

    // Update the updatedAt field
    updatedTransaction.updatedAt = new Date();

    //get clientDetails
    let clientDetails = await fetchClientDetails(updatedTransaction.clientId);

    let transactionWithClientDetails = { ...updatedTransaction, clientDetails };

    // Create or copy existing history and push the snapshot into it
    const history = transaction.history ? [...transaction.history] : [];
    history.push(transactionWithClientDetails);
    updatedTransaction.history = history;

    // Update the transaction in the transactions store
    await db.transactions.update(transactionId, updatedTransaction);

    console.log("Transaction updated successfully:", updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
}

export async function saveCashier(name, designation, email, password) {
  try {
    // Generate a unique ID for the cashier
    const cashierId = uuidv4();

    // Encrypt the password (simple example, use a stronger encryption in production)
    const encryptedPassword = encryptData(password);

    // Cashier data object
    const cashierData = {
      id: cashierId,
      transactions: [], // Initialize with an empty transactions array
      cashierInfo: {
        name,
        designation,
        email,
        password: encryptedPassword, // Store encrypted password
      },
    };

    // Save cashier to the Dexie database
    await db.cashiers.add(cashierData);

    console.log("Cashier saved successfully:", cashierData);
    return cashierData;
  } catch (error) {
    console.error("Error saving cashier:", error);
    throw error;
  }
}

export async function getCashierInfo(cashierId) {
  try {
    // Retrieve the cashier document from the database
    const cashier = await db.cashiers.get(cashierId);

    if (cashier) {
      // Access the name and designation
      const { name, designation } = cashier.cashierInfo;
      return { name, designation };
    } else {
      console.log(`Cashier with ID ${cashierId} not found.`);
    }
  } catch (error) {
    console.error("Failed to get cashier information:", error);
  }
}

// Example usage
// getCashierInfo('cashier_1670979925370_4321').then(info => {
//   if (info) {
//     console.log(`Cashier Name: ${info.name}`);
//     console.log(`Designation: ${info.designation}`);
//   }
// });

// Initialize the database with data
