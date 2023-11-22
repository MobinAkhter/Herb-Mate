import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import BigButton from "../components/ui/BigButton";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebase";

const AppSettingsScreen = () => {
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
        // Check if the document exists

        const userData = userDocSnapshot.data();

        if (userData && userData.bookmarks) {
          // Check if the 'bookmarks' property exists in the user's data
          // userData.bookmarks should be an array containing the bookmarked items
          setBookmarkCollection(userData.bookmarks);
        } else {
          // Handle the case where 'bookmarks' property does not exist or is empty
          setBookmarkCollection([]);
        }
      } else {
        // Handle the case where the user's document does not exist
        setBookmarkCollection([]);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchBookmarks();
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <View style={styles.rootContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Welcome")}
          style={styles.iconContainer}
        >
          {/* Add your arrow-left icon component here */}
        </TouchableOpacity>
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
                <View style={listItemStyle.rootContainer}>
                  <Text style={listItemStyle.Text}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const listItemStyle = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: "flex-start",
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 10,
    borderBottomWidth: 1, // Add a border width for the black line
    borderBottomColor: "grey",
  },

  Text: {
    fontSize: 20,
    color: "green",
    fontWeight: "bold",
  },
});

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
  topSection: {
    backgroundColor: "#35D96F",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  bookmarksText: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "white",
  },
  bigButtonContainer: {
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  logoutText: {
    color: "white",
  },
});

export default AppSettingsScreen;
