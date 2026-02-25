import NetInfo from "@react-native-community/netinfo";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { getOfflineSubstrat, updateOfflineSubstrat } from "./offlineSubstrate";
import * as Notifications from "expo-notifications";

let isSyncing = false;

export const startAutoSync = () => {
  const unsubscribe = NetInfo.addEventListener(async (state) => {
    if (!state.isConnected) return;

    // 🔥 Kalau sedang sync, jangan jalankan lagi
    if (isSyncing) return;

    isSyncing = true;
    console.log("📶 Kembali Online, mulai sync...");

    try {
      const offlineData = await getOfflineSubstrat();
      console.log("offline data:", offlineData);

      const unsyncedData = offlineData.filter((item) => !item.synced);

      if (unsyncedData.length === 0) {
        console.log("✅ Tidak ada data offline");
        isSyncing = false;
        return;
      }

      // 🔥 Ambil ID terakhir SEKALI SAJA (lebih efisien)
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

      let nextNumber = maxNumber;

      let updatedData = [...offlineData];

      for (let item of unsyncedData) {
        nextNumber += 1;
        const nextId = "s" + nextNumber.toString().padStart(5, "0");

        await setDoc(doc(db, "PengisianSubstrat", nextId), {
          waktu: item.waktu,
          items: item.items,
          createdAt: new Date(),
        });

        item.synced = true;

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Data Berhasil Sync ✅",
            body: `Substrat berhasil dikirim`,
          },
          trigger: null,
        });

        console.log("🔥 Sync sukses dengan ID:", nextId);
      }

      await updateOfflineSubstrat(updatedData);
      console.log("✅ Semua data offline berhasil disinkronisasi");
    } catch (error) {
      console.log("❌ Sync error:", error);
    }

    isSyncing = false;
  });

  return unsubscribe;
};
