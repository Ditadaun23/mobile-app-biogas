import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";

export async function testFirestore() {
  try {
    const snap = await getDocs(collection(db, "test"));
    console.log("🔥 FIRESTORE CONNECTED");
    console.log("Docs:", snap.size);
  } catch (e) {
    console.log("❌ ERROR:", e.message);
  }
}
