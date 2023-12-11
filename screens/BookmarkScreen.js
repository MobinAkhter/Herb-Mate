import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const BookmarkScreen = () => {
  const navigation = useNavigation();
  const user = auth.currentUser.uid;
  const userRef = db.collection("users").doc(user);
  const [bookmarkCollection, setBookmarkCollection] = useState([]);

  const fetchBookmarks = async () => {
    try {
      // Get the user's document reference
      const userDocRef = db.collection("users").doc(user);

      // Use the get() method to fetch the user's document
      const userDocSnapshot = await userDocRef.get();

      if (userDocSnapshot.exists) {
        const userData = userDocSnapshot.data();
        if (userData && userData.bookmarks) {
          setBookmarkCollection(userData.bookmarks);
        } else {
          setBookmarkCollection([]);
        }
      } else {
        setBookmarkCollection([]);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  // When cancel bookmark button gets clicked/tapped
  function clickX(name) {
    Alert.alert(
      "Warning",
      "Are you sure you want to remove " + name + " from your bookmarks",
      [
        { text: "Yes", onPress: () => removeBookmark(name) },
        {
          text: "No",
          onPress: () => console.log("No Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
      // on clicking out side, Alert will not dismiss
    );
  }

  const removeBookmark = async (remedyName) => {
    try {
      // Create a copy of the current bookmark collection
      const updatedBookmarks = [...bookmarkCollection];

      // Find the index of the bookmark with the specified name
      const indexToRemove = updatedBookmarks.findIndex(
        (item) => item.name === remedyName
      );

      // Remove the bookmark if found
      if (indexToRemove !== -1) {
        updatedBookmarks.splice(indexToRemove, 1);

        // Update the state with the new bookmark collection
        setBookmarkCollection((prevBookmarks) => [...prevBookmarks]);

        // Update the 'bookmarks' property in the user's document in Firestore
        await userRef.update({
          bookmarks: updatedBookmarks,
        });

        fetchBookmarks();

        // Optionally, you can show a message indicating successful removal
        console.log(`Bookmark for ${remedyName} removed successfully.`);
      } else {
        console.log(`Bookmark for ${remedyName} not found.`);
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchBookmarks();
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <>
      <KeyboardAwareScrollView>
        <View style={styles.rootContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={styles.iconContainer}
            ></TouchableOpacity>
          </View>
          <View style={styles.container}>
            <View style={styles.bottomSection}>
              <FlatList
                data={bookmarkCollection}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Remedy Details", {
                        rem: item,
                      });
                    }}
                  >
                    <View style={styles.listItemRootContainer}>
                      <Image
                        source={
                          item.image && item.image[0]
                            ? { uri: item.image[0] }
                            : require("../assets/leaf_icon.jpeg")
                        }
                        style={styles.listItemHerbImage}
                      />

                      <Text style={styles.listItemText}>{item.name}</Text>
                      <TouchableOpacity onPress={() => clickX(item.name)}>
                        <Text style={styles.listItemXText}>X</Text>
                      </TouchableOpacity>
                      {/* Shane had item.name, just incase something get's messed up */}
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#35D96F",
  },
  container: {
    flex: 1,
    width: "100%",
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "white",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  listItemRootContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 15,
    borderRadius: 70,
    borderColor: "black",
    borderWidth: 2,
    marginBottom: 5,
    marginTop: 5,
    backgroundColor: "#4169e1",
    height: 100,
  },
  listItemText: {
    fontSize: 13,
    color: "white",
    fontWeight: "bold",
    marginLeft: -20,
    marginTop: 20,
  },
  listItemXText: {
    fontSize: 25,
    marginTop: 15,
    marginRight: 13,
    color: "#ff0000",
    fontWeight: "bold",
    borderColor: "black",
  },
  listItemHerbImage: {
    width: 60,
    height: 60,
    marginLeft: -14,
    borderRadius: 25,
  },
});

export default BookmarkScreen;
