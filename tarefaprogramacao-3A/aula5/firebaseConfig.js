// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBPJvcLK5FoaqExoRYzlB_EKmeBZXALczo",
    authDomain: "tarefaprog-85681.firebaseapp.com",
    projectId: "tarefaprog-85681",
    storageBucket: "tarefaprog-85681.firebasestorage.app",
    messagingSenderId: "614033347459",
    appId: "1:614033347459:web:f994d411b84ec041a99cb6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

getAuth(app);

export default app;