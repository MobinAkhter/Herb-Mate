import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebase";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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




  //when x button gets clicked
  function clickX(name)
  {
    
    Alert.alert(
      //This is title
     'Warning',
       //This is body text
     'Are you sure you want to remove ' + name + " from your bookmarks",
     [
       {text: 'Yes', onPress: () => removeBookmark(name)},
       {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
     ],
     { cancelable: false }
     //on clicking out side, Alert will not dismiss
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
        >
          
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

                <Image
              source={
                item.image && item.image[0]
                  ? { uri: item.image[0] }
                  : require("../assets/leaf_icon.jpeg")
              }
              style={listItemStyle.herbImage}/>
                
                  <Text style={listItemStyle.Text}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => clickX(item.name)}
                  >
                     <Text  style={listItemStyle.xText}>X</Text>
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

const listItemStyle = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'row',
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
    height: 100
  },

  Text: {
    fontSize: 13,
    color: "white",
    fontWeight: "bold",
    marginLeft: -20,
    marginTop: 20
  },

  xText:{
    fontSize: 25,
    marginTop: 15,
    marginRight: 13,
    color: "#ff0000",
    fontWeight: "bold",
    borderColor: "black",
  },
  herbImage: {
    width: 60,
    height: 60,
    marginLeft: -14,
    borderRadius: 25,
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
