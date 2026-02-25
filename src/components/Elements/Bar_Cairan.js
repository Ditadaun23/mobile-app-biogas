import React from "react";
import { View, StyleSheet } from "react-native";

const BarCairan = ({ value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.barWrapper}>
        {/* Bagian kiri biru */}
        <View style={[styles.leftBar, { width: percentage + "%" }]} />

        {/* Bagian kanan border */}
        <View style={[styles.rightBar, { width: 100 - percentage + "%" }]} />

        {/* Garis indikator */}
        <View style={[styles.indicator, { left: percentage + "%" }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  barWrapper: {
    width: "100%",
    height: 12,
    alignSelf: "center",
    borderRadius: 999,
    overflow: "visible",
    position: "relative",
    flexDirection: "row",
  },

  leftBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#93C5FD", // blue-300
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
  },

  rightBar: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: "#93C5FD",
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },

  indicator: {
    position: "absolute",
    top: -8,
    height: "100%",
    borderRightWidth: 7,
    borderRightColor: "#3B82F6", // blue-500
    height: 12 + 16,
    borderRadius: 4,
  },
});

export default BarCairan;
