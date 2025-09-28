// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your Firebase Web App Config
const firebaseConfig = {
  apiKey: "...API KEY...",
  authDomain: "floodguardx1-6ed9f.firebaseapp.com",
  databaseURL: "https://floodguardx1-6ed9f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "floodguardx1-6ed9f",
  storageBucket: "floodguardx1-6ed9f.appspot.com",
  messagingSenderId: "1070572550406",
  appId: "1:1070572550406:web:5c8d83b02ac2198119c687"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Database
export const db = getDatabase(app);
