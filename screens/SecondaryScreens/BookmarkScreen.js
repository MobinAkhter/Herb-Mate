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
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";

const BookmarkScreen = () => {
  const navigation = useNavigation();
  const user = auth.currentUser.uid;
  const userRef = doc(db, "users", user); // Adjusted for Firestore modular SDK
  const [bookmarkCollection, setBookmarkCollection] = useState([]);

  const fetchBookmarks = async () => {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      setBookmarkCollection(userData.bookmarks || []);
    } else {
      setBookmarkCollection([]);
    }
  };

  const clickX = (name) => {
    Alert.alert(
      "Warning",
      `Are you sure you want to remove ${name} from your bookmarks?`,
      [
        { text: "Yes", onPress: () => removeBookmark(name) },
        {
          text: "No",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const removeBookmark = async (remedyName) => {
    const newBookmarks = bookmarkCollection.filter(
      (item) => item.name !== remedyName
    );
    await updateDoc(userRef, { bookmarks: newBookmarks });
    fetchBookmarks(); // Refresh bookmarks after removal
  };

  useEffect(() => {
    // Listen for real-time updates
    const unsubscribe = onSnapshot(userRef, (doc) => {
      const userData = doc.data();
      setBookmarkCollection(userData?.bookmarks || []);
    });

    return unsubscribe; // Detach listener on unmount
  }, []);

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.rootContainer}>
        <FlatList
          data={bookmarkCollection}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Remedy Details", { rem: item })
              }
            >
              <View style={styles.listItemContainer}>
                <Image
                  source={
                    item.image && item.image[0]
                      ? { uri: item.image[0] }
                      : require("../../assets/leaf_icon.jpeg")
                  }
                  style={styles.listItemHerbImage}
                />
                <Text style={styles.listItemText}>{item.name}</Text>
                <TouchableOpacity
                  style={styles.listItemXButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    clickX(item.name);
                  }}
                >
                  <AntDesign name="delete" size={24} color="#B0B0B0" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No bookmarks yet.</Text>
            </View>
          )}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  listItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  listItemXButton: {
    padding: 10,
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: "#E8E8E8",
  },
  listItemHerbImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
  },
});

export default BookmarkScreen;
