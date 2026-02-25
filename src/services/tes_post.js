import { collection, addDoc } from "firebase/firestore";
import { firestore } from "./firebaseConfig";

export async function postJarakFirestore(jarak) {
  try {
    await addDoc(collection(firestore, "ProduksiHarianUltrasonik"), {
      jarak: Number(jarak),
      waktu: new Date().toLocaleString("id-ID"),
      waktuTS: Date.now(),
    });

    console.log("✅ POST Firestore berhasil");
  } catch (e) {
    console.log("❌ POST Firestore error:", e.message);
  }
}
