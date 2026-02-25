import { StatusBar } from "expo-status-bar";
import { Platform, Alert } from "react-native";
import React, { useEffect, useRef } from "react";

import AppNavigator from "./src/navigation/Navigator";
import { AuthProvider, useAuth } from "./src/services/AuthContext";
import { saveExpoToken } from "./src/services/saveExpoToken";
import { startAutoSync } from "./src/services/syncOfflineSubstrat";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

// =====================
// NOTIFICATION HANDLER
// =====================
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const STORAGE_KEY = "APP_NOTIFICATIONS";

// =====================
// ROOT APP
// =====================
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

// =====================
// MAIN APP (PAKAI AUTH)
// =====================
function MainApp() {
  const { user, loading } = useAuth();

  console.log("user", user);

  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    startAutoSync();
  }, []);

  const saveNotification = async (notification) => {
    try {
      const content = notification.request.content;

      const newNotif = {
        id: Date.now().toString(),
        message: content.body,
        title: content.title,
        data: content.data,
        time: new Date().toISOString(),
      };

      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : { unread: [], read: [] };

      // Hindari duplicate
      const alreadyExists = parsed.unread.some(
        (n) => n.message === newNotif.message,
      );

      if (alreadyExists) return;

      const updated = {
        unread: [newNotif, ...parsed.unread],
        read: parsed.read,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      console.log("💾 Notif disimpan:", newNotif.message);
    } catch (err) {
      console.log("Save notif error:", err);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    registerForPushNotificationsAsync().then((token) => {
      if (!token) {
        console.log("❌ Token tidak ada");
        return;
      }

      console.log("✅ EXPO PUSH TOKEN:", token);
      console.log("UID:", user.uid);

      saveExpoToken(user.uid, token);
    });

    // FOREGROUND
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        console.log("📩 FOREGROUND NOTIF");

        await saveNotification(notification);

        Alert.alert(
          notification.request.content.title,
          notification.request.content.body,
        );
      });

    // BACKGROUND / TAP
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          console.log("👉 BACKGROUND/TAP NOTIF");
          await saveNotification(response.notification);
        },
      );

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [user, loading]);

  return <AppNavigator />;
}

// =====================
// REGISTER PUSH
// =====================
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    Alert.alert("Info", "Push notif hanya bisa di device fisik");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Gagal", "Izin notifikasi ditolak");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}
