import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyD9epOurchI8J66EnHqfoS-iSks6uKGz64",
    authDomain: "tickets-caa8a.firebaseapp.com",
    projectId: "tickets-caa8a",
    storageBucket: "tickets-caa8a.firebasestorage.app",
    messagingSenderId: "773242601132",
    appId: "1:773242601132:web:9217b1c5934b0ee74ca909",
    measurementId: "G-370V30R0TD"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { auth, db };