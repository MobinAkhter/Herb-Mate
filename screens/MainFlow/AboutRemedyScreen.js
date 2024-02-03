import { useEffect, useRef, useState } from "react";
import {
  Modal,
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
  Dimensions,
  Share,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Collapsible from "react-native-collapsible";
import { AntDesign } from "@expo/vector-icons";
import { db, auth } from "../../firebase";
import BookMarkButton from "../../components/ui/BookmarkButton";
import FloatingScrollButton from "../../components/ui/FloatingScrollButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "react-native-swiper";
import RNPickerSelect from "react-native-picker-select";
import * as Speech from "expo-speech"; // This is better cause the other lib wanted me to link it or something. Extra steps for expo managed workflow.
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "firebase";
import "firebase/firestore";

function HerbScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "herbInfo", title: "About Remedy" },
    { key: "herbDetails", title: "Herb Details" },
  ]);
  const [remedy, setRemedy] = useState({});
  // const [bookMarkText, setBookMarkText] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { rem } = route.params || {};
  const remediesFirebase = db.collection("Remedies");
  const [remediesList, setRemediesList] = useState([]);

  const col = db.collection("BodyParts");
  // const [conditionsList, setConditionsList] = useState([]);

  useEffect(() => {
    // loadConditions();
    AsyncStorage.clear(); // This is important if you dont see the images, apparently the cache is messing up with image property.
    setIsLoading(true);
    // define the key for AsyncStorage
    const remedyKey = "remedy-" + rem.id;

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
        .doc(rem.id)
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
        console.log("This is the remedies list", remediesList);
      })
      .catch((error) => {
        console.error("Error fetching remedies list:", error);
      });
  }, [rem]);

  const AboutRemedyTab = () => {
    return (
      <AboutRemedyScreen
        remedy={remedy}
        remediesList={remediesList}
        route={route}
        navigation={navigation}
      />
    );
  };
  const HerbDetailsTab = () => {
    return <HerbDetails interactions={remedy.interactions} />;
  };
  const renderScene = SceneMap({
    herbInfo: AboutRemedyTab,
    herbDetails: HerbDetailsTab,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "green" }}
      style={{ backgroundColor: "white" }}
      labelStyle={{ color: "black" }}
    />
  );

  const initialLayout = { width: Dimensions.get("window").width };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={renderTabBar}
    />
  );
}

const HerbDetails = ({ interactions }) => {
  const [isPressed, setIsPressed] = useState(false);
  const scrollViewRef = useRef();
  const [voices, setVoices] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  const preferredVoices = [
    { name: "Rishi", identifier: "com.apple.voice.compact.en-IN.Rishi" },
    { name: "Samantha", identifier: "com.apple.voice.compact.en-US.Samantha" },
    { name: "Daniel", identifier: "com.apple.voice.compact.en-GB.Daniel" },
    { name: "Karen", identifier: "com.apple.voice.compact.en-AU.Karen" },
    { name: "Moira", identifier: "com.apple.voice.compact.en-IE.Moira" },
  ];
  const [selectedVoice, setSelectedVoice] = useState(
    preferredVoices[2].identifier
  );
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState("");

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  const { overview, ...otherInteractions } = interactions || {};
  const hasDetails =
    overview ||
    (otherInteractions && Object.keys(otherInteractions).length > 0);

  const speak = (text, rate = 1.0) => {
    if (isSpeaking) {
      Speech.stop();
      setIsPaused(true);
    } else {
      Speech.speak(text, {
        rate,
        voice: selectedVoice,
        onStart: onSpeechStart,
        onDone: onSpeechDone,
      });
      setIsSpeaking(true);
      setIsPaused(false);
      setSpokenText(text);
    }
  };
  const stopSpeech = () => {
    Speech.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const resumeSpeech = () => {
    if (isPaused) {
      Speech.speak(spokenText, {
        rate: speechRate,
        voice: selectedVoice,
        onStart: onSpeechStart,
        onDone: onSpeechDone,
      });
      setIsSpeaking(true);
      setIsPaused(false);
    }
  };

  const onSpeechStart = () => {
    setIsSpeaking(true);
  };

  const onSpeechDone = () => {
    setIsSpeaking(false);
    setIsPaused(false);
    setSpokenText("");
  };
  const handleVoiceChange = (newVoiceIdentifier) => {
    Speech.stop();
    setSelectedVoice(newVoiceIdentifier);
  };
  useEffect(() => {
    let isMounted = true;
    Speech.getAvailableVoicesAsync().then((availableVoices) => {
      if (isMounted) {
        // Filter only the 5 preferred voices. Daniel will be the initial voice, cause that guy sounds best imo.
        const filteredVoices = availableVoices.filter((voice) =>
          preferredVoices.some(
            (pVoice) => pVoice.identifier === voice.identifier
          )
        );
        setVoices(filteredVoices);
      }
    });

    return () => {
      isMounted = false;
      Speech.stop();
    };
  }, []);

  return hasDetails ? (
    <>
      <ScrollView
        style={{ flex: 1, margin: 24, marginBottom: 0 }}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
      >
        {overview && (
          <View style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.herbDetailHeader}>Interactions:</Text>
              <TouchableOpacity
                style={{ marginLeft: 80 }}
                onPress={
                  isSpeaking
                    ? stopSpeech
                    : () => speak(composeTextToSpeak(interactions), speechRate)
                }
              >
                <Icon
                  name={isSpeaking ? "stop" : "play"}
                  size={30}
                  color="#000"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={resumeSpeech} disabled={!isPaused}>
                {/* <Icon name="play" size={30} color="#000" /> */}
              </TouchableOpacity>

              <RNPickerSelect
                onValueChange={(value) => handleVoiceChange(value)}
                items={voices.map((voice) => ({
                  label: voice.name,
                  value: voice.identifier,
                }))}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderWidth: 1,
                    borderColor: "gray",
                    borderRadius: 4,
                    color: "black",
                    paddingRight: 30, // to ensure the text is never behind the icon
                  },
                }}
                value={selectedVoice}
                placeholder={{ label: "Select a voice...", value: null }}
              />
            </View>
            <Text style={styles.interactionHeader}>
              {capitalizeFirstLetter("overview")}:
            </Text>
            <Text style={styles.interactionContent}>
              {typeof overview === "string" ? overview : overview.text}
            </Text>
            {/* Render evidence if it exists */}
            {overview.evidence && (
              <Text style={styles.evidenceText}>
                Clinical Evidence: {overview.evidence}
              </Text>
            )}
          </View>
        )}

        {Object.entries(otherInteractions).map(([key, value]) => {
          const content = typeof value === "string" ? value : value.text;
          const evidence = typeof value === "object" ? value.evidence : null;

          return (
            <View key={key} style={{ marginBottom: 20 }}>
              <Text style={styles.interactionHeader}>
                {capitalizeFirstLetter(key)}:
              </Text>
              <Text style={styles.interactionContent}>{content}</Text>
              {evidence && (
                <Text style={styles.evidenceText}>
                  Clinical Evidence: {evidence}
                </Text>
              )}
            </View>
          );
        })}
      </ScrollView>
      <FloatingScrollButton scrollViewRef={scrollViewRef} />
    </>
  ) : (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Image
        source={require("../../assets/nuh.png")}
        style={styles.interactionContent}
        resizeMode="cover"
      />
    </View>
  );
};

// TODO: Provide user with option to resume from the same place they stopped. Let them increase audio speed.
// TODO: Instad of the same play button becoming pause button, have different buttons.
function composeTextToSpeak(interactions) {
  let textToSpeak = "Interactions: ";

  // Add the overview text, if it exists.
  if (interactions.overview) {
    textToSpeak += `\nOverview: ${interactions.overview}`;
  }

  // Loop through each interaction.
  for (const [key, value] of Object.entries(interactions)) {
    if (key !== "overview") {
      // Check if the value is a string and not empty.
      if (typeof value === "string" && value.trim() !== "") {
        textToSpeak += `\n${capitalizeFirstLetter(key)}: ${value}`;
      }
      // If it's an object with text and evidence properties.
      else if (typeof value === "object") {
        if (value.text && value.text.trim() !== "") {
          textToSpeak += `\n${capitalizeFirstLetter(key)}: ${value.text}`;
        }
        if (value.evidence && value.evidence.trim() !== "") {
          textToSpeak += `\nClinical Evidence for ${capitalizeFirstLetter(
            key
          )}: ${value.evidence}`;
        }
      }
    }
  }

  return textToSpeak;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function AboutRemedyScreen({ remedy, navigation, remediesList }) {
  const route = useRoute();
  const { rem } = route.params || {};
  const { herbDetail } = route.params;

  const [selectedRemedy, setSelectedRemedy] = useState(rem);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDescriptionCollapsed, setDescriptionCollapsed] = useState(true);
  const [isPrecautionsCollapsed, setPrecautionsCollapsed] = useState(true);
  const [isPropertiesCollapsed, setPropertiesCollapsed] = useState(true);
  const [isDosageCollapsed, setDosageCollapsed] = useState(true);
  const scrollViewRef = useRef();

  const [isPressed, setIsPressed] = useState(false);

  const [selectedCondition, setSelectedCondition] = useState();
  const [notes, setNotes] = useState("");

  const [bookMarkText, setBookMarkText] = useState("Bookmark");
  const user = auth.currentUser.uid;

  const userRef = db.collection("users").doc(user);

  //TODO: Put this in components and reuse it

  const shareHerbDetails = async () => {
    let message = `Check out this herb: ${remedy.name}.\n\n`;

    if (remedy.description) {
      message += `Description: ${remedy.description}\n`;
    }

    if (remedy.properties) {
      message += `Properties: ${remedy.properties}\n`;
    }

    if (remedy.precautions) {
      message += `Precautions: ${remedy.precautions}\n`;
    }

    console.log("Sharing Message: ", message);

    //TODO: If we want to share dosage, logic should be updated since dosage is an array.
    // Did not implement this, cause why give the message recipient all this info. Download the app 🤷🏻‍♂️

    try {
      const result = await Share.share({
        message: message,
        title: "Learn about ${remedy.name}",
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type: ", result.activityType);
        } else {
          // alert("Thanks for sharing!");
          // These alerts don't look good to me based on UX
        }
      } else if (result.action === Share.dismissedAction) {
        // alert("Share cancelled.");
      }
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
    if (rem) {
      setSelectedRemedy(rem);
    }
  }, [rem]);
  const openModalWithSelectedRemedy = () => {
    setSelectedRemedy(rem);
    setModalVisible(true);
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={() => shareHerbDetails(selectedRemedy)}
          >
            <SimpleLineIcons name="share" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openModalWithSelectedRemedy}>
            <SimpleLineIcons name="note" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, selectedRemedy]);

  //TODO: This does not work on Herb Details tab. FIX ME
  const saveNotes = () => {
    console.log("Save notes got executed");
    if (selectedRemedy && (selectedCondition || notes)) {
      const userNotesRef = userRef.collection("notes").doc(selectedRemedy);
      userNotesRef
        .set(
          {
            herb: selectedRemedy,
            notes: notes,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        )
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
    checkBookMark();
  }, []);

  function checkBookMark() {
    const userDoc = userRef;
    userDoc.get().then((doc) => {
      if (doc.exists) {
        // Get the user's current bookmarks array (if it exists)
        const currentBookmarks = doc.data().bookmarks || [];

        // Check if the current remedy is already bookmarked
        const isRemedyBookmarked = currentBookmarks.some(
          (item) => item.name === remedy
        );

        if (isRemedyBookmarked) {
          console.log("its in");
          setBookMarkText("Remove Bookmark");
        } else {
          setBookMarkText("Bookmark");
        }
      }
    });
  }

  //bookmark remedy function
  function bookMarkRemedy() {
    const userDoc = userRef;

    userDoc
      .get()
      .then((doc) => {
        if (doc.exists) {
          const currentBookmarks = doc.data().bookmarks || [];
          // Define remedyIndex in the scope of the bookMarkRemedy function
          const remedyIndex = currentBookmarks.findIndex(
            (item) => item.name === rem.name
          );

          if (remedyIndex === -1) {
            currentBookmarks.push(rem);
            userDoc.update({ bookmarks: currentBookmarks }).then(() => {
              Alert.alert(`${rem.name} has been bookmarked!`);
              setBookMarkText("Remove Bookmark");
            });
          } else {
            currentBookmarks.splice(remedyIndex, 1);
            userDoc.update({ bookmarks: currentBookmarks }).then(() => {
              Alert.alert(`${rem.name} has been removed from your bookmarks!`);
              setBookMarkText("Bookmark");
            });
          }
        } else {
          throw new Error("User document does not exist.");
        }
      })
      .catch((error) => {
        console.error("Error updating bookmarks:", error);
      });
  }

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
            {remedy.image.map((imageUri, index) => (
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </Swiper>

          {/* <ImageViewer
              style={{ flex: 1 }}
              imageUrls={remedy.image.map((uri) => ({ url: uri }))}
              renderIndicator={() => null}
            /> */}

          <View style={styles.info}>
            {remedy.description && remedy.description.trim().length > 0 && (
              <>
                <View style={[styles.titleRow, { marginTop: 10 }]}>
                  <Text style={styles.head}>Description</Text>
                  <AntDesign
                    name={isDescriptionCollapsed ? "down" : "up"}
                    size={24}
                    onPress={() =>
                      setDescriptionCollapsed(!isDescriptionCollapsed)
                    }
                    style={{
                      paddingHorizontal: 5,
                    }}
                  />
                </View>
                <Collapsible collapsed={isDescriptionCollapsed}>
                  <Text style={styles.desc}>{remedy.description}</Text>
                </Collapsible>
                <View style={styles.divider} />
              </>
            )}

            {/* Adding properties section for herbs */}
            {remedy.properties && remedy.properties.trim().length > 0 && (
              <>
                <View style={styles.titleRow}>
                  <Text style={styles.head}>Properties</Text>
                  <AntDesign
                    name={isPropertiesCollapsed ? "down" : "up"}
                    size={24}
                    onPress={() =>
                      setPropertiesCollapsed(!isPropertiesCollapsed)
                    }
                    style={{
                      paddingHorizontal: 5,
                    }}
                  />
                </View>
                <Collapsible collapsed={isPropertiesCollapsed}>
                  <Text style={styles.desc}>{remedy.properties}</Text>
                </Collapsible>
                <View style={styles.divider} />
              </>
            )}
            {remedy.precautions && remedy.precautions.trim().length > 0 && (
              <>
                <View style={styles.titleRow}>
                  <Text style={styles.head}>Precautions</Text>
                  <AntDesign
                    name={isPrecautionsCollapsed ? "down" : "up"}
                    size={24}
                    onPress={() =>
                      setPrecautionsCollapsed(!isPrecautionsCollapsed)
                    }
                    style={{
                      paddingHorizontal: 5,
                    }}
                  />
                </View>
                <Collapsible collapsed={isPrecautionsCollapsed}>
                  <Text style={styles.desc}>{remedy.precautions}</Text>
                </Collapsible>
                <View style={styles.divider} />
              </>
            )}
            {/* Adding dosage section for herbs */}
            {remedy.dosage && remedy.dosage.length > 0 && (
              <>
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
                  <TouchableOpacity
                    style={styles.prepBlock}
                    onPress={() => {
                      navigation.navigate("Preparation Screen");
                    }}
                  >
                    <Text>
                      For information on how to prepare herbs, visit{" "}
                      <Text style={styles.prepLink}>preparations</Text>
                    </Text>
                  </TouchableOpacity>
                </Collapsible>
                <View style={styles.divider} />
              </>
            )}
          </View>

          <View style={{ alignItems: "center" }}>
            <BookMarkButton onPress={bookMarkRemedy}>
              {bookMarkText}
            </BookMarkButton>
          </View>
        </View>
      </ScrollView>
      <FloatingScrollButton scrollViewRef={scrollViewRef} />
    </View>
  );
}
export default HerbScreen;

const styles = StyleSheet.create({
  rootContainer: {
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 24,
    // padding: 24,
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
  },
  image: {
    width: 400,
    height: undefined,
    aspectRatio: 1.5,
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

  divider: {
    borderBottomColor: "gainsboro",
    borderBottomWidth: 1,
    marginVertical: 9,
  },
  herbDetailHeader: {
    fontWeight: "bold",
    fontSize: 22,
    marginVertical: 10,
  },
  interactionHeader: {
    fontWeight: "bold",
    fontSize: 16,
  },
  interactionContent: {
    fontSize: 14,
    width: "100%",
    flex: 1,
  },
  evidenceText: {
    fontStyle: "italic",
    fontSize: 14,
    marginTop: 10,
  },
  prepBlock: {
    marginTop: 15,
  },
  prepLink: {
    textDecorationLine: "underline",
    color: "blue",
  },
});
