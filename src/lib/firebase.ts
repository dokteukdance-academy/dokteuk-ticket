import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHRxSs4gPyztFkkgd4UI5dG4lyX3d9LFw",
  authDomain: "dokteuk-ticket.firebaseapp.com",
  projectId: "dokteuk-ticket",
  storageBucket: "dokteuk-ticket.firebasestorage.app",
  messagingSenderId: "55537993922",
  appId: "1:55537993922:web:64076adeeeca508946535b",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);