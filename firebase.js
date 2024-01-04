// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOOd8pDOGQivgoC9SJFZ4ZDsHA9qxASuc",
  authDomain: "globaldmiimages.firebaseapp.com",
  projectId: "globaldmiimages",
  storageBucket: "globaldmiimages.appspot.com",
  messagingSenderId: "871819626636",
  appId: "1:871819626636:web:a1f474d7856a337540d3a9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { auth, db };
export const storage = getStorage(app);
