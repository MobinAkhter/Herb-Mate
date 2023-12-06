import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  TextInput,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { db } from "../firebase";
import { Entypo } from "@expo/vector-icons";
import { removeSpace, iconMapper } from "../utils";
import MIcon from "../components/ui/MIcon";

const WelcomeScreen = ({}) => {
  const navigation = useNavigation();
  const [bodyParts, setBodyParts] = useState([]);
  const [searchInput, setSearchInput] = useState();
  // const [showAll, setShowAll] = useState(false);

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

  const renderBodyPartCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Condition", { bp: item.name })}
      style={styles.card}
    >
      <View style={styles.cardContent}>
        <MIcon {...iconMapper[removeSpace(item.name)]} size={30} />
        <Text style={styles.cardText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
  // const renderFooter = () => {
  //   if (!showAll && bodyParts.length > 4) {
  //     return (
  //       <TouchableOpacity
  //         onPress={() => setShowAll(true)}
  //         style={styles.disclosureButton}
  //       >
  //         <Text style={styles.disclosureButtonText}>See More</Text>
  //       </TouchableOpacity>
  //     );
  //   } else if (showAll) {
  //     return (
  //       <TouchableOpacity
  //         onPress={() => setShowAll(false)}
  //         style={styles.disclosureButton}
  //       >
  //         <Text style={styles.disclosureButtonText}>See Less</Text>
  //       </TouchableOpacity>
  //     );
  //   }
  //   return null;
  // };

  return (
    <View style={styles.rootContainer}>
      <SafeAreaView>
        {/* new */}
        <View style={styles.searchContainer}>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for remedy/conditions..."
              keyboardType="default"
              onChangeText={(input) => setSearchInput(input)}
              value={searchInput}
            />
          </View>

          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => {
              console.log("nav to search results???");
              navigation.navigate("SearchResult", {
                searchVal: searchInput,
              });
            }}
          >
            <MagnifyingGlassIcon
              color="white"
              size={20}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bodyPartsContainer}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={bodyParts}
            renderItem={renderBodyPartCard}
            keyExtractor={(item) => item.key}
            numColumns={2}
            columnWrapperStyle={styles.row}
            // ListFooterComponent={renderFooter}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 18,
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
    marginTop: 5,
    flex: 1,
  },
  searchWrapper: {
    backgroundColor: "white",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    height: "100%",
    width: "65%",
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
  card: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 },
    elevation: 3,
    borderColor: "#35D96F",
    borderWidth: 3,
    width: Dimensions.get("window").width / 2 - 50,
  },
  cardContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  cardText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "400",
  },
  row: {
    justifyContent: "space-between",
  },
});
