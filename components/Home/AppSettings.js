import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
} from "react-native";
import { db, auth } from "../../firebase";
import { useEffect, useState } from "react";
import { Button } from "react-native";
import BigButton from "../ui/BigButton";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "../screenWrapper";

function AppSettings() {
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
    <ScreenWrapper>
      <SafeAreaView>
        <Text style={{ textAlign: "center" }}> BOOKMARKS</Text>

        <FlatList
          data={bookmarkCollection}
          renderItem={({ item }) => (
            <View>
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
      </SafeAreaView>
    </ScreenWrapper>
  );
}

export default AppSettings;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffc2c2",
  },
  title: {
    fontSize: 18,
    marginVertical: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
  },
});
