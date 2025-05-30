import { auth, db } from "./firebase.js";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import localforage from "localforage";
import { encryptData, decryptData, deriveKey } from "../utils/encryption.js";

const cashierStore = localforage.createInstance({ name: "cashiers" });

// Sign-up function with encryption, offline storage, and user details
export const signUp = async (email, password, userDetails) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: userDetails.name });

    const key = await deriveKey(password, email);

    console.log("User signed up:", userCredential.user);
    console.log("User details:", userDetails);
    console.log("Encrypting user details for offline storage...");

    // Encrypt user details
    const encryptedUserDetails = await encryptData(key, JSON.stringify(userDetails));

    const offlineToken = await encryptData(key, JSON.stringify({ uid: userCredential.user.uid, email }));

    localStorage.setItem("offlineAuth", JSON.stringify(offlineToken));

    // Store the designation in Firestore
    await setDoc(doc(db, "cashiers", user.uid), {
      name: userDetails.name,
      email,
      designation: userDetails.designation,
    });

    console.log("user id: ", userCredential.user.uid);
    console.log("User details encrypted:", encryptedUserDetails);

    // Store encrypted user details in localForage with the user's ID as the key
    await localforage.setItem(userCredential.user.uid, encryptedUserDetails);

    console.log("User signed up and encrypted details saved offline");
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Sign-in function with decryption and offline support
export const signIn = async (email, password) => {
  const isOnline = navigator.onLine;
  const key = await deriveKey(password, email);

  if (!isOnline) {
    console.log("offline login");
    try {
      const encryptedToken = JSON.parse(localStorage.getItem("offlineAuth"));
      if (!encryptedToken) throw new Error("No offline credentials found");

      const decrypted = await decryptData(key, encryptedToken);
      const parsed = JSON.parse(decrypted);

      // Retrieve userDetails from localForage
      const encryptedUserDetails = await localforage.getItem(parsed.uid);
      console.log("encrypted user deets: ", encryptedUserDetails);
      const userDetails = encryptedUserDetails ? JSON.parse(await decryptData(key, encryptedUserDetails)) : null;
      console.log("Offline login successful, user details retrieved");
      console.log("User signed in offline:", parsed);
      console.log("User details:", userDetails);

      return { user: { uid: parsed.uid, email: parsed.email }, userDetails };
    } catch (error) {
      throw new Error("Offline login failed: " + error);
    }
  } else {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const offlineToken = await encryptData(key, JSON.stringify({ uid: userCredential.user.uid, email }));

      localStorage.setItem("offlineAuth", JSON.stringify(offlineToken));
      localStorage.setItem("offlineMode", "false");

      let userDetails = null;
      const encryptedUserDetails = await localforage.getItem(userCredential.user.uid);

      if (encryptedUserDetails) {
        const decrypted = await decryptData(key, encryptedUserDetails);
        userDetails = JSON.parse(decrypted);
        console.log("User signed in and decrypted details retrieved offline");
      } else {
        console.log("No offline data found for this user");
      }

      return { user: userCredential.user, userDetails };
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

export const fetchCashierDetails = async () => {
  try {
    if (auth.currentUser && auth.currentUser !== null) {
      const userDoc = await getDoc(doc(db, "cashiers", auth.currentUser.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const cashierDetails = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          userDetails: {
            name: userData.name,
            designation: userData.designation,
          },
        };

        return cashierDetails;
      }
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};

// Log out function
export const logoutUser = async () => {
  try {
    // Sign out from Firebase
    await signOut(auth);
    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};
