import { StyleSheet, View, Text, TextInput, FlatList } from "react-native";
import { db, auth } from "../../firebase";
import { useEffect, useState } from "react";
import { Button } from "react-native";
import BigButton from "../ui/BigButton";
import { useNavigation } from "@react-navigation/native";

function DataAnalytics() {
  const navigation = useNavigation();
  useEffect(() => {});

  return (
    <>
      <Text> Data Analytics</Text>
    </>
  );
}

export default DataAnalytics;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffc2c2",
  },
  title: {
    fontSize: 18,
    marginVertical: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
  },
});
