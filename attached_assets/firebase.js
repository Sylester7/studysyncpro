import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKrlQMxwbmEMBlf8cCw5dkFgiJnGTi3EI",
  authDomain: "studysync-d9e01.firebaseapp.com",
  projectId: "studysync-d9e01",
  storageBucket: "studysync-d9e01.firebasestorage.app",
  messagingSenderId: "11972193522",
  appId: "1:11972193522:web:3a9b83aca885387994f46b",
  measurementId: "G-YF97EH350B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 