import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: "AIzaSyCfB-l458TwX-6IUf0ppTtiP6ra9QJ9ZjI",
  authDomain: "ntt-checklist.firebaseapp.com",
  projectId: "ntt-checklist",
  storageBucket: "ntt-checklist.firebasestorage.app",
  messagingSenderId: "512595866970",
  appId: "1:512595866970:web:06bb68417a08f53356af63"
};

const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };