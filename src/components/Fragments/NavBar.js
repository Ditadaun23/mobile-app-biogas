// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   Image,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Home from "../../../assets/Home.png";
// import Produksi from "../../../assets/Produksi.png";
// import Mixer from "../../../assets/Mixer.png";
// import Notifikasi from "../../../assets/Notifikasi.png";
// import Profil from "../../../assets/Profil.png";

// const NavBar = () => {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.bottomNav}>
//       <TouchableOpacity
//         style={styles.navItem}
//         onPress={() => navigation.navigate("Dashboard")}
//       >
//         <View style={styles.navIconContainerActive}>
//           <Image source={Home} style={styles.navIconImage} />
//         </View>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.navItem}
//         onPress={() => navigation.navigate("Substrate")}
//       >
//         <Image
//           source={Produksi}
//           style={styles.navIconImage}
//           resizeMode="contain"
//         />
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.navItem}
//         onPress={() => navigation.navigate("Control")}
//       >
//         <Image
//           source={Mixer}
//           style={styles.navIconImage}
//           resizeMode="contain"
//         />
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.navItem}
//         onPress={() => navigation.navigate("Notifikasi")}
//       >
//         <Image
//           source={Notifikasi}
//           style={styles.navIconImage}
//           resizeMode="contain"
//         />
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.navItem}
//         onPress={() => navigation.navigate("Profil")}
//       >
//         <Image
//           source={Profil}
//           style={styles.navIconImage}
//           resizeMode="contain"
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

// export const styles = StyleSheet.create({
//   bottomNav: {
//     flexDirection: "row",
//     backgroundColor: "#ffffff",
//     paddingVertical: 1,
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
//     elevation: 1,
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 20,
//   },
//   navItem: {
//     padding: 8,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   navIconContainerActive: {
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
//   navIconImage: {
//     opacity: 0.5,
//   },
// });

// export default NavBar;

import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import Home from "../../../assets/Home.png";
import Produksi from "../../../assets/Produksi.png";
import Mixer from "../../../assets/Mixer.png";
import Notifikasi from "../../../assets/Notifikasi.png";
import Profil from "../../../assets/Profil.png";

const NavBar = () => {
  const navigation = useNavigation();
  const route = useRoute(); // halaman aktif

  const isActive = (screenName) => route.name === screenName;

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Image
          source={Home}
          resizeMode="contain"
          style={[
            styles.navIconImage,
            isActive("Dashboard") && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Substrate")}
      >
        <Image
          source={Produksi}
          resizeMode="contain"
          style={[
            styles.navIconImage,
            isActive("Substrate") && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Control")}
      >
        <Image
          source={Mixer}
          resizeMode="contain"
          style={[
            styles.navIconImage,
            isActive("Control") && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Notifikasi")}
      >
        <Image
          source={Notifikasi}
          resizeMode="contain"
          style={[
            styles.navIconImage,
            isActive("Notifikasi") && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Profil")}
      >
        <Image
          source={Profil}
          resizeMode="contain"
          style={[styles.navIconImage, isActive("Profil") && styles.activeIcon]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 6,
    paddingHorizontal: 30,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 30,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
  },

  navItem: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  navIconImage: {
    width: 26,
    height: 26,
    opacity: 0.4, // default pudar
  },

  activeIcon: {
    opacity: 1, // icon aktif 100%
  },
});
