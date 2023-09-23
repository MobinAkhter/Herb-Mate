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

  console.log(remedy.image);
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
            <Text style={styles.head}>Description</Text>
            <Text style={styles.desc}>{remedy.description}</Text>
            <Text style={styles.head}>Precautions</Text>
            <Text style={styles.desc}>{remedy.precautions}</Text>
          </View>
          <BookMarkButton
            onPress={bookMarkRemedy}
            style={{ backgroundColor: "red" }}
          >
            {bookMarkText}
          </BookMarkButton>
        </View>
      </ScrollView>
    </View>
  );
}

export default AboutRemedyScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.5, // or whatever is appropriate for your images
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  titleCon: {
    alignItems: "center",
  },
  info: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    padding: 15,
  },
  desc: {
    fontSize: 20,
  },
  head: {
    fontSize: 30,
    fontWidth: "bold",
  },
});
