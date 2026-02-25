import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LineChart } from "react-native-gifted-charts";
import Luas from "../../../assets/luas.png";
import { getJarakData } from "../../services/semoga_jadi";

const { width } = Dimensions.get("window");

const TekananGasChart = () => {
  const navigation = useNavigation();

  const handleGrafik = () => {
    navigation.navigate("Grafik2");
  };
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await getFirestoreData(5);
      setData(res);
    }
    load();
  }, []);

  useEffect(() => {
    getJarakData().then(setData);
  }, []);

  return (
    <View>
      {/* Judul */}
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 20 }}>
        Produksi Gas
      </Text>

      <TouchableOpacity
        style={{
          position: "absolute",
          right: 10,
          top: 0,
          zIndex: 999,
          elevation: 10,
        }}
        onPress={handleGrafik}
        activeOpacity={1}
      >
        <Image source={Luas} resizeMode="cover" />
      </TouchableOpacity>

      <View
        style={{
          width: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 10,
            top: 0,
          }}
        >
          Volume Gas (L)
        </Text>
      </View>

      {/* Chart */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
        }}
      >
        <LineChart
          data={data}
          width={width * 0.67}
          height={200}
          color="#000000"
          thickness={2}
          hideRules={true}
          hideYAxisText={false}
          xAxisLabelTexts={[]}
          hideDataPoints={false}
          dataPointsColor="#000000"
          xAxisColor="#000000"
          yAxisColor="#000000"
          yAxisTextStyle={{ color: "#000", fontSize: 10 }}
          xAxisLabelTextStyle={{ color: "#ffffffff", fontSize: 10 }}
          yAxisInterval={1} // ⬅ interval 1,2,3,4
          noOfSections={4} // ⬅ jumlah grid (sesuaikan)
          maxValue={8} // ⬅ nilai maksimum sumbu Y
          minValue={0}
          spacing={55}
          // areaChart
          startFillColor="#ffffff"
          endFillColor="#ffffff"
          startOpacity={0.3}
          endOpacity={0.3}
          backgroundGradientFromOpacity={0}
          backgroundGradientToOpacity={0}
          // hideYAxisText
        />

        <View
          style={{
            position: "absolute",
            bottom: -7, // atur tinggi label
            left: 45, // offset pertama label
            flexDirection: "row",
            // justifyContent: "space-between",
            gap: "27",
            width: width * 0.8, // sama dengan lebar chart
          }}
        >
          {data.map((d, i) => {
            const [date, time] = d.label.split("\n");
            return (
              <View key={i} style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 9, color: "#000" }}>{date}</Text>
                <Text style={{ fontSize: 9, color: "#000" }}>{time}</Text>
              </View>
            );
          })}
        </View>

        {/* Background area seperti reference area */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 35,
            right: 0,
            bottom: 24,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#abff0f", // hijau muda
              opacity: 0.1,
            }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: "#ff0000", // merah muda
              opacity: 0.1,
            }}
          />
          <View
            style={{
              flex: 1,
              backgroundColor: "#ffb624", // oranye muda
              opacity: 0.1,
            }}
          />
        </View>
      </View>

      {/* Keterangan bawah */}
      <Text
        style={{
          marginTop: 16,
          fontSize: 14,
          fontWeight: "500",
          alignSelf: "center",
        }}
      >
        Volume gas saat ini:{" "}
        <Text style={{ fontWeight: "500" }}>
          {data.length ? data[data.length - 1].value : "-"} L
        </Text>
      </Text>
    </View>
  );
};

export default TekananGasChart;
