import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCTg_hJA20UNwS77mv7yCFxe73jEuFhIVo",
  authDomain: "fir-auth-b5f8a.firebaseapp.com",
  projectId: "fir-auth-b5f8a",
  storageBucket: "fir-auth-b5f8a.appspot.com",
  messagingSenderId: "1023645176130",
  appId: "1:1023645176130:web:8d06fbfa1bc885e90e78db",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
