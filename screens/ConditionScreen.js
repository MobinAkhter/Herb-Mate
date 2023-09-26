import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BigButton from "../components/ui/BigButton";
import { db } from "../firebase";

function ConditionScreen({ route }) {
  const { bp } = route.params;
  const navigation = useNavigation();
  const [conditions, setConditions] = useState([]);
  const col = db.collection("BodyParts");

  // Loads the conditions from cache or database
  const loadConditions = async () => {
    try {
      const cacheKey = `conditions_${bp}`;
      const cachedConditions = await AsyncStorage.getItem(cacheKey);

      if (cachedConditions !== null) {
        console.log(`Fetching conditions from cache for body part: ${bp}`);
        setConditions(JSON.parse(cachedConditions));
      } else {
        console.log(`Fetching conditions from Firestore for body part: ${bp}`);
        const con = [];
        const querySnapshot = await col.doc(bp).collection("Conditions").get();

        querySnapshot.forEach((doc) => {
          con.push({
            ...doc.data(),
            key: doc.id,
          });
        });

        await AsyncStorage.setItem(cacheKey, JSON.stringify(con));
        setConditions(con);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadConditions();
  }, []);

  // TODO: Uncomment the lines of code below, if there is some caching problem, herbs from db are not showing up etc.
  // useEffect(() => {
  //   // Clear the AsyncStorage cache
  //   AsyncStorage.clear()
  //     .then(() => {
  //       console.log("Cache cleared for testing!");
  //       loadConditions();
  //     })
  //     .catch((error) => {
  //       console.log("Error clearing cache:", error);
  //       loadConditions(); // You might still want to load conditions even if clearing cache fails.
  //     });
  // }, []);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>
        {bp === "Digestive" && (
          <MaterialCommunityIcons
            styles={styles.icon}
            name="stomach"
            size={40}
            color="black"
          />
        )}
        {bp === "Circulatory" && (
          <Fontisto
            styles={styles.icon}
            name="blood-drop"
            size={40}
            color="black"
          />
        )}
        {bp === "Head and Neck" && (
          <FontAwesome5
            styles={styles.icon}
            name="head-side-virus"
            size={40}
            color="black"
          />
        )}
        {bp === "Mental" && (
          <MaterialCommunityIcons
            styles={styles.icon}
            name="brain"
            size={40}
            color="black"
          />
        )}
        {bp === "Respiratory" && (
          <FontAwesome5
            styles={styles.icon}
            name="lungs"
            size={40}
            color="black"
          />
        )}
        {bp === "Skeletal" && (
          <FontAwesome5
            styles={styles.icon}
            name="bone"
            size={40}
            color="black"
          />
        )}
        {bp === "Skin" && (
          <Ionicons styles={styles.icon} name="body" size={40} color="black" />
        )}
        {bp} Conditions
      </Text>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={conditions}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <BigButton
              onPress={() => {
                navigation.navigate("Remedies", {
                  bp: bp,
                  con: item.name,
                });
              }}
            >
              <Text style={styles.itemText}>{item.name}</Text>
            </BigButton>
          </View>
        )}
      />
    </View>
  );
}

export default ConditionScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 32,
    paddingTop: 14, // personal preference
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  itemText: {
    // Add desired styles for the item text
  },
  icon: {
    // Add desired styles for the icons
  },
});
