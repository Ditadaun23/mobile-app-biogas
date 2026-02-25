import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { getJarakData } from "../../services/getJarakDataBulanan";
import DateTimePicker from "@react-native-community/datetimepicker";

const GrafikTekanan = () => {
  const [orientation, setOrientation] = useState("PORTRAIT");
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width,
  );

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [data, setData] = useState([]);

  /* ================= ORIENTATION ================= */
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
      setOrientation(window.width > window.height ? "LANDSCAPE" : "PORTRAIT");
    });

    return () => subscription.remove();
  }, []);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function loadData() {
      const res = await getJarakData();
      setData(Array.isArray(res) ? res : []);
    }
    loadData();
  }, []);

  /* ================= SAFE DATA ================= */
  const safeData = Array.isArray(data) ? data : [];

  /* ================= FILTER DATA ================= */
  const filteredData = safeData.filter((item) => {
    const itemDate = new Date(item.waktuTS);
    return itemDate >= startDate && itemDate <= endDate;
  });

  /* ================= CHART DATA ================= */
  const chartData = filteredData.map((d) => ({
    value: d.value,
  }));

  const spacing = 70;
  const initialSpacing = 30;
  const chartWidth = filteredData.length * spacing + initialSpacing + spacing;

  const maxY = Math.max(...filteredData.map((d) => d.value), 10);
  const ySteps = 5;

  const yLabels = Array.from({ length: ySteps + 1 }).map((_, i) =>
    Math.round((maxY / ySteps) * (ySteps - i)),
  );

  /* ================= PORTRAIT ================= */
  if (orientation === "PORTRAIT") {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.rotateText}>
          Rotate ke landscape untuk melihat grafik
        </Text>
      </View>
    );
  }

  /* ================= LANDSCAPE ================= */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grafik Produksi Gas</Text>

      {/* FILTER BAR */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowStartPicker(true)}
        >
          <Text>{startDate.toLocaleDateString("id-ID")}</Text>
        </TouchableOpacity>

        <Text>s/d</Text>

        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowEndPicker(true)}
        >
          <Text>{endDate.toLocaleDateString("id-ID")}</Text>
        </TouchableOpacity>
      </View>

      {/* DATE PICKERS */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}

      <View style={{ flexDirection: "row" }}>
        {/* Y AXIS */}
        <View style={styles.yAxis}>
          {yLabels.map((v, i) => (
            <Text key={i} style={styles.yLabel}>
              {v}
            </Text>
          ))}
        </View>

        {/* CHART */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <LineChart
              data={chartData}
              width={chartWidth}
              height={250}
              thickness={2}
              spacing={spacing}
              initialSpacing={initialSpacing}
              hideYAxis
              hideRules
            />

            {/* X AXIS */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 8,
                marginLeft: initialSpacing,
              }}
            >
              {filteredData.map((d, i) => {
                const date = new Date(d.waktuTS);
                return (
                  <Text
                    key={i}
                    style={{
                      width: spacing,
                      fontSize: 10,
                      textAlign: "center",
                    }}
                  >
                    {date.toLocaleDateString("id-ID")}
                  </Text>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default GrafikTekanan;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rotateText: {
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  dateBox: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  yAxis: {
    height: 250,
    justifyContent: "space-between",
    paddingRight: 8,
  },
  yLabel: {
    fontSize: 10,
  },
});
