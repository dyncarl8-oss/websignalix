import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  User,
  sendEmailVerification,
  sendPasswordResetEmail
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
import { paymentService } from './paymentService';

// Helper to convert Firebase User + Firestore Data to our UserProfile type
const mapUserToProfile = (firebaseUser: User, extraData: any): UserProfile => {
  return {
    id: firebaseUser.uid,
    name: extraData?.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Trader',
    email: firebaseUser.email || '',
    photoURL: firebaseUser.photoURL || null,
    credits: extraData?.credits ?? INITIAL_CREDITS,
    isPro: extraData?.isPro || false,
    joinedAt: extraData?.joinedAt || Date.now()
  };
};

export const userService = {
  // Login with Email/Password
  async login(email: string, password?: string): Promise<UserProfile> {
    if (!password) throw new Error("Password required");
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Email Verification Check
    if (!user.emailVerified) {
      await signOut(auth);
      throw new Error("Email not verified. Please check your inbox.");
    }

    // Fetch user details (credits) from Firestore
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        return mapUserToProfile(user, userDoc.data());
      } else {
        const newProfile = {
          name: email.split('@')[0],
          email: email,
          credits: INITIAL_CREDITS,
          isPro: false,
          joinedAt: Date.now()
        };
        await setDoc(userDocRef, newProfile);
        return mapUserToProfile(user, newProfile);
      }
    } catch (error: any) {
      console.warn("Firestore access failed. Using temporary auth profile.", error);
      return mapUserToProfile(user, { credits: INITIAL_CREDITS, isPro: false });
    }
  },

  // Register new user
  async register(email: string, name?: string, password?: string): Promise<void> {
    if (!password) password = "defaultPassword123!"; 

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send Verification Email
    await sendEmailVerification(user);

    const userProfileData = {
      name: name || email.split('@')[0],
      email: email,
      credits: INITIAL_CREDITS,
      isPro: false,
      joinedAt: Date.now()
    };

    try {
      await setDoc(doc(db, "users", user.uid), userProfileData);
    } catch (error) {
      console.warn("Failed to create Firestore document.", error);
    }

    // Sign out immediately so they can't access dashboard until verified
    await signOut(auth);
  },

  // Password Reset
  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  // Google Login (Auto-verified usually)
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
        const newProfile = {
          name: user.displayName || 'Google User',
          email: user.email,
          credits: INITIAL_CREDITS,
          isPro: false,
          joinedAt: Date.now()
        };
        await setDoc(userDocRef, newProfile);
        return mapUserToProfile(user, newProfile);
      }
    } catch (error: any) {
      console.warn("Firestore access failed.", error);
      return mapUserToProfile(user, { credits: INITIAL_CREDITS, isPro: false });
    }
  },

  // Update credits in Firestore
  async updateCredits(email: string, newAmount: number): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    // Pro users should not really need this, but we keep it for consistency
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        credits: newAmount
      });
    } catch (e) {
      console.warn("Could not persist credit update", e);
    }
  },

  // Upgrade to Pro (Called after successful payment)
  async upgradeToPro(): Promise<UserProfile | null> {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const updates = { isPro: true, credits: 999999 }; // Flag and logic safety
      await updateDoc(userDocRef, updates);
      
      const updatedDoc = await getDoc(userDocRef);
      return mapUserToProfile(currentUser, updatedDoc.data());
    } catch (e) {
      console.error("Failed to upgrade user to Pro", e);
      throw e;
    }
  },

  // Session Management
  async logout() {
    await signOut(auth);
  },

  // Get Current Profile with Auto-Sync
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;

    // Check verification status here too
    if (!user.emailVerified) {
      return null;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const profileData = userDoc.data();
        let currentProfile = mapUserToProfile(user, profileData);

        // SYNC CHECK: If locally Pro, verify with Polar backend
        if (currentProfile.isPro && currentProfile.email) {
           try {
             const status = await paymentService.checkSubscriptionStatus(currentProfile.email);
             
             if (!status.isPro) {
                // EXPIRED! Downgrade
                console.log("Subscription expired. Downgrading user...");
                await updateDoc(userDocRef, { isPro: false, credits: 3 }); 
                currentProfile.isPro = false;
                currentProfile.credits = 3;
             }
           } catch (err) {
             console.warn("Failed to sync subscription status, keeping local state.", err);
           }
        }

        return currentProfile;
      }
    } catch (error) {
      console.warn("Firestore access failed.");
    }
    
    return mapUserToProfile(user, { credits: INITIAL_CREDITS, isPro: false });
  }
};