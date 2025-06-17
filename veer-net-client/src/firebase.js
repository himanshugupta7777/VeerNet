import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZVWaF3P2OUPIu_DGqlKU9PzV_o_m4NL8",
  authDomain: "veernet-chatroom.firebaseapp.com",
  databaseURL: "https://veernet-chatroom-default-rtdb.firebaseio.com",
  projectId: "veernet-chatroom",
  storageBucket: "veernet-chatroom.firebasestorage.app",
  messagingSenderId: "879081608286",
  appId: "1:879081608286:web:807fdd9b1cdb1f095310cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);