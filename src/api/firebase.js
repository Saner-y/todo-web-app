// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDtaymjyPpdp00uUTw33rZIKzyNz7FrEpY",
    authDomain: "todo-15fd7.firebaseapp.com",
    projectId: "todo-15fd7",
    storageBucket: "todo-15fd7.firebasestorage.app",
    messagingSenderId: "78166770405",
    appId: "1:78166770405:web:0fa5854406814fc757ca0c",
    measurementId: "G-92WEC9MWKQ"
};

// Firebase'i başlatma kontrolü - düzeltilmiş versiyon
const app = initializeApp(firebaseConfig);

// Tek bir app instance'ı kullanıyoruz
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, firestore, storage };