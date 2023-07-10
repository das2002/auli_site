// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP9Wu6bJaP1xZ3ia5PXaomwL9G-iET_zM",
  authDomain: "auli-website.firebaseapp.com",
  projectId: "auli-website",
  storageBucket: "auli-website.appspot.com",
  messagingSenderId: "532419651189",
  appId: "1:532419651189:web:f471f644f138c21dbeba3c",
  measurementId: "G-BRKYWEXKHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);