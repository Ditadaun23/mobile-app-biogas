import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import NetInfo from "@react-native-community/netinfo";
import { saveOfflineSubstrat } from "./offlineSubstrate";
import { v4 as uuidv4 } from "uuid";
import "react-native-get-random-values";

export const kirimSubstrat = async (substrates) => {
  const now = new Date();

  const payload = {
    localId: uuidv4(),
    waktu:
      now.toLocaleDateString("id-ID") +
      " " +
      now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    items: substrates.map((item) => ({
      jenis: item.jenis,
      ukuran: item.ukuran,
      satuan: item.satuan,
    })),
    createdAt: Date.now(),
    synced: false,
  };

  try {
    const state = await NetInfo.fetch();
    console.log("🌐 NETWORK:", state.isConnected);

    // 📴 OFFLINE MODE
    if (!state.isConnected) {
      await saveOfflineSubstrat(payload);
      console.log("📦 Disimpan offline");
      return { offline: true };
    }

    // 📡 ONLINE MODE
    const snapshot = await getDocs(collection(db, "PengisianSubstrat"));
    let maxNumber = 0;

    snapshot.forEach((document) => {
      const id = document.id;

      if (id.startsWith("s")) {
        const num = parseInt(id.substring(1), 10);

        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    const nextNumber = maxNumber + 1;
    const nextId = "s" + nextNumber.toString().padStart(5, "0");

    await setDoc(doc(db, "PengisianSubstrat", nextId), {
      waktu: payload.waktu,
      createdAt: new Date(),
      items: payload.items,
    });

    console.log("🔥 Berhasil simpan ke Firestore dengan ID:", nextId);

    return { success: true, id: nextId };
  } catch (error) {
    console.log("❌ Error, fallback offline:", error);

    await saveOfflineSubstrat(payload);
    return { offline: true };
  }
};
