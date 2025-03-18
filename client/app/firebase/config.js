// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2X1_Ggtmgs18YQpRSDF1SlpOmp15iUcE",
  authDomain: "pyro-d9fcd.firebaseapp.com",
  databaseURL: "https://pyro-d9fcd-default-rtdb.firebaseio.com",
  projectId: "pyro-d9fcd",
  storageBucket: "pyro-d9fcd.firebasestorage.app",
  messagingSenderId: "663554010744",
  appId: "1:663554010744:web:57edba512781961968078d",
  measurementId: "G-DERPGLFXXP"
};
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app) //now expose this to application 

export {app, auth}