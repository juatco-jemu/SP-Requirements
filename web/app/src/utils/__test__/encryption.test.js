import { encryptData, decryptData } from "../encryption.js";

describe("Encryption and Decryption", () => {
  it("should encrypt and decrypt data correctly", () => {
    const testData = { id: "123", name: "John Doe", age: 30 };
    const encryptedData = encryptData(testData);

    console.log("Encrypted Data: ", encryptedData);

    expect(encryptData).not.toBeNull();
    const decryptedData = decryptData(encryptedData);

    expect(decryptedData).toEqual(testData);
  });

  it("should return null for invalid decryption", () => {
    const invalidData = "invalid";
    const decryptedData = decryptData(invalidData);

    expect(decryptedData).toBeNull();
  });
});
