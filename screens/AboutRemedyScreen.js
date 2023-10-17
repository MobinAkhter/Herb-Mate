// FROM MY UNDERSTANDING IF YOU INCLUDE THE IMAGE URL IN ROOT COLLECTION "Remedies" AS A IMAGE FILED, THE IMAGES WILL SHOW UP.
import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import Collapsible from "react-native-collapsible";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { db, auth } from "../firebase";
import BookMarkButton from "../components/ui/BookmarkButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";

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

  // adding the states required for notes functionality
  const [remediesList, setRemediesList] = useState([]);
  const [selectedRemedy, setSelectedRemedy] = useState(rem);

  const [modalVisible, setModalVisible] = useState(false);
  const [condition, setCondition] = useState("");
  const [conditionsList, setConditionsList] = useState([]);
  const [notes, setNotes] = useState("");

  // define the key for AsyncStorage
  //const remedyKey = typeof rem === 'string' ? 'remedy-' + rem : null;

  useEffect(() => {
    // AsyncStorage.clear(); // This is important if you dont see the images, apparently the cache is messing up with image property.
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
      // userRef
      //   .collection("bookmarks")
      //   .doc(rem)
      //   .get()
      //   .then((doc) => {
      //     if (doc.exists) setBookMarkText("Remove Bookmark");
      //   });

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
    remediesFirebase
      .get()
      .then((querySnapshot) => {
        const remedies = querySnapshot.docs.map((doc) => ({
          label: doc.data().name,
          value: doc.id,
        }));

        if (!remedies.some((item) => item.value === rem)) {
          const currentRemedy = {
            label: remedy.name,
            value: rem,
          };
          remedies.unshift(currentRemedy);
        }

        setRemediesList(remedies);
      })
      .catch((error) => {
        console.error("Error fetching remedies list:", error);
      });
  }, []);

  const saveNotes = () => {
    if (selectedRemedy && (condition || notes)) {
      const userNotesRef = userRef.collection("notes").doc(selectedRemedy);
      userNotesRef
        .set({
          herb: selectedRemedy,
          condition: condition,
          notes: notes,
        })
        .then(() => {
          Alert.alert("Notes saved successfully!");
          setModalVisible(false);
        })
        .catch((error) => {
          console.error("Error saving notes:", error);
        });
    }
  };

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
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ fontSize: 24, marginBottom: 20 }}>Add Notes</Text>
          <DropDownPicker
            items={remediesList}
            defaultValue={rem}
            containerStyle={{ height: 40, width: "100%", marginBottom: 20 }}
            style={{ backgroundColor: "#fafafa" }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item) => setSelectedRemedy(item.value)}
          />
          <DropDownPicker
            items={conditionsList}
            placeholder="Select a condition (optional)"
            containerStyle={{ height: 40, width: "100%", marginBottom: 20 }}
            style={{ backgroundColor: "#fafafa" }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item) => setCondition(item.value)}
          />
          <TextInput
            style={{ borderColor: "gray", borderWidth: 1, marginBottom: 20 }}
            placeholder="Write your notes here"
            multiline
            numberOfLines={4}
            onChangeText={setNotes}
            value={notes}
          />
          <Button title="Save Notes" onPress={saveNotes} />
          <Button
            title="Close"
            onPress={() => setModalVisible(false)}
            color="red"
          />
        </View>
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.title}>{remedy.name}</Text>

          <Entypo
            name="write"
            size={24}
            onPress={() => setModalVisible(true)}
          />
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
