const { encryptData, decryptData } = require("../encryption");

const testData = { id: "123", name: "John Doe", age: 30 };
const encryptedData = encryptData(testData);

console.log("Encrypted Data: ", encryptedData);

const decryptedData = decryptData(encryptedData);

console.log("Decrypted Data: ", decryptedData);
