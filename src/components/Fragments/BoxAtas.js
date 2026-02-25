import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useAuth } from "../../services/AuthContext";
import { useNavigation } from "@react-navigation/native";

const BoxAtas = () => {
  const { user, loading, logout } = useAuth();

  if (loading || !user) {
    return null;
  }
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.appName}>SMARTBIOGAS</Text>
        <Text style={styles.greeting}>Halo, {user.name}!</Text>
        <Text style={styles.subGreeting}>
          Pantau produksi biogas harian anda
        </Text>
      </View>
      <TouchableOpacity
        style={styles.Logout}
        onPress={async () => {
          try {
            await logout();
          } catch (error) {
            console.log("Logout error:", error);
          }
        }}
      >
        <Text style={styles.sub}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: "#3D5A3D",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  appName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  Logout: {
    width: 55,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sub: {
    fontWeight: "bold",
    fontSize: 13,
    // marginBottom: 2,
    color: "#EF4444",
  },
});

export default BoxAtas;
