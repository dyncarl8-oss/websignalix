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

// Helper: Firestore throws errors if fields are 'undefined'. 
// We must convert them to null or remove them.
const sanitizeData = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => sanitizeData(item));
  } else if (data !== null && typeof data === 'object') {
    // Handle specific Firestore types like Timestamp pass-through if needed, 
    // but here we are mostly sanitizing the JSON result.
    return Object.keys(data).reduce((acc, key) => {
      const value = data[key];
      if (value !== undefined) {
        acc[key] = sanitizeData(value);
      } else {
        // Option: acc[key] = null; // Or just skip it
      }
      return acc;
    }, {} as any);
  }
  return data;
};

export const historyService = {
  
  async saveAnalysis(userId: string, pair: CryptoPair, timeframe: string, result: AIAnalysisResult) {
    try {
      // 1. Sanitize the result object to remove any 'undefined' fields
      const cleanResult = sanitizeData(result);
      const cleanPair = sanitizeData(pair);

      // 2. Add to Firestore
      await addDoc(collection(db, COLLECTION_NAME), {
        userId,
        pair: cleanPair,
        timeframe,
        result: cleanResult,
        timestamp: Timestamp.now()
      });
      
      console.log("Analysis saved to history successfully.");
    } catch (error) {
      console.error("Error saving analysis to history:", error);
      // We log but don't throw, to prevent crashing the UI flow
    }
  },

  async getUserHistory(userId: string, maxItems = 20): Promise<HistoryItem[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId),
        limit(50) 
      );

      const querySnapshot = await getDocs(q);
      
      const items = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          pair: data.pair,
          timeframe: data.timeframe,
          result: data.result,
          timestamp: data.timestamp && data.timestamp.toMillis ? data.timestamp.toMillis() : Date.now()
        };
      });

      // Sort client-side (Newest first)
      return items.sort((a, b) => b.timestamp - a.timestamp).slice(0, maxItems);

    } catch (error) {
      console.error("Error fetching history:", error);
      return [];
    }
  }
};