import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDCUBQhlj9LlJ448dNh0InUViT2I7GOuzs",
  authDomain: "aidflow-b2ca5.firebaseapp.com",
  projectId: "aidflow-b2ca5",
  storageBucket: "aidflow-b2ca5.firebasestorage.app",
  messagingSenderId: "381854776509",
  appId: "1:381854776509:web:97d20a3a2d3dc95b86cbd4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const needs = [
  { title: "Hot meals for shelter residents", category: "food", urgency: 9, location: "Behala, Kolkata", lat: 22.4956, lng: 88.3201, status: "pending", decayHours: 2, isAnonymous: false },
  { title: "Insulin for diabetic patients", category: "medicine", urgency: 10, location: "Salt Lake, Kolkata", lat: 22.5958, lng: 88.4154, status: "matched", decayHours: 1, isAnonymous: false },
  { title: "Sanitary pads for girls school", category: "sanitary", urgency: 9, location: "Howrah", lat: 22.5958, lng: 88.2636, status: "pending", decayHours: 5, isAnonymous: true },
  { title: "Drinking water bottles", category: "water", urgency: 8, location: "Park Circus, Kolkata", lat: 22.5350, lng: 88.3700, status: "pending", decayHours: 1, isAnonymous: false },
  { title: "Warm blankets for night shelter", category: "shelter", urgency: 6, location: "Sealdah, Kolkata", lat: 22.5651, lng: 88.3700, status: "delivered", decayHours: 10, isAnonymous: false },
  { title: "Soap and shampoo kits", category: "hygiene", urgency: 4, location: "Tollygunge, Kolkata", lat: 22.4986, lng: 88.3529, status: "pending", decayHours: 12, isAnonymous: false },
  { title: "Children clothing donations", category: "clothing", urgency: 3, location: "Garia, Kolkata", lat: 22.4696, lng: 88.3862, status: "matched", decayHours: 24, isAnonymous: false },
  { title: "Emergency rescue supplies", category: "emergency", urgency: 10, location: "Dum Dum, Kolkata", lat: 22.6167, lng: 88.3833, status: "pending", decayHours: 0, isAnonymous: false },
];

async function seed() {
  for (const need of needs) {
    await addDoc(collection(db, "needs"), need);
    console.log("Added:", need.title);
  }
  console.log("All needs added successfully!");
  process.exit(0);
}

seed();