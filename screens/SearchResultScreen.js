import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MIcon from "../components/ui/MIcon";
import { removeSpace, iconMapper } from "../utils";
import { db } from "../firebase";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import SearchBar from "../components/ui/SearchBar";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

function SearchResultScreen({ route }) {
  const { searchVal } = route.params;
  const navigation = useNavigation();
  const [conditions, setConditions] = useState([]);
  const [remedies, setRemedies] = useState([]);
  const [searchValue, setSearchValue] = useState(searchVal);
  const [index, setIndex] = useState(0);
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

  const loadConditions = async () => {
    let conditionList = [];
    try {
      for (const element of bpList) {
        const colRef = collection(db, `BodyParts/${element}/Conditions`);
        const q = query(colRef, orderBy("name"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          conditionList.push({
            ...doc.data(),
            key: doc.id,
            bp: element,
          });
        });
      }
    } catch (error) {
      console.error("Error loading conditions:", error);
    }
    return conditionList;
  };

  const loadRemedies = async () => {
    let remList = [];
    try {
      const q = query(collection(db, "Remedies"), orderBy("name"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        remList.push({
          ...doc.data(),
          id: doc.id,
        });
      });
    } catch (error) {
      console.error("Error loading remedies:", error);
    }
    return remList;
  };

  const applyFilters = async () => {
    const conditionList = await loadConditions();
    const remList = await loadRemedies();

    const filteredConditions = conditionList.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    const filteredRemedies = remList.filter((item) =>
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    setConditions(filteredConditions);
    setRemedies(filteredRemedies);
  };

  useEffect(() => {
    setSearchValue(searchVal);
  }, [searchVal]);

  useEffect(() => {
    applyFilters();
  }, [searchValue]);

  const initialLayout = { width: Dimensions.get("window").width };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "green" }}
      style={{ backgroundColor: "white" }}
      labelStyle={{ color: "black" }}
    />
  );

  const renderRemedies = () => (
    <FlatList
      data={remedies}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.id}
          style={styles.listItem}
          onPress={() => navigation.navigate("Remedy Details", { rem: item })}
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
  );

  const renderConditions = () => (
    <FlatList
      data={conditions}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.key}
          style={styles.listItem}
          onPress={() =>
            navigation.navigate("Remedies", { bp: item.bp, con: item.name })
          }
        >
          <View style={styles.bpIcon}>
            <MIcon size={10} {...iconMapper[removeSpace(item.bp)]} />
          </View>
          <Text style={styles.herbName}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );

  const renderScene = SceneMap({
    remedies: renderRemedies,
    conditions: renderConditions,
  });

  return (
    <View style={styles.rootContainer}>
      <SearchBar
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        placeholder="Search for remedies or conditions"
        onSearchPress={applyFilters}
      />
      <TabView
        navigationState={{
          index,
          routes: [
            { key: "remedies", title: "Remedies" },
            { key: "conditions", title: "Conditions" },
          ],
        }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
}

export default SearchResultScreen;

const styles = StyleSheet.create({
  rootContainer: {
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
    borderRadius: 25,
  },
  herbName: {
    fontSize: 18,
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
  },
});
