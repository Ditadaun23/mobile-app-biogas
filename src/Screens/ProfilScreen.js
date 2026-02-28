import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from "react-native";
import BoxAtas from "../components/Fragments/BoxAtas";
import NavBar from "../components/Fragments/NavBar";
import { useAuth } from "../services/AuthContext";
import eye from "../../assets/eye.png";

const ProfilScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { user, loading } = useAuth();

  const handleSaveChanges = () => {
    console.log("Save changes:", { email, password });
  };

  if (loading || !user) return null;

  return (
    <View style={styles.container}>
      <BoxAtas />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          {/* Foto Profil */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Image
                source={user.photoURL}
                style={styles.profileImagePhoto}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Nama */}
          <Text style={styles.profileName}>{user.name}</Text>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan email Anda"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              keyboardType="email-address"
              autoCapitalize="none"
              value={user.email}
              onChangeText={setEmail}
              readOnly
            />
          </View>

          {/* Kata Sandi */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Keamanan Akun</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Masukkan kata sandi"
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
                // secureTextEntry={!showPassword}
                value={
                  user.provider === "google.com" ? "Google" : "Email & Password"
                }
                onChangeText={setPassword}
                readOnly
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((prev) => !prev)}
                activeOpacity={0.7}
              >
                <Image source={eye} style={styles.eyeIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImagePhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#1A1A1A",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    height: 52,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1A1A1A",
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 13,
    color: "#3D5A3D",
  },
  saveButton: {
    backgroundColor: "#3D5A3D",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    marginTop: 8,
    shadowColor: "#3D5A3D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default ProfilScreen;
