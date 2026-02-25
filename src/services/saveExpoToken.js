import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function saveExpoToken(uid, token) {
  if (!uid || !token) return;

  const tokenRef = doc(db, "expoTokens", token);

  await setDoc(
    tokenRef,
    {
      uid,
      token,
      platform: "expo",
      active: true,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
