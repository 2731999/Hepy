import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDsULxI5OlG7SM5RjgNcMltP-9kIl1Bd9g",
  authDomain: "hepy-otp-2debc.firebaseapp.com",
  projectId: "hepy-otp-2debc",
  storageBucket: "hepy-otp-2debc.appspot.com",
  messagingSenderId: "18662803729",
  appId: "1:18662803729:web:41b06060481a1cc96fa4b0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)