// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, GoogleAuthProvider } from 'firebase/auth';

import { firebaseConfig } from "./firebase_creds";

import {getFirestore} from "firebase/firestore";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;

const auth = getAuth();
const db = getFirestore(app);
const googleAuthProvider = new GoogleAuthProvider();

export {auth, googleAuthProvider, db};
