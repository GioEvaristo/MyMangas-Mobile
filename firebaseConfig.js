import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAmdQI4POm0nXq2iBCUoxVDmQE5oB6VDIg",
    authDomain: "biblioteca-firebase-aba7a.firebaseapp.com",
    projectId: "biblioteca-firebase-aba7a",
    storageBucket: "biblioteca-firebase-aba7a.appspot.com", //appspot.com
    messagingSenderId: "991324304321",
    appId: "1:991324304321:web:5b0d7ca95d9f7bc6667540",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);