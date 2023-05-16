import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { StatusBar } from "react-native";
import { Platform } from "react-native";

export default function ScreenWrapper({ children }) {
  let statusBarHeight = StatusBar.currentHeight
    ? StatusBar.currentHeight
    : Platform.OS === "ios"
    ? 30
    : 0;
  return (
    <View
      style={{
        paddingTop: 0,
      }}
    >
      {children}
    </View>
  );
}
