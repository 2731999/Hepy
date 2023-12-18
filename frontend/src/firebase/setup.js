import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyB7muTUmEkJKndPhxKhOzhT4V1uYCHf5Lg",
  authDomain: "hepy-d9086.firebaseapp.com",
  projectId: "hepy-d9086",
  storageBucket: "hepy-d9086.appspot.com",
  messagingSenderId: "6138148893",
  appId: "1:6138148893:web:74478eb97c0f9ecef1aef4",
  measurementId: "G-CDW5GWZZJ6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

