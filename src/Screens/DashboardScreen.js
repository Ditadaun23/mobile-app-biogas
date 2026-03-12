import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import BoxAtas from "../components/Fragments/BoxAtas";
import NavBar from "../components/Fragments/NavBar";
import HorizontalBar from "../components/Elements/Bar_Tekanan_pH";
import BarCairan from "../components/Elements/Bar_Cairan";
import BarGas from "../components/Elements/Bar_Gas";
import StatusSuhu from "../components/Elements/Status_Suhu";
import GrafikProduksi from "../components/Elements/Grafik_Produksi";
import { getSensorData } from "../services/sensor";
import { useAuth } from "../services/AuthContext";
import RefreshControl from "../components/Fragments/RefreshControl";

const { width } = Dimensions.get("window");

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [sensor, setSensor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      getSensorData().then(setSensor);
    }, 3000); // cek data setiap 1 detik

    return () => clearInterval(interval);
  }, []);

  // // sensor tekanan
  let tekananStatus,
    tekananCol = "#ff0000";
  const tekanan = sensor?.pressure_IDE?.sensor_data?.biogas_pressure_kpa;

  if (tekanan < 0.5) {
    tekananStatus = "Tekanan rendah";
  } else if (tekanan >= 0.5 && tekanan < 10) {
    tekananStatus = "Tekanan Normal";
    tekananCol = "#3ace00";
  } else {
    tekananStatus = "Tekanan Tinggi";
  }

  // sensor ph
  let phStatus,
    phStatus2,
    phCol,
    phCol2,
    colpH = "#ff0000",
    colpH2 = "#ff0000";
  let ph = sensor?.ph_sensor_IDE?.sensor_data?.value?.toFixed(1) ?? "-";
  let ph2 = sensor?.ph_sensor_IDE_2?.sensor_data?.value?.toFixed(1) ?? "-";
  // let phStatus;
  // let phCol = "#ff0000";
  // const ph = sensor?.ph_sensor_IDE?.value;

  // const ph = 2;

  if (ph > 6.5 && ph < 8.5) {
    phStatus = "Netral";
    phCol = "#3ACE00";
    colpH = "#3ACE00";
  } else if (ph <= 6.5) {
    phStatus = "Asam";
    phCol = "#ff0000";
  } else {
    phStatus = "Basa";
    phCol = "#ff0000";
  }

  if (ph2 > 6.5 && ph2 < 8.5) {
    phStatus2 = "Netral";
    phCol2 = "#3ACE00";
    colpH2 = "#3ACE00";
  } else if (ph2 <= 6.5) {
    phStatus2 = "Asam";
    phCol2 = "#ff0000";
  } else {
    phStatus2 = "Basa";
    phCol2 = "#ff0000";
  }

  // produksi gas
  let produksiStatus,
    produksiColor = "#2b80ff",
    produksiKeadaan;
  const jarak = 36.5 - sensor?.ultrasonic_IDE?.sensor_data?.distance_cm;
  const radius = 12 + ((11.5 - 12) / 16.5) * jarak;
  const vol = (1 / 3) * Math.PI * jarak * (12 ** 2 + 12 * radius + radius ** 2);
  const Volume = Number((vol / 1000).toFixed(1));
  if (sensor?.ultrasonic_IDE?.sensor_data?.distance_cm < 5.7) {
    produksiKeadaan = "Sedikit Gas";
  } else if (
    sensor?.ultrasonic_IDE?.sensor_data?.distance_cm >= 5.7 &&
    sensor?.ultrasonic_IDE?.sensor_data?.distance_cm < 11.4
  ) {
    produksiColor = "#3ace00";
    produksiKeadaan = "Ada Gas";
  } else {
    produksiKeadaan = "Banyak Gas";
  }

  //sensor gas metana
  let kadarStatus,
    kadarCol = "#ff0000";
  const kadar = sensor?.methane_IDE?.sensor_data?.methane_percent;

  if (kadar > 50) {
    kadarStatus = "Optimal";
    kadarCol = "#3ace00";
  } else {
    kadarStatus = "Tidak Optimal";
  }

  const MAX_GAS = 14;
  const BAR_WIDTH = 300; // sesuaikan dengan width HorizontalBar

  const gasValue = sensor?.methane_IDE?.biogas_percent ?? 0;

  // pastikan tidak lebih dari max
  const gasClamped = Math.min(gasValue, MAX_GAS);

  // hitung posisi indikator
  const indicatorPosition = (gasClamped / MAX_GAS) * BAR_WIDTH;

  // sensor suhu
  let eks =
    sensor?.temp_external_IDE?.sensor_data?.temperature_c?.toFixed(0) ?? "-";
  let up = sensor?.temp_internal_IDE?.sensor_data?.up_c?.toFixed(0) ?? "-";
  let down = sensor?.temp_internal_IDE?.sensor_data?.down_c?.toFixed(0) ?? "-";

  let suhuStatus, suhuColor;
  if (down >= 25 && down <= 40 && up >= 25 && up <= 40) {
    suhuStatus = "Normal";
    suhuColor = "#2b80ff";
  } else {
    suhuStatus = "Tidak Optimal";
    suhuColor = "#ff0000";
  }
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <BoxAtas></BoxAtas>

      <RefreshControl
        onRefresh={handleRefresh}
        refreshing={refreshing}
        style={styles.scrollView}
      >
        <View style={styles.card}>
          <GrafikProduksi />
        </View>
        {/* Tekanan Gas */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tekanan Gas</Text>
          <HorizontalBar
            value={sensor?.pressure_IDE?.sensor_data?.biogas_pressure_kpa}
            max={12}
            satuan="kPa"
            col1={tekananCol}
            col2={tekananCol}
            col3={tekananCol}
          />
          <Text style={[styles.pressureValue, { color: tekananCol }]}>
            {tekanan} kPa ({tekananStatus})
          </Text>
        </View>

        {/* Tingkat Keasaman (pH) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tingkat Keasaman (pH)</Text>
          <HorizontalBar
            value={sensor?.ph_sensor_IDE_2?.sensor_data?.value}
            max={14}
            col1={phCol2}
            col2={phCol2}
            col3={phCol2}
          />
          <Text style={[styles.statusNormal, { marginBottom: 15 }]}>
            Top : {ph2}{" "}
            <Text style={{ color: phCol2, fontWeight: "bold" }}>
              {phStatus2}
            </Text>
          </Text>
          <HorizontalBar
            value={sensor?.ph_sensor_IDE?.sensor_data?.value}
            max={14}
            col1={phCol}
            col2={phCol}
            col3={phCol}
          />
          <Text style={[styles.statusNormal, { marginBottom: 15 }]}>
            Bottom : {ph}{" "}
            <Text style={{ color: phCol, fontWeight: "bold" }}>{phStatus}</Text>
          </Text>
        </View>
        {/* </View> */}

        {/* Cairan Substrat */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Produksi Gas</Text>
          <BarCairan
            value={36.5 - sensor?.ultrasonic_IDE?.sensor_data?.distance_cm}
            max={19}
          />
          <Text style={[styles.statusWarning, { color: produksiColor }]}>
            {produksiKeadaan} ({Volume} L)
          </Text>
        </View>

        {/* Gas Metana */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Kadar Gas</Text>
          <BarGas
            terdeteksi={false}
            ch4={sensor?.methane_IDE?.sensor_data?.methane_percent}
            co2={sensor?.carbondioxide_IDE?.sensor_data?.carbon_percent}
          />
          <Text style={[styles.pressureValue, { color: kadarCol }]}>
            {kadarStatus}
          </Text>
        </View>

        {/* Suhu dan Kelembapan */}
        <View style={[styles.card]}>
          <Text style={styles.cardTitle}>Suhu Lingkungan & Reaktor (RE)</Text>
          <StatusSuhu eks={eks} up={up} down={down} />
          <Text style={[styles.pressureValue, { color: suhuColor }]}>
            {suhuStatus}
          </Text>
        </View>
        <View style={{ height: 120 }} />
      </RefreshControl>

      {/* Bottom Navigation */}
      <NavBar />
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  pressureBar: {
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  pressureGradient: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#FFD700",
  },
  pressureIndicator: {
    position: "absolute",
    left: "18%",
    width: 3,
    height: "100%",
    backgroundColor: "#FF0000",
  },
  pressureLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pressureLabel: {
    fontSize: 11,
    color: "#666",
  },
  pressureValue: {
    fontSize: 13,
    fontWeight: "bold",
    // color: tekananCol,
    textAlign: "center",
  },
  phContainer: {
    marginBottom: 12,
  },
  phBar: {
    height: 12,
    backgroundColor: "#EF4444",
    borderRadius: 6,
    marginBottom: 8,
    position: "relative",
  },
  phIndicator: {
    position: "absolute",
    left: "35%",
    width: 3,
    height: "100%",
    backgroundColor: "#000",
  },
  phLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  phLabel: {
    fontSize: 11,
    color: "#666",
  },
  statusNormal: {
    fontSize: 13,
    fontWeight: "600",
    // color: phCol,
    textAlign: "center",
  },
  liquidContainer: {
    marginBottom: 12,
  },
  liquidBar: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
    position: "relative",
  },
  liquidFill: {
    position: "absolute",
    left: 0,
    width: "50%",
    height: "100%",
    backgroundColor: "#3B82F6",
  },
  liquidIndicator: {
    position: "absolute",
    left: "50%",
    width: 3,
    height: "100%",
    backgroundColor: "#1E40AF",
  },
  statusWarning: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  methaneBar: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 12,
  },
  methaneFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#4ADE80",
  },
  statusDetected: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4ADE80",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 100,
  },
  halfCard: {
    width: "100%",
  },
  humidityValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#3B82F6",
  },
  flowContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  gaugeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: "#EF4444",
    borderTopColor: "#E5E7EB",
    borderLeftColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-45deg" }],
  },
  gaugeValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    transform: [{ rotate: "45deg" }],
  },
  gaugeUnit: {
    fontSize: 11,
    color: "#666",
    transform: [{ rotate: "45deg" }],
    textAlign: "justify",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 1,
    paddingHorizontal: 30,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 30,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 1,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  navItem: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconContainerActive: {
    borderRadius: 20,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  navIconText: {
    fontSize: 26,
    color: "#9CA3AF",
  },
  navIconTextActive: {
    fontSize: 26,
    color: "#FFFFFF",
  },
  navIconImage: {
    opacity: 0.5,
  },
});

export default DashboardScreen;
