import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../services/AuthContext";

// Auth Screens
import LoginScreen from "../Screens/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen";
import RegisterScreen2 from "../Screens/RegisterScreen2";
import LupaPasScreen from "../Screens/LupaPasScreen";
import LupaPasScreen2 from "../Screens/LupaPasScreen2";

// App Screens
import HomeScreen from "../Screens/HomeScreen";
import DashboardScreen from "../Screens/DashboardScreen";
import SubstrateScreen from "../Screens/SubstrateScreen";
import SettingsScreen from "../Screens/SettingsScreen";
import ControlScreen from "../Screens/ControlScreen";
import NotifikasiScreen from "../Screens/NotifikasiScreen";
import ProfilScreen from "../Screens/ProfilScreen";
import Grafik2 from "../components/Elements/Grafik_landscape";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        key={user ? "app" : "auth"}
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Grafik2" component={Grafik2} />
            <Stack.Screen name="Substrate" component={SubstrateScreen} />
            <Stack.Screen name="Control" component={ControlScreen} />
            <Stack.Screen name="Notifikasi" component={NotifikasiScreen} />
            <Stack.Screen name="Profil" component={ProfilScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Registerr" component={RegisterScreen2} />
            <Stack.Screen name="LupaPas" component={LupaPasScreen} />
            <Stack.Screen name="LupaPass" component={LupaPasScreen2} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
