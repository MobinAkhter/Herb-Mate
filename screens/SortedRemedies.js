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
import { db } from "../firebase";

const PAGE_SIZE = 20; // Number of remedies to fetch at once

const SortedRemedies = () => {
  const [herbs, setHerbs] = useState([]);
  const [lastVisibleRemedy, setLastVisibleRemedy] = useState(null);
  const navigation = useNavigation();

  const fetchHerbs = async () => {
    try {
      let query = db.collection("Remedies").orderBy("name").limit(PAGE_SIZE);

      if (lastVisibleRemedy) {
        query = query.startAfter(lastVisibleRemedy);
      }

      const querySnapshot = await query.get();

      if (querySnapshot.empty) {
        return;
      }

      setLastVisibleRemedy(querySnapshot.docs[querySnapshot.docs.length - 1]);

      const herbsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHerbs((prevHerbs) => [...prevHerbs, ...herbsArray]);
    } catch (error) {
      console.error("Error fetching herbs:", error);
    }
  };

  useEffect(() => {
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
              navigation.navigate("Remedy Details", { rem: item.name });
            }}
          >
            <Image
              source={
                item.image
                  ? { uri: item.image }
                  : require("../assets/leaf_icon.jpeg")
              }
              style={styles.herbImage}
            />
            <Text style={styles.herbName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        onEndReached={fetchHerbs}
        onEndReachedThreshold={0.1} // Trigger fetch when 90% scrolled
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
