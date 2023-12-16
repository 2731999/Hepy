// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOtkxkl3RO9Wcl21_OXGhPbs0KUg9IWRk",
  authDomain: "hepy-app-otp.firebaseapp.com",
  projectId: "hepy-app-otp",
  storageBucket: "hepy-app-otp.appspot.com",
  messagingSenderId: "715736558676",
  appId: "1:715736558676:web:c0cab022139731a3c5d1c1",
  measurementId: "G-14N9WQ0BE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);