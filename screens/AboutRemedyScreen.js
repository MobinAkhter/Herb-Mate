// FROM MY UNDERSTANDING IF YOU INCLUDE THE IMAGE URL IN ROOT COLLECTION "Remedies" AS A IMAGE FILED, THE IMAGES WILL SHOW UP.
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { AntDesign } from "@expo/vector-icons";
import { db, auth } from "../firebase";
import BookMarkButton from "../components/ui/BookmarkButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

import "firebase/firestore";

function AboutRemedyScreen({ route }) {
  const { rem } = route.params;
  const [remedy, setRemedy] = useState({});
  const [bookMarkText, setBookMarkText] = useState("BookMark");
  const [isLoading, setIsLoading] = useState(true);
  //const [checkBookMark, setCheckBookMark] = useState("");

  // Creating the collapsable state for description and precautions
  const [isDescriptionCollapsed, setDescriptionCollapsed] = useState(true);
  const [isPrecautionsCollapsed, setPrecautionsCollapsed] = useState(true);

  // access firestore
  const remediesFirebase = db.collection("Remedies");
  const user = auth.currentUser.uid;
  const userRef = db.collection("users").doc(user);

  // define the key for AsyncStorage
  //const remedyKey = typeof rem === 'string' ? 'remedy-' + rem : null;

  useEffect(() => {
    AsyncStorage.clear(); // This is important if you dont see the images, apparently the cache is messing up with image property.
    setIsLoading(true);
    // define the key for AsyncStorage
    const remedyKey = "remedy-" + rem;

    // check if the remedy is in the cache and if the data is still fresh
    AsyncStorage.getItem(remedyKey).then((cachedData) => {
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        console.log("Retrieved from cache: ", data);
        const ageInMinutes = (Date.now() - timestamp) / (1000 * 60);
        if (ageInMinutes < 120) {
          console.log("Remedy was cached");
          setRemedy(data);
          setIsLoading(false);
          return;
        }
      }

      // fetch the remedy from Firestore and save it in the cache
      remediesFirebase
        .doc(rem)
        .get()
        .then((doc) => {
          const data = doc.data();
          console.log("Fetching remedy from Firebase", data);
          setRemedy(data);
          setIsLoading(false);
          AsyncStorage.setItem(
            remedyKey,
            JSON.stringify({
              data,
              timestamp: Date.now(),
            })
          );
          console.log("Storing in cache: ", data);
        })
        .catch((error) => {
          console.error("Error fetching remedy from Firestore:", error);
          setIsLoading(false);
        });
    });
  }, []);

  function bookMarkRemedy() {
    if (!userRef.collection("bookmarks").doc(rem).exists) {
      userRef.collection("bookmarks").doc(rem).set({
        name: remedy.name,
        description: remedy.description,
        precautions: remedy.precautions,
      });

      Alert.alert(`${remedy.name} has been bookmarked!`);
      setBookMarkText("UNBOOKMARK");
    } else {
      userRef.collection("bookmarks").doc(rem).delete();

      Alert.alert(`${remedy.name} has been removed from your bookmarks!`);
      setBookMarkText("BOOKMARK");
    }
  }

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // console.log(remedy.image);
  return (
    <View style={styles.rootContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>{remedy.name}</Text>

          <Image
            source={{ uri: remedy.image }}
            style={styles.image}
            resizeMode="contain"
            // PlaceholderContent={<ActivityIndicator />}
          />

          <View style={styles.info}>
            <View style={styles.titleRow}>
              <Text style={styles.head}>Description</Text>
              <AntDesign
                name={isDescriptionCollapsed ? "down" : "up"}
                size={24}
                onPress={() => setDescriptionCollapsed(!isDescriptionCollapsed)}
              />
            </View>

            <Collapsible collapsed={isDescriptionCollapsed}>
              <Text style={styles.desc}>{remedy.description}</Text>
            </Collapsible>
            <View style={styles.titleRow}>
              <Text style={styles.head}>Precautions</Text>
              <AntDesign
                name={isPrecautionsCollapsed ? "down" : "up"}
                size={24}
                onPress={() => setPrecautionsCollapsed(!isPrecautionsCollapsed)}
              />
            </View>

            <Collapsible collapsed={isPrecautionsCollapsed}>
              <Text style={styles.desc}>{remedy.precautions}</Text>
            </Collapsible>
          </View>
          <View style={{ alignItems: "center" }}>
            <BookMarkButton onPress={bookMarkRemedy}>
              {bookMarkText}
            </BookMarkButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default AboutRemedyScreen;

const styles = StyleSheet.create({
  rootContainer: {
    padding: 32,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.5,
  },
  titleCon: {
    alignItems: "center",
  },
  desc: {
    fontSize: 16,
    lineHeight: "24px",
  },
  head: {
    fontSize: 28,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 16,
  },
});
