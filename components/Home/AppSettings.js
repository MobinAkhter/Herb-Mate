import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { db, auth } from "../../firebase";
import { useEffect, useState } from "react";
import BigButton from "../ui/BigButton";
import { useNavigation } from "@react-navigation/native";

function AppSettings() {
  const navigation = useNavigation();
  const user = auth.currentUser.uid;
  const userRef = db.collection("users").doc(user);
  const [bookmarkCollection, setBookmarkCollection] = useState([]);

  const windowHeight = Dimensions.get("window").height;
  const topSectionHeight = windowHeight * 0.08;

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
    <View style={styles.container}>
      <View style={[styles.topSection, { height: topSectionHeight }]}>
        <Text style={styles.bookmarksText}>Bookmarks</Text>
      </View>
      <View style={styles.bottomSection}>
        <FlatList
          data={bookmarkCollection}
          renderItem={({ item }) => (
            <View style={styles.bigButtonContainer}>
              <BigButton
                onPress={() => {
                  navigation.navigate("AboutRemedy", {
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
  );
}

export default AppSettings;

const styles = StyleSheet.create({
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
});
