import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import BoxAtas from "../components/Fragments/BoxAtas";
import NavBar from "../components/Fragments/NavBar";
import RefreshControl from "../components/Fragments/RefreshControl";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "APP_NOTIFICATIONS";

const NotificationScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState({
    unread: [],
    read: [],
  });

  /* =============================
     LOAD NOTIFICATION FROM STORAGE
  ============================= */

  const loadNotifications = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch (err) {
      console.log("Load error:", err);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, []);

  /* =============================
     SAVE NOTIFICATION
  ============================= */

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

      // Hindari duplicate berdasarkan message + time dekat
      const alreadyExists = parsed.unread.some(
        (n) => n.message === newNotif.message,
      );

      if (alreadyExists) return;

      const updated = {
        unread: [newNotif, ...parsed.unread],
        read: parsed.read,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      setNotifications(updated);
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  /* =============================
     LISTENER (FOREGROUND)
  ============================= */

  useEffect(() => {
    const receivedSub = Notifications.addNotificationReceivedListener(
      async (notification) => {
        await saveNotification(notification);
      },
    );

    const responseSub = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        await saveNotification(response.notification);
      },
    );

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  /* =============================
     MARK AS READ
  ============================= */

  const markAsRead = async (item) => {
    const updated = {
      unread: notifications.unread.filter((n) => n.id !== item.id),
      read: [item, ...notifications.read],
    };

    setNotifications(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteNotification = async (id, type) => {
    let updated;

    if (type === "unread") {
      updated = {
        unread: notifications.unread.filter((item) => item.id !== id),
        read: notifications.read,
      };
    } else {
      updated = {
        unread: notifications.unread,
        read: notifications.read.filter((item) => item.id !== id),
      };
    }

    setNotifications(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <BoxAtas />

      <RefreshControl
        onRefresh={handleRefresh}
        refreshing={refreshing}
        style={styles.scrollView}
      >
        {/* Belum dilihat Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Belum dilihat</Text>

          {notifications.unread.map((item, index) => (
            <View key={item.id} style={styles.notificationCard}>
              <View style={styles.notificationContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.warningIcon}>⚠️</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.notificationText}>{item.message}</Text>
                  {item.badge && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => markAsRead(item)}
              >
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Dilihat Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dilihat</Text>

          {notifications.read.map((item) => (
            <View
              key={item.id}
              style={[styles.notificationCard, styles.readCard]}
            >
              <View style={styles.notificationContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.warningIcon}>⚠️</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.notificationText}>{item.message}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteNotification(item.id, "read")}
              >
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </RefreshControl>

      {/* Bottom Navigation */}
      <NavBar />
    </View>
  );
};

const styles = StyleSheet.create({
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
  notificationButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  notificationCard: {
    backgroundColor: "#E8E5D9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  readCard: {
    backgroundColor: "#E5E7EB",
    borderLeftWidth: 0,
  },
  notificationContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  warningIcon: {
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 13,
    color: "#1A1A1A",
    lineHeight: 18,
  },
  badge: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 18,
  },
  bottomSpacing: {
    height: 100,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
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
    elevation: 8,
  },
  navItem: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconContainerActive: {
    backgroundColor: "#4A5A3D",
    borderRadius: 20,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  navIconText: {
    fontSize: 26,
    color: "#9CA3AF",
  },
  navIconTextActive: {
    fontSize: 26,
    color: "#FFFFFF",
  },
});

export default NotificationScreen;
