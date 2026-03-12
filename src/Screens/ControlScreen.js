import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { ref, onValue, update } from "firebase/database";
import { realtimedb } from "../services/firebase";

import BoxAtas from "../components/Fragments/BoxAtas";
import NavBar from "../components/Fragments/NavBar";
import RefreshControl from "../components/Fragments/RefreshControl";

/* =============================
   KONFIGURASI
============================= */
const MAX_TIME = 1 * 60; // 1 menit (detik)

const ControlScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const motorRef = ref(realtimedb, "motor");

  const [status, setStatus] = useState("OFF");
  const [control, setControl] = useState("AUTO");
  const [time, setTime] = useState(MAX_TIME);

  const startTimeRef = useRef(null);

  /* =============================
     FETCH MOTOR DATA
  ============================= */
  const fetchMotorData = async () => {
    try {
      // Ambil data langsung dari Firebase Realtime Database
      const snapshot = await new Promise((resolve) => {
        onValue(motorRef, resolve, { onlyOnce: true });
      });

      const data = snapshot.val();
      if (data) {
        setStatus(data.status);
        setControl(data.control);
        if (data.startTime) {
          startTimeRef.current = data.startTime;
        }
      }
    } catch (error) {
      console.error("Error fetching motor data:", error);
    }
  };

  /* =============================
     LISTENER REALTIME
  ============================= */
  useEffect(() => {
    const unsubscribe = onValue(motorRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      setStatus(data.status);
      setControl(data.control);

      if (data.status === "ON" && typeof data.remaining === "number") {
        setTime(data.remaining);
      } else {
        setTime(MAX_TIME);
      }
    });

    return () => unsubscribe();
  }, []);

  /* =============================
     TIMER (TIMESTAMP BASED)
  ============================= */
  // useEffect(() => {
  //   let interval;

  //   if (status === "ON") {
  //     interval = setInterval(() => {
  //       const now = Date.now();
  //       const elapsed = Math.floor((now - (startTimeRef.current || 0)) / 1000);
  //       const remaining = MAX_TIME - elapsed;

  //       if (remaining <= 0) {
  //         update(motorRef, {
  //           status: "OFF",
  //           control: "AUTO",
  //           startTime: null,
  //           remaining: MAX_TIME,
  //         });

  //         clearInterval(interval);
  //         setTime(MAX_TIME);
  //       } else {
  //         setTime(remaining);

  //         // 🔥 update remaining ke database
  //         update(motorRef, {
  //           remaining: remaining,
  //         });
  //       }
  //     }, 1000);
  //   } else {
  //     setTime(MAX_TIME);
  //   }

  //   return () => clearInterval(interval);
  // }, [status]);

  /* =============================
     HANDLE REFRESH
  ============================= */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMotorData();
    setRefreshing(false);
  };

  /* =============================
     MANUAL START
  ============================= */
  const handleManualStart = async () => {
    const startTime = Date.now();
    await update(motorRef, {
      control: "MANUAL_ON",
    });
  };
  /* =============================
     FORMAT MM:SS
  ============================= */
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <View style={styles.container}>
      <BoxAtas />

      <RefreshControl
        onRefresh={handleRefresh}
        refreshing={refreshing}
        style={styles.scrollView}
      >
        {/* CARD CONTROL */}
        <View style={styles.card}>
          <Text style={styles.title}>Kontrol Pengaduk</Text>

          {/* SWITCH */}
          <View style={styles.switchBox}>
            <View
              style={[
                styles.switchBtn,
                status === "OFF" && styles.switchActive,
              ]}
            >
              <Text
                style={[
                  styles.switchText,
                  status === "OFF" && styles.switchTextActive,
                ]}
              >
                Mati
              </Text>
            </View>

            <TouchableOpacity
              disabled={status === "ON"}
              onPress={handleManualStart}
              style={[styles.switchBtn, status === "ON" && styles.switchActive]}
            >
              <Text
                style={[
                  styles.switchText,
                  status === "ON" && styles.switchTextActive,
                ]}
              >
                Aktif
              </Text>
            </TouchableOpacity>
          </View>

          {/* TIMER */}
          <View style={styles.timer}>
            <Text style={styles.timerText}>
              {minutes}:{seconds}
            </Text>
          </View>

          {/* NOTE */}
          <Text style={styles.note}>
            Pengaduk biogas berjalan maksimal 1 menit. Sistem otomatis OFF
            setelah waktu habis.
          </Text>
        </View>

        {/* SPACING BAWAH */}
        <View style={{ height: 120 }} />
      </RefreshControl>

      <NavBar />
    </View>
  );
};

export default ControlScreen;

/* =============================
   STYLE
============================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F2",
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  switchBox: {
    flexDirection: "row",
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  switchActive: {
    backgroundColor: "#6B7280",
  },
  switchText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  switchTextActive: {
    color: "#FFF",
  },
  timer: {
    backgroundColor: "#D8DCCF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  timerText: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 2,
  },
  note: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
});
