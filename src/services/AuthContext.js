import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import defaultAvatar from "../../assets/default_avatar.jpeg";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // 🔹 Jika logout
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      if (!firebaseUser.emailVerified) {
        await signOut(auth);
        setUser(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "pengguna", firebaseUser.uid);

      let snap = await getDoc(userRef);

      // 🔹 Jika user BELUM ADA di Firestore
      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || defaultAvatar,
          provider: firebaseUser.providerData[0]?.providerId || "password",
          role: "operator", // siap untuk IoT control
          createdAt: new Date(),
        });

        // ambil ulang data setelah dibuat
        snap = await getDoc(userRef);
      }

      // 🔹 Simpan ke state
      setUser({
        uid: firebaseUser.uid,
        ...snap.data(),
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 PANTAU LOGIN FIREBASE
  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, (firebaseUser) => {
  //     setUser(firebaseUser);
  //     setLoading(false);
  //   });

  //   return unsub;
  // }, []);

  const register = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await sendEmailVerification(userCredential.user);
    await signOut(auth);
    return userCredential.user;
    // await createUserWithEmailAndPassword(auth, email, password);
    // user otomatis ke-set oleh onAuthStateChanged
  };

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error("Email belum diverifikasi");
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, resetPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
