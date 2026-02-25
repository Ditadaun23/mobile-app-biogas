// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// // import AsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBRNJxdd-Xq1_qIbMHVflqD1wPsyNagc4A",
//   authDomain: "tesdhtt.firebaseapp.com",
//   projectId: "tesdhtt",
//   storageBucket: "tesdhtt.firebasestorage.app",
//   messagingSenderId: "522121365140",
//   appId: "1:522121365140:web:aebadafe6131cfcb0bd681",
// };

// const app = initializeApp(firebaseConfig);

// // ✅ Auth khusus React Native
// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBRNJxdd-Xq1_qIbMHVflqD1wPsyNagc4A",
  authDomain: "tesdhtt.firebaseapp.com",
  projectId: "tesdhtt",
  storageBucket: "tesdhtt.firebasestorage.app",
  messagingSenderId: "522121365140",
  appId: "1:522121365140:web:aebadafe6131cfcb0bd681",
};

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }

const app = initializeApp(firebaseConfig);

export const realtimedb = getDatabase(app);
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ WAJIB
