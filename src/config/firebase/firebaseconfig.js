



import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyC5i_jimen4rJFfVrQ6P3-jlvNwg9ZUnoA",
    authDomain: "hackathon-422b4.firebaseapp.com",
    projectId: "hackathon-422b4",
    storageBucket: "hackathon-422b4.appspot.com",
    messagingSenderId: "253730224450",
    appId: "1:253730224450:web:137a3b8bf381c15574b0db",
    measurementId: "G-YESEJ1RF0H"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
