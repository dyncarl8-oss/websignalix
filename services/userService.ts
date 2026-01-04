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
  },

  // Register new user
  async register(email: string, name?: string, password?: string): Promise<UserProfile> {
    // 1. Create Auth User
    // Note: In a real app we'd pass password. For this demo flow, we assume password is provided.
    // If using the simple flow from before where only email was asked initially, 
    // we might need to prompt for password or send a sign-in link.
    // Assuming the UI now provides a password.
    
    if (!password) password = "defaultPassword123!"; // Fallback for demo if UI doesn't send it

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Create User Document in Firestore to hold credits
    const userProfileData = {
      name: name || email.split('@')[0],
      email: email,
      credits: INITIAL_CREDITS,
      joinedAt: Date.now()
    };

    await setDoc(doc(db, "users", user.uid), userProfileData);

    return mapUserToProfile(user, userProfileData);
  },

  // Google Login
  async googleLogin(): Promise<UserProfile> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

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
  },

  // Update credits in Firestore
  async updateCredits(email: string, newAmount: number): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    // Security: Ensure we are updating the current user's doc
    const userDocRef = doc(db, "users", currentUser.uid);
    await updateDoc(userDocRef, {
      credits: newAmount
    });
  },

  // Session Management (Handled by Firebase, but we provide a logout wrapper)
  async logout() {
    await signOut(auth);
  },

  // Helper to get current profile if already signed in
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return mapUserToProfile(user, userDoc.data());
    }
    return null;
  }
};