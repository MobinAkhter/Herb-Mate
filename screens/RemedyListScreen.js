import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BigButton from "../components/ui/BigButton";
import { db } from "../firebase";

function RemedyListScreen({ route }) {
  const { bp, con } = route.params;
  const navigation = useNavigation();
  const [remedies, setRemedies] = useState([]);
  const cacheKey = `remedies_${bp}_${con}`;

  useEffect(() => {
    const fetchRemedies = async () => {
      try {
        const cachedRemedies = await AsyncStorage.getItem(cacheKey);
        if (cachedRemedies) {
          setRemedies(JSON.parse(cachedRemedies));
          console.log("Remedies retrieved from cache");
        } else {
          const querySnapshot = await db
            .collection("BodyParts")
            .doc(bp)
            .collection("Conditions")
            .doc(con)
            .get();

          if (querySnapshot.exists) {
            const conditionData = querySnapshot.data();
            if (conditionData && conditionData.remedies) {
              setRemedies(conditionData.remedies);

              await AsyncStorage.setItem(
                cacheKey,
                JSON.stringify(conditionData.remedies)
              )
                .then(() => console.log("Remedies cached successfully"))
                .catch((error) => console.error(error));

              console.log("Remedies retrieved from Firestore");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching remedies:", error);
      }
    };

    fetchRemedies();
  }, [bp, con]);

  return (
    <View style={styles.rootContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={remedies}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <BigButton
              onPress={() => {
                navigation.navigate("Remedy Details", {
                  rem: item,
                });
              }}
            >
              <Text style={styles.itemText}>{item}</Text>
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
