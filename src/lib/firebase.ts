import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-n9V8jZNsdK5J1xhByH8b-8kw3caVmeA",
  authDomain: "dokteuk-ticket-fe450.firebaseapp.com",
  projectId: "dokteuk-ticket-fe450",
  storageBucket: "dokteuk-ticket-fe450.firebasestorage.app",
  messagingSenderId: "870008497426",
  appId: "1:870008497426:web:e260d3ccbc2501e691ffcb",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);