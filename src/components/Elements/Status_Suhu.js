import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

import awan from "../../../assets/awan.png";
import temperatur from "../../../assets/tempratur.png";

const StatusSuhu = ({ eks, up, down }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.row}>
          <View style={styles.suhuItem}>
            <Text style={styles.tempLabel}> Lingkungan</Text>
            <Text style={styles.tempValue}>
              {eks}°C
              <Image source={awan} style={styles.awan} />
            </Text>
          </View>

          {/* Divider Line */}
          <View style={styles.divider} />

          <View style={styles.suhuItem}>
            <Text style={styles.tempLabel}>Atas RE</Text>
            <Text style={styles.tempValue}>
              {up}°C
              <Image source={temperatur} style={styles.temperatur} />
            </Text>
          </View>

          <View style={styles.suhuItem}>
            <Text style={styles.tempLabel}> Bawah RE</Text>
            <Text style={styles.tempValue}>
              {down}°C
              <Image source={temperatur} style={styles.temperatur} />
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 8,
  },
  leftSection: {
    flex: 1,
    justifyContent: "space-between",
    height: 125,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 85,
    // width: "100%",
  },
  suhuItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  tempIcon: {
    fontSize: 18,
    marginRight: 2,
  },
  tempIconYellow: {
    fontSize: 18,
    marginRight: 2,
    opacity: 0.7,
  },
  tempContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 12,
  },
  tempValue: {
    fontSize: 18,
    fontWeight: "350",
    // alignItems: "center",
    // marginLeft: 8,
    marginRight: 7.5,
    letterSpacing: 1,
  },
  tempLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginRight: 9,
  },
  divider: {
    width: 2,
    height: 120,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 25,
  },
  awan: {
    width: 26,
    height: 27,
  },
  temperatur: {
    height: 27,
    // padding: 2,
  },
});

export default StatusSuhu;
