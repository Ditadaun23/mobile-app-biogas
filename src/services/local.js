import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "ultrasonic_latest";

export const saveLocalData = async (data) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
    console.log("✅ Disimpan ke AsyncStorage");
  } catch (e) {
    console.log("❌ Gagal simpan lokal");
  }
};

export const getLocalData = async () => {
  try {
    const value = await AsyncStorage.getItem(KEY);
    console.log("📦 Data lokal:", value);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    return null;
  }
};
