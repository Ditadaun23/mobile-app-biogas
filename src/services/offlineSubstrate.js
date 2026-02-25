import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "OFFLINE_SUBSTRAT_QUEUE";

export const saveOfflineSubstrat = async (payload) => {
  try {
    const existing = await AsyncStorage.getItem(KEY);
    const data = existing ? JSON.parse(existing) : [];

    data.push({
      ...payload, // ⬅️ payload SUDAH punya localId
      synced: false,
      createdAt: Date.now(),
    });

    await AsyncStorage.setItem(KEY, JSON.stringify(data));
    console.log("📦 Offline substrat disimpan");
  } catch (err) {
    console.log("🔥 saveOfflineSubstrat error:", err);
    throw err;
  }
};

export const getOfflineSubstrat = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const updateOfflineSubstrat = async (updatedData) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(updatedData));
    console.log("✅ Offline substrat berhasil diupdate");
  } catch (err) {
    console.log("🔥 updateOfflineSubstrat error:", err);
    throw err;
  }
};

export const clearOfflineSubstrat = async () => {
  await AsyncStorage.removeItem(KEY);
};
