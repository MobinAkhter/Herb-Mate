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

const PreparationScreen = () => {
  const [preparations, setPreparations] = useState([]);
  const navigation = useNavigation();

  //getting the list of preparation methods
  const fetchPreparations = async () => {
    let query = db.collection("Preparations");

    const querySnapshot = await query.get();

    const prepArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    //console.log("prep array: " + prepArray[1].name);
    setPreparations(prepArray);
  };

  const renderPreparation = ({ item, index }) => (
    <TouchableOpacity
      key={item.name}
      style={styles.cardContainer}
      onPress={() => navigateToDetails(item.name)}
    >
      <Image
        source={
          item.image && item.image.length > 0
            ? { uri: item.image }
            : require("../assets/leaf_icon.jpeg")
        }
        style={styles.prepImage}
      />
      <Text style={styles.prepName}>{item.name}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchPreparations();
  }, []);

  const navigateToDetails = (id) => {
    console.log("Navigating to prep: ", id);
    navigation.navigate("Preparation Details", { method: id });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={preparations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPreparation}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
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
  prepImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  prepName: {
    fontSize: 16,
    textAlign: "center",
  },
});
