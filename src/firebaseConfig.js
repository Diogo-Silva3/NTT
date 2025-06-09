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

// Initialize App Check
// IMPORTANT: Replace 'YOUR_RECAPTCHA_SITE_KEY' with your actual reCAPTCHA v3 Site Key
// You get this from the Google reCAPTCHA admin console when you register your site.
// Make sure self.FIREBASE_APPCHECK_DEBUG_TOKEN is not set to true in production.
// self.FIREBASE_APPCHECK_DEBUG_TOKEN = true; // For development ONLY, remove for production

try {
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'), 
    isTokenAutoRefreshEnabled: true 
  });
  console.log("Firebase App Check initialized successfully.");
} catch (error) {
  console.error("Error initializing Firebase App Check: ", error);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };