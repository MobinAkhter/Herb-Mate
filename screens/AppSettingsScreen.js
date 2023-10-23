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
      const querySnapshot = await userRef.collection("bookmarks").get();
      const bookmarks = [];
      querySnapshot.forEach((doc) => {
        bookmarks.push({
          ...doc.data(),
          key: doc.id,
        });
      });
      setBookmarkCollection(bookmarks);
    } catch (error) {
      console.error(error);
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
              <View style={styles.bigButtonContainer}>
                <BigButton
                  onPress={() => {
                    navigation.navigate("Remedy Details", {
                      rem: item.name,
                    });
                  }}
                >
                  <Text>{item.name}</Text>
                </BigButton>
              </View>
            )}
          ></FlatList>
        </View>
      </View>
    </View>
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
