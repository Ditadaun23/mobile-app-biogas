import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { useAuth } from "../services/AuthContext";
import background from "../../assets/Rectangle 103.png";
import eye from "../../assets/eye.png";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function RegisterScreen({ navigation }) {
  // const navigation = useNavigation();
  const { register, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Semua field wajib diisi");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak sama");
      return;
    }

    try {
      await register(email, password);

      await logout();

      Alert.alert(
        "Berhasil",
        "Akun berhasil dibuat. Silakan cek email untuk verifikasi.",
        [
          {
            onPress: () => navigation.navigate("Login"),
          },
        ],
      );
    } catch (err) {
      setError(err.message || "Gagal mendaftar");
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
              Siap mengelola energi{"\n"}cerdas? Daftar sekarang!{" "}
            </Text>

            {error && <Text>{error}</Text>}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Masukkan Email Anda"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Kata Sandi</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Masukkan Kata Sandi Anda"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Image source={eye} style={styles.eyeIcon} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Konfirmasi Kata Sandi"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Image source={eye} style={styles.eyeIcon} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.9}
            >
              <Text style={styles.registerButtonText}>Daftar</Text>
            </TouchableOpacity>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Sudah memiliki akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Masuk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    // height: height,
  },
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(75, 111, 126, 0.4)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  logo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  card: {
    backgroundColor: "rgba(60, 75, 78, 0.5)",
    borderRadius: 24,
    padding: 24,
    marginBottom: 100,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  eyeIcon: {
    fontSize: 20,
  },
  registerButton: {
    backgroundColor: "rgba(147, 147, 139, 0.5)",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 13,
    color: "#FFFFFF",
  },
  loginLink: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
