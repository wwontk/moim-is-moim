// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAZMgaHzDfjDxtfg7vLkw3r6FIGmzqtnQA",
  authDomain: "whatismoim.firebaseapp.com",
  databaseURL:
    "https://whatismoim-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "whatismoim",
  storageBucket: "whatismoim.appspot.com",
  messagingSenderId: "1094044924244",
  appId: "1:1094044924244:web:29cf178624b10f2204b0c1",
  measurementId: "G-E5SBKWB5NY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage();

export { analytics, auth, database, storage };
