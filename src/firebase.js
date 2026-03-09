import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDoc5tWhNkCZ_QoXcbPW1djAjpkvXasb6Y",
    authDomain: "mindmesh-f20ce.firebaseapp.com",
    projectId: "mindmesh-f20ce",
    storageBucket: "mindmesh-f20ce.firebasestorage.app",
    messagingSenderId: "889375129549",
    appId: "1:889375129549:web:cabefaf51ec70a032c8e84",
    measurementId: "G-2EW5GMMH25"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
