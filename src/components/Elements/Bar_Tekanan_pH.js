import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const HorizontalBar = ({ value, max, satuan = "", col1, col2, col3 }) => {
  const [barWidth, setBarWidth] = useState();
  const percentage = Math.min(value / max, 1); // 0-1
  // const percentage = Math.min(Math.max(value / max, 0), 1);

  const barHeight = 12;
  const markerExtra = 16;

  return (
    <View style={styles.container}>
      <View style={styles.bungkus}>
        <View
          style={styles.barContainer}
          onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        >
          {/* Background segments */}
          <View style={[styles.segment, { left: 0, backgroundColor: col1 }]} />
          <View
            style={[styles.segment, { left: "33.33%", backgroundColor: col2 }]}
          />
          <View
            style={[styles.segment, { left: "66.66%", backgroundColor: col3 }]}
          />
        </View>
        {/* Marker */}
        {barWidth > 0 && (
          <View
            style={[
              styles.marker,
              {
                left: barWidth * percentage,
                height: barHeight + markerExtra,
                top: -(markerExtra / 2), // sedikit offset biar di tengah
              },
            ]}
          />
        )}
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.label}>0 {satuan}</Text>
        <Text style={styles.label}>
          {max} {satuan}
        </Text>
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
  barContainer: {
    position: "relative",
    width: "100%",
    height: 12,
    borderRadius: 9999,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    overflow: "hidden",
  },
  segment: {
    position: "absolute",
    width: "33.33%",
    height: "100%",
  },
  marker: {
    position: "absolute",
    width: 6,
    backgroundColor: "black",
    borderRadius: 10,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    fontWeight: "300",
  },
});

export default HorizontalBar;
