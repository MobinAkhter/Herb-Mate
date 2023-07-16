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
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import BigButton from "../components/ui/BigButton";
import { db } from "../firebase";
// import Button from "../ui/Button";
import { Entypo } from "@expo/vector-icons";
import { removeSpace, iconMapper } from "../utils";
import MIcon from "../components/ui/MIcon";

const WelcomeScreen = ({}) => {
  const navigation = useNavigation();
  const [bodyParts, setBodyParts] = useState([]);
  const [searchInput, setSearchInput] = useState();
  const [showAll, setShowAll] = useState(false);

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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Chat")}
          style={styles.chatButton}
        >
          <Entypo name="chat" size={24} color="royalblue" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.rootContainer}>
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
        <View style={styles.bodyPartsContainer}>
          <FlatList
            data={showAll ? bodyParts : bodyParts.slice(0, 4)}
            showsVerticalScrollIndicator={false}
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
                    <MIcon {...iconMapper[removeSpace(item.name)]} />
                  </View>
                  <Text>{item.name}</Text>
                </BigButton>
              </View>
            )}
          />
        </View>
        {!showAll && bodyParts.length > 4 && (
          <TouchableOpacity
            onPress={() => setShowAll(true)}
            style={styles.disclosureButton}
          >
            <Text style={styles.disclosureButtonText}>See More</Text>
          </TouchableOpacity>
        )}

        {showAll && (
          <TouchableOpacity
            onPress={() => setShowAll(false)}
            style={styles.disclosureButton}
          >
            <Text style={styles.disclosureButtonText}>See Less</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    height: 50,
    marginBottom: 10,
  },
  bodyPartsContainer: {
    flex: 1,
    marginTop: 10,
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
  disclosureButton: {
    marginLeft: 125,
    width: "auto",
    height: 50,
    backgroundColor: "#35D96F",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  disclosureButtonText: {
    color: "white",
    fontSize: 16,
  },
});
