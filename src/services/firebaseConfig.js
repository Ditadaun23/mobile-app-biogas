import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRNJxdd-Xq1_qIbMHVflqD1wPsyNagc4A",
  authDomain: "tesdhtt.firebaseapp.com",
  projectId: "tesdhtt",
  storageBucket: "tesdhtt.appspot.com",
  messagingSenderId: "522121365140",
  appId: "1:522121365140:web:aebadafe6131cfcb0bd681",
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
