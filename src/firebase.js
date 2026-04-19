import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCUBQhlj9LlJ448dNh0InUViT2I7GOuzs",
  authDomain: "aidflow-b2ca5.firebaseapp.com",
  projectId: "aidflow-b2ca5",
  storageBucket: "aidflow-b2ca5.firebasestorage.app",
  messagingSenderId: "381854776509",
  appId: "1:381854776509:web:97d20a3a2d3dc95b86cbd4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);