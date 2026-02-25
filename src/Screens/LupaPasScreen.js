import React, { useState } from "react";
import { useAuth } from "../services/AuthContext";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import background from "../../assets/Rectangle 103.png";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { resetPassword } = useAuth();

  const handleLupaPas = async () => {
    try {
      await resetPassword(email);
      alert("Link reset password sudah dikirim ke email kamu");
      navigation.navigate("Login");
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <ImageBackground
      source={background}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.logo}>SMARTBIOGAS</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Lupa kata sandi? Silahkan isi email yang terdaftar
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan Email Anda"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLupaPas}
            >
              <Text style={styles.loginButtonText}>Kirim</Text>
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
    // justifyContent: 'center',
    // alignItems:
  },
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(75, 111, 126, 0.4)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    justifyContent: "center",
    // paddingBottom: 40,
  },
  logo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1.5,
    position: "absolute",
    left: 20,
    top: 53,
  },
  card: {
    backgroundColor: "rgba(60, 75, 78, 0.5)",
    borderRadius: 24,
    padding: 29,
    marginBottom: 76,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 28,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  loginButton: {
    backgroundColor: "rgba(147, 147, 139, 0.6)",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
});

export default LoginScreen;
