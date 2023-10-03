import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TextInput, FlatList } from "react-native";
import { db, auth } from "../firebase";
import Button from "../components//ui/Button";
import { useNavigation } from "@react-navigation/native";
// import {
//   LineChart,
//   BarChart,
//   PieChart,
//   ProgressChart,
//   ContributionGraph,
//   StackedBarChart,
// } from "react-native-chart-kit";

const DataAnalyticsScreen = () => {
  const navigation = useNavigation();

  const [remedy1, setRemedy1] = useState("");
  const [remedy2, setRemedy2] = useState("");
  const [remedy3, setRemedy3] = useState("");
  const [remedy4, setRemedy4] = useState("");
  const [remedy5, setRemedy5] = useState("");

  const dataset = [
    ["Angelica", 23],
    ["Boswellia", 26],
    ["Buchu", 0],
    ["Calendula", 6],
    ["Chrysanthemum", 43],
    ["Cramp Bark", 14],
    ["Dragon", 33],
    ["Eucalyptus", 45],
    ["Feverfew", 29],
    ["Gentian", 3],
    ["Ginseng", 36],
    ["Hawthorn", 50],
    ["Horse Chestnut", 44],
    ["Hyssop", 37],
    ["Juniper", 25],
    ["Kava Kava", 41],
    ["Lavender", 27],
    ["Motherwort", 19],
    ["Mullein", 9],
    ["undefined", 40],
    ["Passionflower", 36],
    ["Rehmannia", 17],
    ["Rhubarb", 24],
    ["Saffron", 11],
    ["Saw Palmetto", 31],
    ["Slippery Elm", 48],
    ["Tumeric", 30],
    ["Valerian", 35],
    ["Yarrow", 19],
  ];

  const remedyNames = [];

  const barData = {
    datasets: [
      {
        data: [10, 20, 30, 40, 20],
        colors: [
          (opacity = 1) => "#01FD1A",
          (opacity = 1) => "#1F51FF",
          (opacity = 1) => "#FD0131",
          (opacity = 1) => "#FD6101",
          (opacity = 1) => "#6D01FD",
        ],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff", // white background
    backgroundGradientTo: "#fff", // white background
    decimalPlaces: 0, // Hide decimals in the y-axis labels
    color: (opacity = 0) => "#FFFFFF", // blue color for bars
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // black color for labels
  };

  useEffect(() => {}, []);

  const getData = () => {
    const remediesRef = db.collection("Remedies");

    remediesRef.get("name", "bookmarkCount").then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const remedyData = doc.data();
        console.log(
          `Name: ${remedyData.name}, Bookmark count: ${remedyData.bookmarkCount}`
        );
      });
    });
  };

  const formatYLabel = (value) => {
    return "f";
  };

  const getTopFive = () => {
    dataset.sort((a, b) => b[1] - a[1]);

    for (let i = 0; i < 5; i++) {
      remedyNames.push(dataset[i][0]);
    }

    setRemedy1(remedyNames[0]);
    setRemedy2(remedyNames[1]);
    setRemedy3(remedyNames[2]);
    setRemedy4(remedyNames[3]);
    setRemedy5(remedyNames[4]);
  };

  return (
    <View style={styles.rootContainer}>
      <Text> Data Analytics</Text>
      <Button onPress={getTopFive}>Get Top 5 Most Popular Remedies</Button>
      <Text>{remedy1}</Text>
      <Text>{remedy2}</Text>
      <Text>{remedy3}</Text>
      <Text>{remedy4}</Text>
      <Text>{remedy5}</Text>
    </View>
  );
};

export default DataAnalyticsScreen;

const styles = StyleSheet.create({
  rootContainer: {
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
