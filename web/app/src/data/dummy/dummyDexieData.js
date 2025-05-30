import { natureOfCollectionValues } from "../constants/natureOfCollection";

const dClients = [
  {
    id: "student1001",
    name: "Jemuel Juatco",
    type: "student",
    studentInfo: {
      studentNumber: "201905804",
      college: "CAS",
    },
    transactions: [],
  },
  {
    id: "client1001",
    name: "John Doe",
    type: "non-student",
    studentInfo: null,
    transactions: [],
  },
];

const dTransactions = [];

const createStudentClients = (numClients) => {
  for (let i = 1; i <= numClients; i++) {
    const client = {
      id: `student${String(i).padStart(3, "0")}`,
      name: `Student ${String(i).padStart(3, "0")}`,
      type: "student",
      studentInfo: {
        studentNumber: `2019${String(i).padStart(5, "0")}`,
        college: "CAS",
      },
      transactions: [],
    };
    dClients.push(client);
  }
};

const cashierIds = [
  "BgCN99RzWFbhLdnXxi4Jd58uKQ62",
  "aAVctrbvbEPXlRrOCgBBjTl0xLh2",
  "f6btEkSr71VdDMrpyUsOhLevcaf1",
  "rJZG7GCHU2SFkwbSG5V4Y4LwVdv1",
  "tgqBOVGMNCd8GbKXb4oAxNirkJm2",
];

const createTransactions = (numTransactions) => {
  const getRandomDate = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    return new Date(randomTime);
  };

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Usage example

  // Usage example
  const randomDate = getRandomDate("2024-11-01", new Date()); // Define the date as November 29, 2023

  for (let i = 1; i <= numTransactions; i++) {
    const transaction = {
      id: `txn${String(i).padStart(3, "0")}`,
      collections: [
        { name: natureOfCollectionValues[getRandomInt(0, 16)], amount: getRandomInt(1, 16000) + i },
        { name: natureOfCollectionValues[getRandomInt(0, 16)], amount: getRandomInt(1, 600) + i * 4 },
      ],
      createdAt: randomDate,
      updatedAt: new Date(),
      clientId: `student${String(i).padStart(3, "0")}`,
      cashierId: cashierIds[getRandomInt(0, 4)],
      clientRefNumber: `STU2024${String(i).padStart(3, "0")}`,
      refNumber: `REFNUM${String(i).padStart(3, "0")}Q`,
      mfoPap: "123",
      GLCode: "456",
      objectCode: "789",
      history: [],
    };
    transaction.history.push(transaction);
    dTransactions.push(transaction);
  }
};

createStudentClients(25);
createTransactions(25);

export { dClients, dTransactions };
