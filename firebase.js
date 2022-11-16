import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTg_hJA20UNwS77mv7yCFxe73jEuFhIVo",
  authDomain: "fir-auth-b5f8a.firebaseapp.com",
  projectId: "fir-auth-b5f8a",
  storageBucket: "fir-auth-b5f8a.appspot.com",
  messagingSenderId: "1023645176130",
  appId: "1:1023645176130:web:8d06fbfa1bc885e90e78db",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
