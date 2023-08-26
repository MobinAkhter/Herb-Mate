import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BigButton from "../components/ui/BigButton";
import { db } from "../firebase";

function RemedyListScreen({ route }) {
  const { bp, con } = route.params;
  console.log("Received bp " + bp);
  console.log(con);
  const navigation = useNavigation();
  const [remedies, setRemedies] = useState([]);
  
  useEffect(() => {
    const fetchRemedies = async () => {
      try {
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
        data={remedies}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <BigButton
              onPress={() => {
                navigation.navigate("AboutRemedy", {
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
