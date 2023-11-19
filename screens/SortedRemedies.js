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

const PAGE_SIZE = 10;

const SortedRemedies = () => {
  const [herbs, setHerbs] = useState([]);
  const [lastVisibleRemedy, setLastVisibleRemedy] = useState(null);
  const [allHerbsLoaded, setAllHerbsLoaded] = useState(false);
  const navigation = useNavigation();

  const fetchHerbs = async () => {
    let query = db.collection("Remedies").orderBy("name").limit(PAGE_SIZE);

    if (lastVisibleRemedy) {
      query = query.startAfter(lastVisibleRemedy);
    }

    const querySnapshot = await query.get();

    if (querySnapshot.empty) {
      setAllHerbsLoaded(true);
      return;
    }

    const herbsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const newLastVisibleRemedy =
      querySnapshot.docs[querySnapshot.docs.length - 1];
    setLastVisibleRemedy(newLastVisibleRemedy);

    setHerbs((prevHerbs) => [...prevHerbs, ...herbsArray]);
  };

  useEffect(() => {
    fetchHerbs();
  }, []);

  const navigateToDetails = (id) => {
    console.log("Navigating with remedy:", id);
    navigation.navigate("Remedy Details", { rem: id });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={herbs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigateToDetails(item)}
          >
            <Image
              source={
                item.image && item.image.length > 0
                  ? { uri: item.image[0] }
                  : require("../assets/leaf_icon.jpeg")
              }
              style={styles.herbImage}
            />
            <Text style={styles.herbName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        onEndReached={allHerbsLoaded ? null : fetchHerbs}
        onEndReachedThreshold={0.9}
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
    marginRight: 70,
  },
});
