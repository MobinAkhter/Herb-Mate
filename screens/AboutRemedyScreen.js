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
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Collapsible from "react-native-collapsible";
import { AntDesign } from "@expo/vector-icons";
import { db, auth } from "../firebase";
import BookMarkButton from "../components/ui/BookmarkButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";
import RNPickerSelect from "react-native-picker-select";
import RemedyViewModel from '../ViewModels/RemedyViewModel';
// import ImageViewer from "react-native-image-zoom-viewer";

import "firebase/firestore";

function AboutRemedyScreen({ route }) {
  const navigation = useNavigation();

  const { rem, bp } = route.params;
  const [remedy, setRemedy] = useState({});
  const [bookMarkText, setBookMarkText] = useState();
  const [isLoading, setIsLoading] = useState(true);

  // Creating the collapsable state for description and precautions and properties
  const [isDescriptionCollapsed, setDescriptionCollapsed] = useState(true);
  const [isPrecautionsCollapsed, setPrecautionsCollapsed] = useState(true);
  const [isPropertiesCollapsed, setPropertiesCollapsed] = useState(true);

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
  


  //saves notes function
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

  useEffect(() => {
    checkBookMark()
  },[])

 function checkBookMark()
 {
  const userDoc = userRef;
  userDoc.get()
    .then((doc) => {
      if (doc.exists) {
        // Get the user's current bookmarks array (if it exists)
        const currentBookmarks = doc.data().bookmarks || [];

        // Check if the current remedy is already bookmarked
        const isRemedyBookmarked = currentBookmarks.some(item => item.name === remedy);

        if (isRemedyBookmarked) {
          console.log("its in")
          setBookMarkText("UNBOOKMARK")
        }
        else{
          setBookMarkText('BOOKMARK')
        }
      }
    }
    )
 }
 
  //bookmark remedy function
  function bookMarkRemedy() {
    // Reference to the user's document
  const userDoc = userRef;

  // Update the user's document to add or remove the bookmarked remedy from the array
  userDoc.get()
    .then((doc) => {
      if (doc.exists) {
        // Get the user's current bookmarks array (if it exists)
        const currentBookmarks = doc.data().bookmarks || [];

        // Check if the current remedy is already bookmarked
        const remedyIndex = currentBookmarks.indexOf(rem);

        if (remedyIndex === -1) {
          // If the remedy is not bookmarked, add it to the bookmarks array
          currentBookmarks.push(rem);
          // Update the user's document to store the updated bookmarks array
          userDoc.update({ bookmarks: currentBookmarks })
            .then(() => {
              Alert.alert(`${remedy.name} has been bookmarked!`);
              setBookMarkText("UNBOOKMARK");
            })
            .catch((error) => {
              console.error("Error adding bookmark:", error);
            });
        } else {
          // If the remedy is already bookmarked, remove it from the bookmarks array
          currentBookmarks.splice(remedyIndex, 1);
          // Update the user's document to store the updated bookmarks array
          userDoc.update({ bookmarks: currentBookmarks })
            .then(() => {
              Alert.alert(`${remedy.name} has been removed from your bookmarks!`);
              setBookMarkText("BOOKMARK");
            })
            .catch((error) => {
              console.error("Error removing bookmark:", error);
            });
        }
      } else {
        console.error("User document does not exist.");
      }
    })
    .catch((error) => {
      console.error("Error checking user document:", error);
    });
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
      <ScrollView showsVerticalScrollIndicator={false}>
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
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
  },
  wrapper: {
    height: 200,
  },
  buttonWrapper: {
    // backgroundColor: "rgba(255, 255, 255, 0.5)",
    paddingHorizontal: 10,
  },
  swipeButton: {
    color: "white",
    fontSize: 70,

    // fontWeight: "bold",
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
  },
  head: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 16,
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
});
