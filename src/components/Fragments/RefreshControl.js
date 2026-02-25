import React from "react";
import {
  RefreshControl as RNRefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";

const RefreshControl = ({
  children,
  onRefresh,
  refreshing,
  colors = ["#3D5A3D", "#4CAF50"],
  tintColor = "#3D5A3D",
  style = {},
}) => {
  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RNRefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={colors}
          tintColor={tintColor}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default RefreshControl;
