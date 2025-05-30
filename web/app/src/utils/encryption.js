import CryptoJs from "crypto-js";

// const SEC_KEY = "1234567890abcdef1234567890abcdef";

// export const encryptData = (data) => {
//   try {
//     const encryptedData = CryptoJs.AES.encrypt(JSON.stringify(data), SEC_KEY).toString();
//     return encryptedData;
//   } catch (e) {
//     console.error("Error encrypting data: ", e);
//     return null;
//   }
// };

// export const decryptData = (encryptedText) => {
//   try {
//     const bytes = CryptoJs.AES.decrypt(encryptedText, SEC_KEY);
//     const decryptedData = JSON.parse(bytes.toString(CryptoJs.enc.Utf8));
//     return decryptedData;
//   } catch (e) {
//     console.error("Error decrypting data: ", e);
//     return null;
//   }
// };

export async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const baseKey = await window.crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, [
    "deriveKey",
  ]);

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt), // Typically user email
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt text using derived key
export async function encryptData(key, text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(text));
  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted)),
  };
}

// Decrypt back into plain text
export async function decryptData(key, encrypted) {
  const iv = new Uint8Array(encrypted.iv);
  const data = new Uint8Array(encrypted.data);
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(decrypted);
}
