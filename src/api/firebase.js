// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDtaymjyPpdp00uUTw33rZIKzyNz7FrEpY",
    authDomain: "todo-15fd7.firebaseapp.com",
    projectId: "todo-15fd7",
    storageBucket: "todo-15fd7.firebasestorage.app",
    messagingSenderId: "78166770405",
    appId: "1:78166770405:web:0fa5854406814fc757ca0c",
    measurementId: "G-92WEC9MWKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);