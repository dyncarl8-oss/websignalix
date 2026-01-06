import { 
  collection, 
  addDoc, 
  query, 
  where, 
  limit, 
  getDocs,
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { HistoryItem, AIAnalysisResult, CryptoPair } from "../types";

const COLLECTION_NAME = "analysis_history";

// Robust sanitization to prevent "Unsupported Field Value: undefined" errors in Firestore
const sanitizeData = (data: any): any => {
  // Primitives
  if (data === null) return null;
  if (data === undefined) return null;
  if (typeof data !== 'object') return data;
  if (data instanceof Date) return data; // Keep Dates as is

  // Arrays
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  }

  // Objects
  const newObj: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      // Firestore does not accept 'undefined', so we skip the key entirely
      if (value !== undefined) {
        newObj[key] = sanitizeData(value);
      }
    }
  }
  return newObj;
};

export const historyService = {
  
  async saveAnalysis(userId: string, pair: CryptoPair, timeframe: string, result: AIAnalysisResult) {
    console.log(`[History] Attempting to save analysis for user: ${userId}`);
    
    if (!userId) {
      console.error("[History] Error: No User ID provided.");
      return;
    }

    try {
      // 1. Sanitize input data to ensure no undefined values exist
      const cleanResult = sanitizeData(result);
      const cleanPair = sanitizeData(pair);
      
      const payload = {
        userId,
        pair: cleanPair,
        timeframe,
        result: cleanResult,
        timestamp: Timestamp.now()
      };

      console.log("[History] Payload prepared, writing to Firestore...", payload);

      // 2. Write to Firestore
      const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
      console.log(`[History] SUCCESS: Document written with ID: ${docRef.id}`);
      
    } catch (error: any) {
      console.error("[History] SAVE FAILED. Check Firestore Console.", error);
      
      if (error.code === 'permission-denied') {
        console.error(">> PERMISSION DENIED: Please check your Firestore Security Rules. Ensure writes are allowed for authenticated users.");
      } else if (error.code === 'unavailable') {
        console.error(">> NETWORK ERROR: Check your internet connection or Firebase service status.");
      }
    }
  },

  async getUserHistory(userId: string, maxItems = 20): Promise<HistoryItem[]> {
    console.log(`[History] Fetching items for user: ${userId}`);
    try {
      // Simple query: Filter by user, limit results. 
      // We do NOT use orderBy here server-side to avoid needing a composite index immediately.
      // We sort in memory client-side.
      const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      console.log(`[History] Found ${querySnapshot.size} documents.`);

      const items = querySnapshot.docs.map(doc => {
        const data = doc.data();
        
        // Handle timestamp conversion safely (fall back to Date.now() if missing)
        let ts = Date.now();
        if (data.timestamp && typeof data.timestamp.toMillis === 'function') {
           ts = data.timestamp.toMillis();
        } else if (data.timestamp instanceof Date) {
           ts = data.timestamp.getTime();
        }

        return {
          id: doc.id,
          userId: data.userId,
          pair: data.pair,
          timeframe: data.timeframe,
          result: data.result,
          timestamp: ts
        } as HistoryItem;
      });

      // Sort Descending (Newest First) in memory
      const sorted = items.sort((a, b) => b.timestamp - a.timestamp);
      return sorted.slice(0, maxItems);

    } catch (error: any) {
      console.error("[History] FETCH FAILED:", error);
      if (error.message && error.message.includes("index")) {
        console.error(">> MISSING INDEX: If you see a link in the error above, click it to create the index in Firebase Console.");
      }
      return [];
    }
  }
};