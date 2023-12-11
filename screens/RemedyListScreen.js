import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase";

function RemedyListScreen({ route }) {
  const { bp, con } = route.params;
  const navigation = useNavigation();
  const [remedies, setRemedies] = useState([]);
  const cacheKey = `remedies_${bp}_${con}`;

  useEffect(() => {
    // AsyncStorage.clear();
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
              const remediesDetails = await Promise.all(
                conditionData.remedies.map(async (remedyName) => {
                  const remedyDoc = await db
                    .collection("Remedies")
                    .doc(remedyName)
                    .get();
                  return remedyDoc.exists
                    ? { id: remedyDoc.id, ...remedyDoc.data() }
                    : null;
                })
              );
              const validRemedies = remediesDetails.filter(Boolean);
              setRemedies(validRemedies);

              await AsyncStorage.setItem(
                cacheKey,
                JSON.stringify(validRemedies)
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

  const truncateDescription = (description, maxLength) => {
    if (
      description &&
      typeof description === "string" &&
      description.length > maxLength
    ) {
      return description.slice(0, maxLength) + "...";
    }
    return description || "";
  };

  const renderItem = ({ item }) => {
    // If an image has existing image use the first 1, cause most images dont have 2nd image. Otherwise, use local default img.
    const imageSource = item?.image?.[0]
      ? { uri: item.image[0] }
      : require("../assets/leaf_icon.jpeg");

    const learnMorePressed = (item) => {
      console.log("Navigating to details with item: ", item);
      navigation.navigate("Remedy Details", { rem: item });
    };
    return (
      <View style={styles.card}>
        <Image source={imageSource} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDescription}>
            {truncateDescription(item.description, 60)}
          </Text>
          <Text
            onPress={() => learnMorePressed(item)} // tryna debug this ^
            // onPress={() => navigation.navigate("Remedy Details", { rem: item })}
            style={styles.learnMore}
          >
            Learn more
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.rootContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={remedies}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        numColumns={2} // 2 columns grid
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  row: {
    justifyContent: "space-around", // This distributes space evenly around the items.
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
    marginVertical: 10,
    width: "48%",
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginHorizontal: 10, // Spacing from the screen edges
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  cardDescription: {
    color: "#666",
    marginBottom: 10,
  },
  learnMore: {
    fontSize: 16,
    color: "#1e90ff",
    fontWeight: "bold",
  },
});

export default RemedyListScreen;
