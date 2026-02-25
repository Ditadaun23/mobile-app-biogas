// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Dimensions,
//   Image,
//   Platform,
// } from "react-native";
// import BoxAtas from "../components/Fragments/BoxAtas";
// import NavBar from "../components/Fragments/NavBar";
// import { useAuth } from "../services/AuthContext";
// import eye from "../../assets/eye.png";

// const ProfilScreen = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSaveChanges = () => {
//     console.log("Save changes:", { email, password, role });
//     // Logika simpan perubahan
//   };

//   const { user, loading } = useAuth();

//   if (loading || !user) {
//     return null;
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <BoxAtas />

//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Profile Card */}
//         <View style={styles.profileCard}>
//           {/* Profile Picture */}
//           <View style={styles.profileImageContainer}>
//             <View style={styles.profileImage}>
//               <Image
//                 source={user.photoURL}
//                 style={styles.profileImagePhoto}
//                 resizeMode="cover"
//               />
//             </View>
//           </View>

//           {/* Name */}
//           <Text style={styles.profileName}>{user.name}</Text>

//           {/* Email */}
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Email</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Masukkan email Anda"
//               placeholderTextColor="rgba(255, 255, 255, 0.2)"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               value={email}
//               onChangeText={setEmail}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Kata Sandi</Text>

//             <View style={styles.passwordContainer}>
//               <TextInput
//                 style={styles.passwordInput}
//                 placeholder="Masukkan kata sandi"
//                 placeholderTextColor="rgba(255,255,255,0.6)"
//                 secureTextEntry={!showPassword}
//                 value={password}
//                 onChangeText={setPassword}
//               />

//               <TouchableOpacity
//                 style={styles.eyeButton}
//                 onPress={() => setShowPassword((prev) => !prev)}
//                 activeOpacity={0.7}
//               >
//                 <Image source={eye} style={styles.eyeIcon} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <TouchableOpacity
//             style={styles.forgotContainer}
//             onPress={() => navigation.navigate("LupaPas")}
//           >
//             <Text style={styles.forgotText}>Lupa kata sandi?</Text>
//           </TouchableOpacity>

//           {/* Role */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Peran</Text>
//             {/* <TextInput
//               style={styles.input}
//               value={role}
//               onChangeText={setRole}
//               editable={false}
//             /> */}
//           </View>

//           {/* Save Button */}
//           <TouchableOpacity
//             style={styles.saveButton}
//             onPress={handleSaveChanges}
//           >
//             <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.bottomSpacing} />
//       </ScrollView>

//       {/* Bottom Navigation */}
//       <NavBar />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F7FA",
//   },
//   header: {
//     backgroundColor: "#3D5A3D",
//     paddingTop: Platform.OS === "ios" ? 60 : 40,
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//   },
//   appName: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     letterSpacing: 1.5,
//     marginBottom: 8,
//   },
//   greeting: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     marginBottom: 4,
//   },
//   subGreeting: {
//     fontSize: 13,
//     color: "#FFFFFF",
//     opacity: 0.9,
//   },
//   notificationButton: {
//     width: 40,
//     height: 40,
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   notificationIcon: {
//     fontSize: 20,
//   },
//   scrollView: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   profileCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 24,
//     marginTop: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//     alignItems: "center",
//   },
//   profileImageContainer: {
//     marginBottom: 16,
//   },
//   profileImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#E5E7EB",
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//     // objectFit: "fill",
//   },
//   profileImagePhoto: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 60,
//   },
//   profileImagePlaceholder: {
//     fontSize: 60,
//     color: "#9CA3AF",
//   },
//   profileName: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#1A1A1A",
//     marginBottom: 24,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     color: "#1A1A1A", // GANTI INI
//     marginBottom: 8,
//     fontWeight: "500",
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F3F4F6",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     color: "#1A1A1A",
//   },
//   passwordInput: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 16,
//     color: "#1A1A1A",
//   },
//   input: {
//     backgroundColor: "#F3F4F6",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     fontSize: 16,
//     color: "#1A1A1A",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     height: 52,
//   },
//   eyeButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//   },
//   eyeIcon: {
//     fontSize: 20,
//   },
//   forgotContainer: {
//     alignSelf: "flex-end",
//     marginTop: 8,
//     marginBottom: 24,
//   },
//   forgotText: {
//     fontSize: 13,
//     color: "#3D5A3D",
//   },
//   saveButton: {
//     backgroundColor: "#3D5A3D",
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: "center",
//     width: "100%",
//     marginTop: 8,
//     shadowColor: "#3D5A3D",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   saveButtonText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     letterSpacing: 0.5,
//   },
//   bottomSpacing: {
//     height: 100,
//   },
//   bottomNav: {
//     flexDirection: "row",
//     backgroundColor: "#FFFFFF",
//     paddingVertical: 16,
//     paddingHorizontal: 30,
//     marginHorizontal: 16,
//     marginBottom: 20,
//     borderRadius: 30,
//     justifyContent: "space-around",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   navItem: {
//     padding: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   navIconContainerActive: {
//     backgroundColor: "#4A5A3D",
//     borderRadius: 20,
//     width: 50,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   navIconText: {
//     fontSize: 26,
//     color: "#9CA3AF",
//   },
//   navIconTextActive: {
//     fontSize: 26,
//     color: "#FFFFFF",
//   },
// });

// export default ProfilScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useAuth } from "../services/AuthContext";
import eye from "../../assets/eye.png";

const ProfilScreen = () => {
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("********");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    }
  }, [user]);

  if (loading) return null;
  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.appName}>SMARTBIOGAS</Text>

        <Text style={styles.greeting}>
          Halo, <Text style={styles.bold}>{user.name}!</Text>
        </Text>
        <Text style={styles.subGreeting}>Lihat profil anda</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* FOTO */}
          <Image
            source={
              typeof user.photoURL === "string"
                ? { uri: user.photoURL }
                : user.photoURL
            }
            style={styles.avatar}
          />

          <Text style={styles.name}>{user.name}</Text>

          {/* EMAIL */}
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} editable={false} />

          {/* PASSWORD */}
          <View style={styles.passwordRow}>
            <Text style={styles.label}>Kata Sandi</Text>
            <Text style={styles.forgot}>Lupa sandi?</Text>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              secureTextEntry={!showPassword}
              editable={false}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image source={eye} style={styles.eyeIcon} />
            </TouchableOpacity>
          </View>

          {/* ROLE */}
          <Text style={styles.label}>Peran</Text>
          <TextInput style={styles.input} value={user.role} editable={false} />

          {/* BUTTON */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Simpan Perubahan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfilScreen;
