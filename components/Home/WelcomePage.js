import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TextInput,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import BigButton from "../ui/BigButton";
import { db } from "../../firebase";
// import Button from "../ui/Button";
import Icon from "@expo/vector-icons/FontAwesome";
//random
function WelcomePage({}) {
  const navigation = useNavigation();
  const [bodyParts, setBodyParts] = useState([]);
  const [searchInput, setSearchInput] = useState();

  useEffect(() => {
    const fetchBodyParts = async () => {
      try {
        // Try to get the cached body parts from AsyncStorage
        const cachedBodyParts = await AsyncStorage.getItem("bodyParts");

        // If cached data exists, parse it and set it as the state
        if (cachedBodyParts) {
          const parsedBodyParts = JSON.parse(cachedBodyParts);
          console.log("Fetching body parts from cache...");
          await setBodyParts(parsedBodyParts); // add await here
        }

        // Always fetch the latest data from Firestore and update the state and cache
        const parts = [];
        const querySnapshot = await db.collection("BodyParts").get();
        console.log("Fetching body parts from Firestore...");
        querySnapshot.forEach((doc) => {
          parts.push({
            ...doc.data(),
            key: doc.id,
          });
        });

        // Update state with the latest body parts
        setBodyParts(parts);

        // Cache the latest body parts
        await AsyncStorage.setItem("bodyParts", JSON.stringify(parts));
        console.log("Caching");
      } catch (error) {
        console.error(error);
      }
    };

    fetchBodyParts();
  }, []);

  return (
    <SafeAreaView>
      {/* new */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for remedy"
            keyboardType="default"
            onChangeText={(input) => setSearchInput(input)}
            value={searchInput}
          />
        </View>

        <TouchableOpacity style={styles.searchBtn}>
          <MagnifyingGlassIcon
            color="white"
            size={20}
            style={styles.searchIcon}
            onPress={() => {
              navigation.navigate("SearchResult", {
                searchVal: searchInput,
              });
            }}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={bodyParts}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <BigButton
              style={styles.button}
              onPress={() => {
                navigation.navigate("Condition", {
                  bp: item.name,
                });
              }}
            >
              {/* Determines icon to show based on bodypart */}
              <View style={styles.bodyParts}>
                {item.name === "Digestive" && (
                  <MaterialCommunityIcons
                    name="stomach"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Circulatory" && (
                  <MaterialCommunityIcons
                    name="blood-bag"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Head and Neck" && (
                  <FontAwesome5
                    name="head-side-virus"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Mental" && (
                  <MaterialCommunityIcons
                    name="brain"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Respiratory" && (
                  <FontAwesome5 name="lungs" size={40} color="black" />
                )}
                {item.name === "Skeletal" && (
                  <FontAwesome5 name="bone" size={40} color="black" />
                )}
                {item.name === "Skin" && (
                  <Ionicons name="body" size={40} color="black" />
                )}
                {item.name === "Male Reproductive" ||
                  (item.name === "Female Reproductive" && (
                    <MaterialCommunityIcons
                      name="reproduction"
                      size={40}
                      color="black"
                    />
                  ))}
                {item.name === "Male Reproductive" && (
                  <MaterialCommunityIcons
                    name="reproduction"
                    size={40}
                    color="black"
                  />
                )}
                {item.name === "Urinary" && (
                  <Fontisto name="blood-drop" size={40} color="black" />
                )}
              </View>
              <Text>{item.name}</Text>
            </BigButton>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default WelcomePage;

const styles = StyleSheet.create({
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    height: 50,
    marginBottom: 10,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: "white",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    height: "100%",
  },
  searchInput: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 16,
  },
  searchBtn: {
    width: 45,
    height: "100%",
    backgroundColor: "#35D96F",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  // search: {
  //   flexDirection: "row",
  //   width: "100%",
  //   alignItems: "center",
  //   justifyContent: "left",
  //   borderRadius: 50,
  //   backgroundColor: "lightgray",
  // },
});
