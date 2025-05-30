import localforage from "localforage";

// Save Last Reference Number
export const saveLastReferenceNumber = async (referenceNumber) => {
  try {
    await localforage.setItem("lastReferenceNumber", referenceNumber);
    console.log("Last reference number saved to localForage");
  } catch (e) {
    console.error("Error saving last reference number to localForage: ", e);
  }
};

// Get Last Reference Number
export const getLastReferenceNumber = async () => {
  try {
    const lastReferenceNumber = await localforage.getItem("lastReferenceNumber");
    return lastReferenceNumber;
  } catch (e) {
    console.error("Error getting last reference number from localForage: ", e);
    return null;
  }
};

// Clear LocalForage
export const clearLocalForage = async () => {
  try {
    await localforage.clear();
    console.log("localForage cleared");
  } catch (e) {
    console.error("Error clearing localForage: ", e);
  }
};
