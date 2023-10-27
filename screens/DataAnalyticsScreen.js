import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { db } from "../firebase";
import Button from "../components/ui/Button";
import { useNavigation } from "@react-navigation/native";

const DataAnalyticsScreen = () => {
  const navigation = useNavigation();

  const DATA = [
    {
      id: 0,
      title: "Heart and Circulatory Health",
    },
    {
      id: 1,
      title: "Digestive Wellness",
    },
    {
      id: 2,
      title: "Women's Health",
    },
    {
      id: 3,
      title: "Well Being",
    },
    {
      id: 4,
      title: "Respiratory Health",
    },
    {
      id: 5,
      title: "Joint and Bone Health",
    },
    {
      id: 5,
      title: "Skin Condition",
    },
    {
      id: 6,
      title: "Urinary Health",
    },
  ];

  function buttonClick(title) {
    navigation.navigate("QuestionTier2", {
      prevQuestion: title,
    });
  }

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Button onPress={() => buttonClick(title)} style={styles.title}>
        {title}
      </Button>
    </View>
  );

  return (
    <View style={styles.rootContainer}>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default DataAnalyticsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    marginTop: 160,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
