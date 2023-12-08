import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebase";

const PAGE_SIZE = 70;

const AlphabetIndex = ({ selectedLetter, onLetterPress }) => {
  return (
    <View style={styles.alphabetContainer}>
      {Array.from(Array(26)).map((_, i) => {
        const letter = String.fromCharCode(65 + i);
        const isSelected = letter === selectedLetter;
        return (
          <TouchableOpacity
            key={letter}
            style={isSelected ? styles.selectedLetter : styles.letterContainer}
            onPress={() => onLetterPress(letter)}
          >
            <Text style={styles.letter}>{letter}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const SortedRemedies = () => {
  const [herbs, setHerbs] = useState([]);
  const [lastVisibleRemedy, setLastVisibleRemedy] = useState(null);
  const [allHerbsLoaded, setAllHerbsLoaded] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState("A");
  const listRef = useRef(null);
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

  const onLetterPress = (letter) => {
    setSelectedLetter(letter);
    const index = herbs.findIndex((herb) => herb.name.startsWith(letter));
    if (index !== -1) {
      listRef.current.scrollToIndex({ index, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={herbs}
        keyExtractor={(item) => item.id}
        ref={listRef}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigateToDetails(item)}
          >
            <Image
              source={
                item.image && item.image[0]
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
      <AlphabetIndex
        selectedLetter={selectedLetter}
        onLetterPress={onLetterPress}
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
  alphabetContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
  },
  selectedLetter: {
    backgroundColor: "#87ceeb",
    borderRadius: 10,
    alignItems: "center",
  },

  letter: {
    fontSize: 14,
    padding: 4,
    color: "black",
  },
});
