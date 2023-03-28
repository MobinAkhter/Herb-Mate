import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, TextInput, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import BigButton from "../ui/BigButton";
import { db } from "../../firebase";
import Button from "../ui/Button";
import Icon from "@expo/vector-icons/FontAwesome";
//random
function WelcomePage({}) {
  const navigation = useNavigation();
  //Bodyparts array used to display flatlist based on DB collection
  const [bodyParts, setBodyParts] = useState([]);
  const [searchInput, setSearchInput] = useState();
  const bp = db.collection("BodyParts");
  useEffect(() => {
    const parts = [];
    bp.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          parts.push({
            ...doc.data(),
            key: doc.id,
          });
          console.log(doc.id);
        });
        setBodyParts(parts);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

  return (
    <>
      <View style={styles.search}>
        <MagnifyingGlassIcon color="gray" size={20} style={styles.searchIcon} />
        {/* <TextInput
          style={styles.searchInput}
          placeholder="Search by herbs or symptoms"
          keyboardType="default"
        /> */}
        <TextInput
          keyboardType="default"
          style={styles.searchInput}
          placeholder={"Search..."}
          onChangeText={(input) => setSearchInput(input)}
          value={searchInput}
        ></TextInput>
        <Icon
          name="arrow-right"
          size={24}
          color="black"
          onPress={() => {
            navigation.navigate("SearchResult", {
              searchVal: searchInput,
            });
          }}
        />
      </View>
      <FlatList
        data={bodyParts}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <BigButton
              onPress={() => {
                navigation.navigate("Condition", {
                  bp: item.name,
                });
              }}
            >
              {/* Determines icon to show based on bodypart */}
              <View style={styles.icon}>
                {item.name === "Digestive" && (
                  <MaterialCommunityIcons
                    styles={styles.icon}
                    name="stomach"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Circulatory" && (
                  <MaterialCommunityIcons
                    styles={styles.icon}
                    name="blood-bag"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Head and Neck" && (
                  <FontAwesome5
                    styles={styles.icon}
                    name="head-side-virus"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Mental" && (
                  <MaterialCommunityIcons
                    styles={styles.icon}
                    name="brain"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Respiratory" && (
                  <FontAwesome5
                    styles={styles.icon}
                    name="lungs"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Skeletal" && (
                  <FontAwesome5
                    styles={styles.icon}
                    name="bone"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Skin" && (
                  <Ionicons
                    styles={styles.icon}
                    name="body"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Male Reproductive" ||
                  (item.name === "Female Reproductive" && (
                    <MaterialCommunityIcons
                      styles={styles.icon}
                      name="reproduction"
                      size={40}
                      color="black"
                    />
                  ))}
                {item.name === "Male Reproductive" && (
                  <MaterialCommunityIcons
                    styles={styles.icon}
                    name="reproduction"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Urinary" && (
                  <Fontisto
                    styles={styles.icon}
                    name="blood-drop"
                    size={40}
                    color="black"
                  />
                )}
              </View>
              <Text>{item.name}</Text>
            </BigButton>
          </View>
        )}
      />
      <View></View>
    </>
  );
}

export default WelcomePage;

const styles = StyleSheet.create({
  search: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "left",
    borderRadius: 50,
    backgroundColor: "lightgray",
  },
  searchIcon: {
    //paddingRight: 30,
  },
  arrowIcon: {
    //paddingRight: -30,
  },
  searchInput: {
    height: 35,
    fontSize: 22,
    width: "80%",
  },
});
