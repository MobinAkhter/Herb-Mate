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

const PreparationScreen = () => {
  const [preparations, setPreparations] = useState([]);
  //const [lastVisibleRemedy, setLastVisibleRemedy] = useState(null);
  //const [allHerbsLoaded, setAllHerbsLoaded] = useState(false);
  const navigation = useNavigation();

  const fetchPreparations = async () => {
    let query = db.collection("Preparations");

    const querySnapshot = await query.get();

    if (querySnapshot.empty) {
      setAllHerbsLoaded(true);
      return;
    }

    const prepArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPreparations(prepArray);
  };

  const renderPreparation = ({ item }) => (
    <TouchableOpacity style={styles.cardContainer}>
      <Image
        source={
          item.image && item.image.length > 0
            ? { uri: item.image }
            : require("../assets/leaf_icon.jpeg")
        }
        style={styles.herbImage}
      />
      <Text style={styles.herbName}>{item.name}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchPreparations();
  }, []);

  const navigateToDetails = (id) => {
    console.log("Navigating to prep: ", id);
    navigation.navigate("Remedy Details", { rem: id });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={preparations}
        keyExtractor={(item) => item.id}
        renderItem={renderPreparation}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

export default PreparationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  cardContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    margin: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  herbImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  herbName: {
    fontSize: 16,
    textAlign: "center",
  },
});
