import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

import BoxAtas from "../components/Fragments/BoxAtas";
import NavBar from "../components/Fragments/NavBar";
import { getPengisianSubstrat } from "../services/getPengisianSubstrat";
import { kirimSubstrat } from "../services/substrat.api";
import RefreshControl from "../components/Fragments/RefreshControl";
import NetInfo from "@react-native-community/netinfo";
import {
  getOfflineSubstrat,
  clearOfflineSubstrat,
} from "../services/offlineSubstrate";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const SubstrateScreen = () => {
  /* =========================
     STATE MANAGEMENT
  ========================= */
  const [refreshing, setRefreshing] = useState(false);
  const [waktuPengisian, setWaktuPengisian] = useState("");
  const [substrates, setSubstrates] = useState([
    { jenis: "", ukuran: "", satuan: "L" },
  ]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSyncing = useRef(false);

  /* =========================
     SET WAKTU OTOMATIS
  ========================= */
  useEffect(() => {
    const now = new Date();
    const formatted =
      now.toLocaleDateString("id-ID") +
      " " +
      now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

    setWaktuPengisian(formatted);
  }, []);

  /* =========================
     LOAD DATA PERTAMA KALI
  ========================= */
  useEffect(() => {
    fetchSubstrateData();
  }, []);

  /* =========================
     FETCH DATA DARI FIRESTORE
  ========================= */
  const fetchSubstrateData = async () => {
    setLoading(true);
    try {
      const data = await getPengisianSubstrat();
      if (data) {
        setHistoryData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Gagal memuat data riwayat");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     HANDLE REFRESH (PULL TO REFRESH)
  ========================= */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubstrateData();

    // Update waktu juga saat refresh
    const now = new Date();
    const formatted =
      now.toLocaleDateString("id-ID") +
      " " +
      now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    setWaktuPengisian(formatted);

    setRefreshing(false);
  };

  /* =========================
     HANDLER SUBSTRAT
  ========================= */
  const addSubstrate = () => {
    setSubstrates([...substrates, { jenis: "", ukuran: "", satuan: "L" }]);
  };

  const removeSubstrate = (index) => {
    const newData = substrates.filter((_, i) => i !== index);
    setSubstrates(newData);
  };

  const updateSubstrate = (index, key, value) => {
    const newData = [...substrates];
    newData[index][key] = value;
    setSubstrates(newData);
  };

  const handleSubmit = async () => {
    const isValid = substrates.every(
      (item) => item.jenis.trim() !== "" && item.ukuran.trim() !== "",
    );

    if (!isValid) {
      Alert.alert("Peringatan", "Mohon isi semua field substrat");
      return;
    }

    try {
      const result = await kirimSubstrat(substrates);

      if (result?.offline) {
        Alert.alert("Tersimpan", "📦 Data disimpan offline");
      } else {
        Alert.alert("Berhasil", "✅ Substrat berhasil dikirim");
        fetchSubstrateData();
      }

      setSubstrates([{ jenis: "", ukuran: "", satuan: "L" }]);
    } catch (err) {
      Alert.alert("Gagal", "❌ Gagal mengirim substrat");
    }
  }; /* =========================
     RENDER UI
  ========================= */
  return (
    <View style={styles.container}>
      <BoxAtas />

      <RefreshControl
        onRefresh={handleRefresh}
        refreshing={refreshing}
        style={styles.scrollView}
      >
        {/* FORM */}
        <View style={styles.formCard}>
          {/* WAKTU */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Waktu Pengisian</Text>
            <TextInput
              style={styles.input}
              value={waktuPengisian}
              editable={false}
            />
          </View>

          {/* SUBSTRAT DINAMIS */}
          {substrates.map((item, index) => (
            <View key={index} style={styles.subCard}>
              <Text style={styles.subTitle}>Substrat {index + 1}</Text>

              <TextInput
                style={styles.input}
                placeholder="Jenis substrat (contoh: Kotoran sapi)"
                value={item.jenis}
                onChangeText={(text) => updateSubstrate(index, "jenis", text)}
              />

              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.flex]}
                  placeholder="Ukuran"
                  keyboardType="numeric"
                  value={item.ukuran}
                  onChangeText={(text) =>
                    updateSubstrate(index, "ukuran", text)
                  }
                />

                <View style={styles.satuanBox}>
                  <Text>{item.satuan}</Text>
                </View>
              </View>

              {substrates.length > 1 && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeSubstrate(index)}
                >
                  <Text style={styles.deleteText}>Hapus Substrat</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* TAMBAH */}
          <TouchableOpacity style={styles.addButton} onPress={addSubstrate}>
            <Text style={styles.addButtonText}>+ Tambah Substrat</Text>
          </TouchableOpacity>

          {/* SUBMIT */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Kirim</Text>
          </TouchableOpacity>
        </View>

        {/* RIWAYAT */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Riwayat Pengisian Substrat</Text>

          {loading ? (
            <Text style={styles.infoText}>Memuat data...</Text>
          ) : historyData.length === 0 ? (
            <Text style={styles.infoText}>Belum ada riwayat</Text>
          ) : (
            historyData.map((history, index) => (
              <View key={index} style={styles.historyCard}>
                <Text style={styles.historyDate}>{history.date}</Text>
                {history.items.map((item, i) => (
                  <Text key={i} style={styles.historyItem}>
                    {item}
                  </Text>
                ))}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 120 }} />
      </RefreshControl>

      <NavBar />
    </View>
  );
};

export default SubstrateScreen;

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },

  /* =========================
     FORM
  ========================= */
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  flex: {
    flex: 1,
  },
  satuanBox: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minWidth: 70,
    alignItems: "center",
  },

  /* =========================
     SUBSTRAT CARD
  ========================= */
  subCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 10,
    color: "#3D5A3D",
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
  deleteText: {
    color: "#D14343",
    fontSize: 13,
    fontWeight: "600",
  },

  /* =========================
     BUTTONS
  ========================= */
  addButton: {
    borderColor: "#3D5A3D",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "flex-end",
    marginBottom: 5,
  },
  addButtonText: {
    color: "#3D5A3D",
    fontSize: 12,
    fontWeight: "700",
  },
  submitButton: {
    backgroundColor: "#3D5A3D",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  /* =========================
     RIWAYAT
  ========================= */
  historySection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    color: "#333",
  },
  historyCard: {
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
    color: "#3D5A3D",
  },
  historyItem: {
    fontSize: 13,
    color: "#555",
  },
  infoText: {
    textAlign: "center",
    color: "#777",
    fontSize: 13,
  },
});
