// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCU6fHI8lw2DSPMDOoAABcENagJirdWwwY",
  authDomain: "my-cato.firebaseapp.com",
  projectId: "my-cato",
  storageBucket: "my-cato.appspot.com",
  messagingSenderId: "999005191810",
  appId: "1:999005191810:web:894ba5307ec882f7527e9b",
  measurementId: "G-GJEFW5FBSE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
