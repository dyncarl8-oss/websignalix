import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  User
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { UserProfile } from '../types';
import { INITIAL_CREDITS } from '../constants';

// Helper to convert Firebase User + Firestore Data to our UserProfile type
const mapUserToProfile = (firebaseUser: User, extraData: any): UserProfile => {
  return {
    id: firebaseUser.uid,
    name: extraData?.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Trader',
    email: firebaseUser.email || '',
    photoURL: firebaseUser.photoURL || null,
    credits: extraData?.credits ?? INITIAL_CREDITS,
    joinedAt: extraData?.joinedAt || Date.now()
  };
};

export const userService = {
  // Login with Email/Password
  async login(email: string, password?: string): Promise<UserProfile> {
    if (!password) throw new Error("Password required");
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user details (credits) from Firestore
    // Wrap in try/catch to handle permission errors gracefully
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return mapUserToProfile(user, userDoc.data());
      } else {
        // Edge case: Auth exists but DB doc missing, create it
        const newProfile = {
          name: email.split('@')[0],
          email: email,
          credits: INITIAL_CREDITS,
          joinedAt: Date.now()
        };
        await setDoc(userDocRef, newProfile);
        return mapUserToProfile(user, newProfile);
      }
    } catch (error: any) {
      console.warn("Firestore access failed (likely permissions). Using temporary auth profile.", error);
      return mapUserToProfile(user, { credits: INITIAL_CREDITS });
    }
  },

  // Register new user
  async register(email: string, name?: string, password?: string): Promise<UserProfile> {
    if (!password) password = "defaultPassword123!"; 

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfileData = {
      name: name || email.split('@')[0],
      email: email,
      credits: INITIAL_CREDITS,
      joinedAt: Date.now()
    };

    try {
      await setDoc(doc(db, "users", user.uid), userProfileData);
    } catch (error) {
      console.warn("Failed to create Firestore document (permissions). Proceeding with auth only.", error);
    }

    return mapUserToProfile(user, userProfileData);
  },

  // Google Login
  async googleLogin(): Promise<UserProfile> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return mapUserToProfile(user, userDoc.data());
      } else {
        // First time Google login - create DB entry
        const newProfile = {
          name: user.displayName || 'Google User',
          email: user.email,
          credits: INITIAL_CREDITS,
          joinedAt: Date.now()
        };
        await setDoc(userDocRef, newProfile);
        return mapUserToProfile(user, newProfile);
      }
    } catch (error: any) {
      console.warn("Firestore access failed (likely permissions). Using temporary auth profile.", error);
      // Fallback: Return profile based on Auth data only so user can still log in
      return mapUserToProfile(user, { credits: INITIAL_CREDITS });
    }
  },

  // Update credits in Firestore
  async updateCredits(email: string, newAmount: number): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        credits: newAmount
      });
    } catch (e) {
      console.warn("Could not persist credit update (likely permissions)", e);
    }
  },

  // Session Management
  async logout() {
    await signOut(auth);
  },

  // Get Current Profile
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        return mapUserToProfile(user, userDoc.data());
      }
    } catch (error) {
      console.warn("Firestore access failed. Using auth data fallback.");
    }
    
    // Fallback if doc missing or permission denied
    return mapUserToProfile(user, { credits: INITIAL_CREDITS });
  }
};