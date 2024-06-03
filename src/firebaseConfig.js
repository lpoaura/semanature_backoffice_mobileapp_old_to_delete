// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: "AIzaSyAVZBF5Usq_a05v__h4iKVjveMc9Tiyrj8",
//     authDomain: "lpo-remake.firebaseapp.com",
//     projectId: "lpo-remake",
//     storageBucket: "lpo-remake.appspot.com",
//     messagingSenderId: "249903850907",
//     appId: "1:249903850907:web:8d0d3b2d40507b867d6d3e",
//     measurementId: "G-05VDKC9FBS"
// };

const firebaseConfig = {
    apiKey: "AIzaSyAbt_ZCs9w1LPlxhJbrKjyAx0xwee9SZ5o",
    authDomain: "lpo-mobileapp-firebase.firebaseapp.com",
    projectId: "lpo-mobileapp-firebase",
    storageBucket: "lpo-mobileapp-firebase.appspot.com",
    messagingSenderId: "555551483811",
    appId: "1:555551483811:web:74bafe5cc3a8388f711c16",
    databaseURL: "https://lpo-mobileapp.firebaseio.com"
};
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firebase auth
const auth = getAuth(app);

//Initialize firestore database
const db = getFirestore(app);

//Initialize firebase storage
const storage = getStorage(app);

export { app, auth, db, storage }
