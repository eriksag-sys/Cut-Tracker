// ============================================================
// FIREBASE CONFIGURATION & SYNCED STORAGE LAYER
// ============================================================
// Uses Firebase Realtime Database for cross-device sync
// Falls back to localStorage when offline
// ============================================================

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, off } from 'firebase/database';

// Firebase config — replace with your own project config
// See README.md for setup instructions
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

let app = null;
let db = null;
let firebaseReady = false;

try {
    if (firebaseConfig.databaseURL) {
        app = initializeApp(firebaseConfig);
        db = getDatabase(app);
        firebaseReady = true;
        console.log("Firebase connected ✓");
    } else {
        console.warn("Firebase not configured — using localStorage only. See README for setup.");
    }
} catch (e) {
    console.warn("Firebase init failed, using localStorage fallback:", e.message);
}

// ============================================================
// Storage API
// ============================================================

const STORAGE_PREFIX = "cut-tracker-";

/** Save data to Firebase + localStorage */
export const saveData = async (key, data) => {
    const fullKey = STORAGE_PREFIX + key;
    const json = JSON.stringify(data);

    // Always save to localStorage (offline cache)
    try {
        localStorage.setItem(fullKey, json);
    } catch (e) {
        console.error("localStorage save failed:", key, e);
    }

    // Save to Firebase if available
    if (firebaseReady && db) {
        try {
            await set(ref(db, `tracker/${key}`), data);
        } catch (e) {
            console.error("Firebase save failed:", key, e);
        }
    }
};

/** Load data — tries Firebase first, falls back to localStorage */
export const loadData = async (key) => {
    const fullKey = STORAGE_PREFIX + key;

    // Try Firebase first
    if (firebaseReady && db) {
        try {
            const snapshot = await get(ref(db, `tracker/${key}`));
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Update localStorage cache
                localStorage.setItem(fullKey, JSON.stringify(data));
                return data;
            }
        } catch (e) {
            console.warn("Firebase load failed, using localStorage:", e.message);
        }
    }

    // Fallback to localStorage
    try {
        const stored = localStorage.getItem(fullKey);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

/** Subscribe to real-time changes from Firebase (for cross-device sync) */
export const onDataChange = (key, callback) => {
    if (!firebaseReady || !db) return () => { };

    const dbRef = ref(db, `tracker/${key}`);
    const unsubscribe = onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.val());
        }
    });

    // Return cleanup function
    return () => off(dbRef);
};

/** Check if Firebase is connected */
export const isFirebaseConnected = () => firebaseReady;
