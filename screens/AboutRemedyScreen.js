import { useEffect, useRef, useState } from "react";
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
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Collapsible from "react-native-collapsible";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { db, auth } from "../firebase";
import BookMarkButton from "../components/ui/BookmarkButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";
import RNPickerSelect from "react-native-picker-select";
// import ImageViewer from "react-native-image-zoom-viewer";

import "firebase/firestore";

function AboutRemedyScreen({ route }) {
  const navigation = useNavigation();

  const { rem, bp } = route.params;
  const [remedy, setRemedy] = useState({});
  const [bookMarkText, setBookMarkText] = useState("Bookmark");
  const [isLoading, setIsLoading] = useState(true);

  // Creating the collapsable state for description and precautions and properties
  const [isDescriptionCollapsed, setDescriptionCollapsed] = useState(true);
  const [isPrecautionsCollapsed, setPrecautionsCollapsed] = useState(true);
  const [isPropertiesCollapsed, setPropertiesCollapsed] = useState(true);
  const [isDosageCollapsed, setDosageCollapsed] = useState(true);

  const [isPressed, setIsPressed] = useState(false);

  // access firestore
  const remediesFirebase = db.collection("Remedies");
  const user = auth.currentUser.uid;
  const userRef = db.collection("users").doc(user);

  // adding the states required for notes functionality
  const [remediesList, setRemediesList] = useState([]);
  const [selectedRemedy, setSelectedRemedy] = useState(rem);
  const col = db.collection("BodyParts");
  const [modalVisible, setModalVisible] = useState(false);
  const [conditionsList, setConditionsList] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState();
  const [notes, setNotes] = useState("");

  const scrollViewRef = useRef();
  const loadConditions = async () => {
    try {
      const cacheKey = `conditions_${bp}`;
      const cachedConditions = await AsyncStorage.getItem(cacheKey);

      if (cachedConditions !== null) {
        console.log(`Fetching conditions from cache for body part: ${bp}`);
        setConditionsList(JSON.parse(cachedConditions));
      } else {
        console.log(`Fetching conditions from Firestore for body part: ${bp}`);
        const con = [];
        const querySnapshot = await col.doc(bp).collection("Conditions").get();

        querySnapshot.forEach((doc) => {
          const label = doc.data().name || "Default Label";
          con.push({
            label: label,
            key: doc.id,
          });
        });

        con.forEach((item, index) => {
          if (!item.label || !item.value) {
            console.error(`Missing data in item at index ${index}`, item);
          }
        });

        await AsyncStorage.setItem(cacheKey, JSON.stringify(con));
        setConditionsList(con);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Putting it here right now, could be better to re use this in multiple places of the app.
  // Make it a ui component later.

  const buttonStyle = {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: isPressed ? "#dedede" : "white",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <SimpleLineIcons name="note" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // define the key for AsyncStorage
  //const remedyKey = typeof rem === 'string' ? 'remedy-' + rem : null;

  useEffect(() => {
    loadConditions();
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
    console.log("Save notes got executed");
    if (selectedRemedy && (selectedCondition || notes)) {
      const userNotesRef = userRef.collection("notes").doc(selectedRemedy);
      userNotesRef
        .set({
          herb: selectedRemedy,
          condition: selectedCondition || "Not specified",
          notes: notes,
          // createdAt: new Date().toISOString,
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
        properties: remedy.properties,
        dosage: remedy.dosage,
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
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modal}>
          <Text style={styles.header}>Add Notes</Text>
          <View>
            <RNPickerSelect
              onValueChange={(value) => setSelectedRemedy(value)}
              items={remediesList}
              placeholder={{ label: "Select a herb", value: null }}
              value={selectedRemedy}
              style={{
                inputIOS: {
                  marginTop: 10,
                  marginBottom: 10,
                  borderRadius: 8,
                  padding: 8,
                  height: 30,
                  fontSize: 18,
                  borderWidth: 1,
                  borderColor: "gray",
                },
              }}
            />

            <RNPickerSelect
              onValueChange={(value) => setSelectedCondition(value)}
              items={conditionsList}
              placeholder={{
                label: "Select a condition (optional)",
                value: null,
              }}
              value={selectedCondition}
              style={{
                inputIOS: {
                  marginTop: 10,
                  marginBottom: 10,
                  borderRadius: 8,
                  padding: 8,
                  height: 30,
                  fontSize: 18,
                  borderWidth: 1,
                  borderColor: "gray",
                },
              }}
            />
            <TextInput
              placeholder="Write your notes here"
              multiline
              numberOfLines={4}
              onChangeText={setNotes}
              value={notes}
              style={styles.input}
              accessibilityLabel="Notes input field"
            />
          </View>
          <TouchableOpacity onPress={saveNotes} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save Note</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef}>
        <View style={styles.container}>
          <Text style={styles.title}>{remedy.name}</Text>

          <Swiper
            style={styles.wrapper}
            showsButtons={true}
            loop={remedy.image.length > 1}
            showsPagination={false} // Remove this if we want to show pagination; removed it bcz of terrible styling
            buttonWrapperStyle={styles.buttonWrapper}
            nextButton={<Text style={styles.swipeButton}>›</Text>}
            prevButton={<Text style={styles.swipeButton}>‹</Text>}
          >
            {remedy.image.map((imageUri) => (
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                // resizeMode="contain"
              />
            ))}
          </Swiper>

          {/* <ImageViewer
            style={{ flex: 1 }}
            imageUrls={remedy.image.map((uri) => ({ url: uri }))}
            renderIndicator={() => null}
          /> */}

          <View style={styles.info}>
            <View style={styles.titleRow}>
              <Text style={styles.head}>Description</Text>
              <AntDesign
                name={isDescriptionCollapsed ? "down" : "up"}
                size={24}
                onPress={() => setDescriptionCollapsed(!isDescriptionCollapsed)}
                style={{
                  paddingHorizontal: 5,
                }}
              />
            </View>
            <Collapsible collapsed={isDescriptionCollapsed}>
              <Text style={styles.desc}>{remedy.description}</Text>
            </Collapsible>
            <View style={styles.divider} />
            <View style={styles.titleRow}>
              <Text style={styles.head}>Precautions</Text>
              <AntDesign
                name={isPrecautionsCollapsed ? "down" : "up"}
                size={24}
                onPress={() => setPrecautionsCollapsed(!isPrecautionsCollapsed)}
                style={{
                  paddingHorizontal: 5,
                }}
              />
            </View>
            <Collapsible collapsed={isPrecautionsCollapsed}>
              <Text style={styles.desc}>{remedy.precautions}</Text>
            </Collapsible>
            <View style={styles.divider} />
            {/* Adding properties section for herbs */}
            <View style={styles.titleRow}>
              <Text style={styles.head}>Properties</Text>
              <AntDesign
                name={isPropertiesCollapsed ? "down" : "up"}
                size={24}
                onPress={() => setPropertiesCollapsed(!isPropertiesCollapsed)}
                style={{
                  paddingHorizontal: 5,
                }}
              />
            </View>
            <Collapsible collapsed={isPropertiesCollapsed}>
              <Text style={styles.desc}>{remedy.properties}</Text>
            </Collapsible>
            <View style={styles.divider} />
            {/* Adding dosage section for herbs */}
            <View style={styles.titleRow}>
              <Text style={styles.head}>Dosage Forms</Text>
              <AntDesign
                name={isDosageCollapsed ? "down" : "up"}
                size={24}
                onPress={() => setDosageCollapsed(!isDosageCollapsed)}
                style={{
                  paddingHorizontal: 5,
                }}
              />
            </View>
            <Collapsible collapsed={isDosageCollapsed}>
              {remedy.dosage &&
                Object.entries(remedy.dosage[0]).map(
                  ([field, value], index) => (
                    <View key={index} style={styles.dosageRow}>
                      <Text style={styles.dosageField}>{field}: </Text>
                      <Text style={styles.desc}>{value}</Text>
                    </View>
                  )
                )}
            </Collapsible>
            <View style={styles.divider} />
          </View>

          <View style={{ alignItems: "center" }}>
            <BookMarkButton onPress={bookMarkRemedy}>
              {/* Tried adding an icon, did not look good, need margin, but the way code is written, its not as easy as I thought it would be. */}
              {/* <FontAwesome5 name="bookmark" style={styles.bookmarkIcon} /> */}
              {bookMarkText}
            </BookMarkButton>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => scrollViewRef.current.scrollTo({ y: 0, animated: true })}
        style={buttonStyle}
        activeOpacity={1}
      >
        <FontAwesome
          name="arrow-up"
          size={24}
          color={isPressed ? "white" : "gray"}
        />
      </TouchableOpacity>
    </View>
  );
}

export default AboutRemedyScreen;

const styles = StyleSheet.create({
  rootContainer: {
    padding: 24,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  wrapper: {
    height: 200,
    marginBottom: 16,
  },
  buttonWrapper: {
    // backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingHorizontal: 10,
  },
  swipeButton: {
    color: "white",
    fontSize: 70,
    fontWeight: "600",

    // fontWeight: "bold",
  },

  bookmarkIcon: {
    fontSize: 24,
    color: "white",
    marginRight: 4,
  },

  image: {
    width: 400,
    height: undefined,
    aspectRatio: 1.5,
  },
  titleCon: {
    alignItems: "center",
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
  },
  head: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  modal: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 26,
    marginBottom: 20,
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 20,
    height: 120,
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#FF5733",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  dosageRow: {
    // flexDirection: "row",
    paddingVertical: 5,
  },
  dosageField: {
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 24,
  },
  dosageValue: {
    marginLeft: 10,
  },
  divider: {
    borderBottomColor: "gainsboro",
    borderBottomWidth: 1,
    marginVertical: 9,
  },
});
