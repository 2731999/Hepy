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

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {getAuth} from 'firebase/auth'

// const firebaseConfig = {
//   apiKey: "AIzaSyDSpdDtUxRi0wD30eSYMU_S5oRqzoTGbTw",
//   authDomain: "hepy-1ba05.firebaseapp.com",
//   projectId: "hepy-1ba05",
//   storageBucket: "hepy-1ba05.appspot.com",
//   messagingSenderId: "598267798077",
//   appId: "1:598267798077:web:6ba4a3247f6d9320f6c054",
//   measurementId: "G-MFBXS7WQ8J"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app)