import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BarGas = ({ terdeteksi, ch4, co2 }) => {
  // Format nilai dengan 2 desimal atau tampilkan "-" jika tidak ada
  const ch4Value = ch4?.toFixed(0) ?? "-";
  const co2Value = co2?.toFixed(0) ?? "-";

  return (
    <View style={styles.container}>
      <View style={styles.bungkus}>
        {/* CH4 Bar */}
        <View style={styles.barContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(ch4 || 0, 100)}%` },
              ]}
            />
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.percentageText}>{ch4Value} %</Text>
            <Text style={styles.chemicalFormula}>
              CH<Text style={styles.subscript}>4</Text>
            </Text>
          </View>
        </View>

        {/* CO2 Bar */}
        <View style={styles.barContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(co2 || 0, 100)}%` },
              ]}
            />
          </View>
          <View style={styles.labelRow}>
            <Text style={styles.percentageText}>{co2Value} %</Text>
            <Text style={styles.chemicalFormula}>
              CO<Text style={styles.subscript}>2</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    gap: 8,
  },
  bungkus: {
    borderRadius: 9999,
    overflow: "visible",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  // barContainer: {
  //   position: "relative",
  //   width: "100%",
  //   height: 12,
  //   borderRadius: 9999,
  //   backgroundColor: "#E5E7EB",
  //   alignSelf: "center",
  //   overflow: "hidden",
  // },
  // progressBarContainer: {
  //   width: "100%",
  //   alignItems: "center",
  //   marginBottom: 1,
  // },
  progressBar: {
    width: "100%",
    height: 12,
    backgroundColor: "#FECACA",
    borderRadius: 9999,
    alignSelf: "center",
    overflow: "hidden",
    marginBottom: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4ADE80",
    borderRadius: 10,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
  },
  percentageText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E40AF",
    marginRight: 8,
  },
  chemicalFormula: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  subscript: {
    fontSize: 18,
    fontWeight: "700",
  },
  statusContainer: {
    marginTop: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "#1A1A1A",
  },
  statusIndicator: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  terdeteksi: {
    color: "#EF4444",
  },
  tidakTerdeteksi: {
    color: "#4ADE80",
  },
  sensorStatus: {
    fontSize: 14,
    fontWeight: "400",
    color: "#1A1A1A",
  },
});

export default BarGas;
