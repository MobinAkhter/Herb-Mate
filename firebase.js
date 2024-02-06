// import * as firebase from "firebase";
// import "firebase/auth";
// import "firebase/firestore";
import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import * as firestore from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTg_hJA20UNwS77mv7yCFxe73jEuFhIVo",
  authDomain: "fir-auth-b5f8a.firebaseapp.com",
  projectId: "fir-auth-b5f8a",
  storageBucket: "fir-auth-b5f8a.appspot.com",
  messagingSenderId: "1023645176130",
  appId: "1:1023645176130:web:8d06fbfa1bc885e90e78db",
};

//let app;
const app = initializeApp(firebaseConfig);
// const app = firebase.app();

// if (firebase.apps.length === 0) {
// } else {
// }
const db = getFirestore(app);

//const db = app.firestore();
// const auth = firebase.auth();
const auth = getAuth();

export { db, auth, firestore };
