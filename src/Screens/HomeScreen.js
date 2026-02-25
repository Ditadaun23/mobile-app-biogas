import React from "react";
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
import background from "../../assets/Rectangle 103.png";
import forward from "../../assets/Forward.png";

const { width, height } = Dimensions.get("window");
const HomeScreen = ({ navigation }) => {
  const handleNext = () => {
    navigation.navigate("Register");
  };

  return (
    <ImageBackground
      source={background}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Logo/Brand */}
          <Text style={styles.logo}>SMARTBIOGAS</Text>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <Text style={styles.title}>
              Pantau produksi,{"\n"}
              konsumsi, dan efisiensi{"\n"}
              biogas secara real-time{"\n"}
              melalui dashboard{"\n"}
              interaktif
            </Text>

            <Text style={styles.subtitle}>
              Masuk untuk mulai memantau{"\n"}
              biogas Anda tes
            </Text>

            {/* Next Button */}
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={1}
            >
              <Image
                source={forward}
                style={styles.nextButtonText}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    // height: height,
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  mainContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 100,
  },
  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 40,
    marginBottom: 50,
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
    opacity: 0.95,
    marginBottom: 40,
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  // nextButtonText: {
  //   width: 'auto',
  //   height: 'auto'
  // },
});

export default HomeScreen;
