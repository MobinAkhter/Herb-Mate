import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebase"; // Ensure this is the correct path to your Firebase config

const SortedRemedies = () => {
  const [herbs, setHerbs] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchHerbs = async () => {
      try {
        const querySnapshot = await db
          .collection("Remedies")
          .orderBy("name")
          .get();
        const herbsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHerbs(herbsArray);
      } catch (error) {
        console.error("Error fetching herbs:", error);
      }
    };

    fetchHerbs();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={herbs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              navigation.navigate("AboutRemedy", { rem: item.name });
            }}
          >
            <Image source={{ uri: item.image }} style={styles.herbImage} />
            <Text style={styles.herbName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SortedRemedies;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  herbImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  herbName: {
    fontSize: 18,
  },
});
