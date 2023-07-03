import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BigButton from "../components/ui/BigButton";
import { db } from "../firebase";

function RemedyListScreen({ route }) {
  const { bp, con, rem } = route.params;
  const navigation = useNavigation();
  const [remedies, setRemedies] = useState([]);
  const [cached, setCached] = useState(false); // new state variable

  // Define the cache key for AsyncStorage
  const cacheKey = `remedies_${bp}_${con}`;

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
            .doc(bp)
            .collection("Conditions")
            .doc(con)
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
    <View style={styles.rootContainer}>
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
              <Text style={styles.itemText}>{item.name}</Text>
            </BigButton>
          </View>
        )}
      />
    </View>
  );
}

export default RemedyListScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
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
});
