import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import BigButton from "../ui/BigButton";
import { Colors } from "../../constants/styles";
import { db } from "../../firebase";

function RemedyList({ bodyPart, condition }) {
  const navigation = useNavigation();
  const [remedies, setRemedies] = useState([]);
  const [cached, setCached] = useState(false); // new state variable

  // Define the cache key for AsyncStorage
  const cacheKey = `remedies_${bodyPart}_${condition}`;

  const col = db.collection("BodyParts");

  useEffect(() => {
    const con = [];
  
    // Try to retrieve the remedies from cache
    AsyncStorage.getItem(cacheKey)
      .then((cachedRemedies) => {
        if (cachedRemedies) {
          setRemedies(JSON.parse(cachedRemedies));
          console.log("Remedies retrieved from cache");
        } else {
          // If remedies are not found in cache, fetch from Firestore
          col
            .doc(bodyPart)
            .collection("Conditions")
            .doc(condition)
            .collection("Remedies")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                con.push({
                  ...doc.data(),
                  key: doc.id,
                });
              });
  
              // Cache the remedies in AsyncStorage 
              AsyncStorage.setItem(cacheKey, JSON.stringify(con))
                .then(() => console.log("Remedies cached successfully"))
                .catch((error) => console.error(error));
  
              setRemedies(con);
              console.log("Remedies retrieved from Firestore");
            })
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));
  }, []);
  

  return (
    <View style={styles.container}>
      <FlatList
        data={remedies}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <BigButton
              onPress={() => {
                navigation.navigate("AboutRemedy", {
                  rem: item.name,
                });
              }}
            >
              <Text styles={styles.itemText}>{item.name}</Text>
            </BigButton>
          </View>
        )}
      />
    </View>
  );
}

export default RemedyList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
});
