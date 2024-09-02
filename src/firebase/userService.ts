// src/firebase/userService.ts
import { db } from './firebaseConfig'; 
import { doc, setDoc } from 'firebase/firestore'; // Import Firestore methods

// Function to create a user document
export const createUserDocument = async (userId: string, role: 'free' | 'premium') => {
  const userRef = doc(db, 'users', userId); // Use db here
  await setDoc(userRef, { role }); // Create or overwrite the user document
};
