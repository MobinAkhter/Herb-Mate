import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import MIcon from "../components/ui/MIcon";
import { removeSpace, iconMapper } from "../utils";
import { db, auth } from "../firebase";

function SearchResultScreen({ route }) {
  const { searchVal } = route.params;
  console.log(searchVal);
  const navigation = useNavigation();

  //gets/sets list of remedies to show in flatlist
  const [conditions, setConditions] = useState([]);
  const [remedies, setRemedies] = useState([]);
  const [searchValue, setSearchValue] = useState(searchVal);
  const col = db.collection("BodyParts");
  const remedyCol = db.collection("Remedies");
  const bpList = [
    "Circulatory",
    "Digestive",
    "Female Reproductive",
    "Head and Neck",
    "Male Reproductive",
    "Mental",
    "Respiratory",
    "Skeletal",
    "Skin",
    "Urinary",
  ];

  var width = Dimensions.get("window").width; //full width
  var height = Dimensions.get("window").height; //full height
  var rems = db.collectionGroup("Remedies");
  const user = auth.currentUser.uid;

  const loadConditions = () => {
    const conditionList = [];
    bpList.forEach((element) => {
      col
        .doc(element)
        .collection("Conditions")
        .orderBy("name")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.id.toLowerCase().includes(searchValue.toLowerCase())) {
              console.log("result: " + doc.id);
              conditionList.push({
                ...doc.data(),
                key: doc.id,
                bp: element,
              });
            }
          });
          setConditions(conditionList);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    });
  };

  const loadRemedies = () => {
    const remList = [];
    //Gets a list of remedies to populate the second flat list depending on search terms entered
    remedyCol
      .orderBy("name")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.id.toLowerCase().includes(searchValue.toLowerCase())) {
            console.log("rem result: " + doc.id);
            remList.push({
              ...doc.data(),
              key: doc.id,
            });
          }
        });
        setRemedies(remList);
      });
  };

  const handleSearch = () => {
    loadConditions();
    loadRemedies();
  };

  const searchCondition = async (conditionName) => {
      // Get the user's document reference
    const userDocRef = db.collection("users").doc(user);
  
    // Use the get() method to fetch the user's document
    const userDocSnapshot = await userDocRef.get();

    if (userDocSnapshot.exists) {
      // Check if the document exists
      const userData = userDocSnapshot.data();

      //check if the searches property of the user is at least 20
       if(userData && userData.searches)
       {
         if(userData.searches.length <= 19)
         {
          userData.searches.push(conditionName);

             // Update the user's document in the database
          await userDocRef.update({
          searches: userData.searches
        });

         }
         else{
          console.log("Cannot add conditions anymore")
         }
       }
    }
  }

  //Fills list of conditions to show in flatlist based on the bodypart selected
  useEffect(() => {
    loadConditions();
    loadRemedies();
  }, []);

  // Sort the conditions alphabetically
  conditions.sort((a, b) => a.name.localeCompare(b.name));

  // Sort the remedies alphabetically
  remedies.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View style={styles.rootContainer}>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for remedy"
            keyboardType="default"
            onChangeText={(input) => setSearchValue(input)}
            value={searchValue}
          />
        </View>

        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => {
            console.log("nav to search results???");
            handleSearch();
          }}
        >
          <MagnifyingGlassIcon
            color="white"
            size={20}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>Remedies</Text>
      </View>

      <FlatList
        data={remedies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              console.log("Navigating with remedy:", item);
              navigation.navigate("Remedy Details", { rem: item.key });
            }}
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
      />

      <View style={styles.header}>
        <Text style={styles.title}>Conditions</Text>
      </View>

      <FlatList
        data={conditions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              console.log("Navigating with remedy:", item);
              navigation.navigate("Remedies", {
                bp: item.bp,
                con: item.name,
              });
              searchCondition(item.name)
              console.log("Navigation to condition ", item.name)
            }}
          >
            <View style={styles.bpIcon}>
              <MIcon size={10} {...iconMapper[removeSpace(item.bp)]} />
            </View>
            <Text style={styles.herbName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default SearchResultScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    //alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  header: {
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: 40,
    backgroundColor: "#dfede0",
    bottomBorderWidth: "0.5px",
    borderColor: "black",
  },
  list: {},
  // container: {
  //   flex: 1,
  // },
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
    //marginRight: 10,
    borderRadius: 25,
  },
  herbName: {
    fontSize: 18,
    //marginRight: 70,
  },

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
    marginLeft: 12,
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
  bpIcon: {
    width: 50,
    height: 50,
    marginRight: 2,
    //borderRadius: 25,
  },
});
