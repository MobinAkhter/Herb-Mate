// This file has all the commented out code for the entire project.
// Anyone wants to reuse some of the commented out code, can copy paste from here.
// Purpose: To reduce the amount of code in each file -> improve readability

// -----------------------------------------AboutRemedyScreen.js----------------------------------
// import ImageViewer from "react-native-image-zoom-viewer";

// const loadConditions = async () => {
//   try {
//     const cacheKey = `conditions_${bp}`;
//     const cachedConditions = await AsyncStorage.getItem(cacheKey);

//     if (cachedConditions !== null) {
//       console.log(`Fetching conditions from cache for body part: ${bp}`);
//       setConditionsList(JSON.parse(cachedConditions));
//     } else {
//       console.log(`Fetching conditions from Firestore for body part: ${bp}`);
//       const con = [];
//       const querySnapshot = await col.doc(bp).collection("Conditions").get();

//       querySnapshot.forEach((doc) => {
//         const label = doc.data().name || "Default Label";
//         con.push({
//           label: label,
//           key: doc.id,
//         });
//       });

//       con.forEach((item, index) => {
//         if (!item.label || !item.value) {
//           console.error(`Missing data in item at index ${index}`, item);
//         }
//       });

//       await AsyncStorage.setItem(cacheKey, JSON.stringify(con));
//       setConditionsList(con);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// define the key for AsyncStorage
//const remedyKey = typeof rem === 'string' ? 'remedy-' + rem : null;

// userRef
//   .collection("bookmarks")
//   .doc(rem)
//   .get()
//   .then((doc) => {
//     if (doc.exists) setBookMarkText("Remove Bookmark");
//   });

{
  /* <RNPickerSelect
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
            /> */
}

// ------------------------------------------------------------------------------------------------

// -----------------------------------------NotesScreen------------------------------------------
// const note = {
//   id: doc.id,
//   herb: data.herb,
//   condition: data.condition,
//   notes: data.notes,
//   createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
// };
// return note;

// {/* {note.condition && (
//            <Text style={styles.noteDetail}>Condition: {note.condition}</Text>
//          )} */}

// -------------------------------------End of NotesScreen--------------------------------

// --------------------------------------AboutUsScreen--------------------------------------------------
{
  /* Social Media Links. This is how we can add later, when/if we create them.*/
}
{
  /* <View style={styles.section}>
        <Text style={styles.subHeader}>Follow Us</Text>
        <TouchableOpacity onPress={() => handlePress("#Instagram")}>
          <Text style={styles.link}>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("#Facebook")}>
          <Text style={styles.link}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress("#Twitter")}>
          <Text style={styles.link}>Twitter</Text>
        </TouchableOpacity>
      </View> */
}

{
  /* Philosophy Section */
}
{
  /* <View style={styles.section}>
        <Text style={styles.subHeader}>Our Philosophy</Text>
        <Text style={styles.text}>
          We believe in holistic health where mind, body, and environment
          coalesce to form a balanced well-being.
        </Text>
      </View> */
}

{
  /* Features Section */
}
{
  /* <View style={styles.section}>
        <Text style={styles.subHeader}>Features</Text>
        <Text style={styles.text}>
          Explore herbs, discover their uses, and educate yourself on how to use
          them to improve your health.
        </Text>
      </View> */
}

// Function to handle external links; not needed for now, can uncomment later
//   const handlePress = (url) => {
//     Linking.canOpenURL(url).then((supported) => {
//       if (supported) {
//         Linking.openURL(url);
//       } else {
//         console.log(`Don't know how to open URL: ${url}`);
//       }
//     });
//   };

//Profile header
{
  /* <View style={styles.header}>
        <Icon
          style={styles.backIcon}
          name="arrow-left"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>User Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              padding: 9,
              textAlign: "center",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View> */
}
{
  /* <RNButton color="white" title={"Logout"} onPress={handleLogout} /> */
}

//Original search result flat lists
{
  /* <View style={styles.header}>
        <Text style={styles.title}>Remedies</Text>
      </View>

      <FlatList
        data={remedies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              console.log("Navigating with remedy:", item);
              navigation.navigate("Remedy Details", { rem: item.key });
            }}
          >
            <Image
              source={
                item.image && item.image.length > 0
                  ? { uri: item.image[0] }
                  : require("../assets/leaf_icon.jpeg")
              }
              style={styles.herbImage}
            />
            <Text style={styles.herbName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.header}>
        <Text style={styles.title}>Conditions</Text>
      </View>

      <FlatList
        data={conditions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => {
              console.log("Navigating with remedy:", item);
              navigation.navigate("Remedies", {
                bp: item.bp,
                con: item.name,
              });
              searchCondition(item.name)
              console.log("Navigation to condition ", item.name)
            }}
          >
            <View style={styles.bpIcon}>
              <MIcon size={10} {...iconMapper[removeSpace(item.bp)]} />
            </View>
            <Text style={styles.herbName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      /> */
}

// App.js Stuff taken out from Drawer Navigation
{
  /* <Drawer.Screen
        name="My Notes"
        component={NotesScreen}
        options={{
          headerTitle: "Notes",
          headerStyle: { backgroundColor: "#35D96F" },
          headerTintColor: "white",
          drawerIcon: ({ color, size }) => (
            <Icon name="document-text-outline" color={color} size={size} />
          ),
        }}
      /> */
}
{
  /* <Drawer.Screen
        name="Preparation"
        component={PreparationStack}
        options={{
          headerTitle: "Herb Preparation",
          headerStyle: { backgroundColor: "#35D96F" },
          headerTintColor: "white",
          drawerIcon: ({ color, size }) => (
            <Icon name="eyedrop-outline" color={color} size={size} />
          ),
        }}
      /> */
}

// ---------------------------------------------------WELCOME SCREEN SHOW LESS SHOW MORE BUTTON
// const renderFooter = () => {
//   if (!showAll && bodyParts.length > 4) {
//     return (
//       <TouchableOpacity
//         onPress={() => setShowAll(true)}
//         style={styles.disclosureButton}
//       >
//         <Text style={styles.disclosureButtonText}>See More</Text>
//       </TouchableOpacity>
//     );
//   } else if (showAll) {
//     return (
//       <TouchableOpacity
//         onPress={() => setShowAll(false)}
//         style={styles.disclosureButton}
//       >
//         <Text style={styles.disclosureButtonText}>See Less</Text>
//       </TouchableOpacity>
//     );
//   }
//   return null;
// };
// styling for the above code
//  disclosureButton: {
//     marginLeft: 125,
//     width: "auto",
//     height: 50,
//     backgroundColor: "#35D96F",
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 15,
//   },

// disclosureButtonText: {
//   color: "white",
//   fontSize: 16,
// },

// ---------------------------------------RemedyListScreen------------------------------------
// tag: {
//     backgroundColor: "#e0e0e0",
//     borderRadius: 15,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     marginRight: 5,
//     marginBottom: 5,
//     fontSize: 12,
//   },
// tagContainer: {
//   flexDirection: "row",
//   flexWrap: "wrap",
//   marginBottom: 10,
// },

// ----------------------------------------AboutRemedyScreen------------------------------------
//TODO: I was playing around with tts audio speed, this was for that, didn't work, would be cool to make it work.
{
  /* <Slider
                style={{
                  width: 150,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                minimumValue={0.5}
                maximumValue={2.0}
                value={speechRate}
                onValueChange={(value) => setSpeechRate(value)}
              /> */
}

// -------------------------------
// const handleSpeak = () => {
//   if (isSpeaking) {
//     Speech.stop();
//   } else {
//     Speech.speak(spokenText || text, {
//       onDone: () => {
//         setSpokenText("");
//         setIsSpeaking(false);
//       },
//       onStopped: () => {
//         setSpokenText(text);
//       },
//     });
//     setIsSpeaking(true);
//   }
// };

// const handleStop = () => {
//   Speech.stop();
//   setIsSpeaking(false);
// };

```
This is the styling for note picker for android devices.
// inputAndroid: {
//   fontSize: 16,
//   paddingHorizontal: 10,
//   paddingVertical: 8,
//   borderWidth: 0.5,
//   borderColor: "purple",
//   borderRadius: 8,
//   color: "black",
//   paddingRight: 30, // to ensure the text is never behind the icon
// },

```;

// --------------------------------------------ABOUTUSSCREEN------------------------------------
// link: {
//   color: "#34A853",
//   textDecorationLine: "underline",
//   marginBottom: 5,
// },

// --------------------------------------------BookmarkScreen-----------------------------------
//logoutText: {
//   color: "white",
// },

// title: {
//   fontSize: 20,
//   fontWeight: "bold",
//   color: "white",
// },

// bookmarksText: {
//   textAlign: "center",
//   color: "white",
//   fontSize: 18,
//   fontWeight: "bold",
// },

// topSection: {
//   backgroundColor: "#35D96F",
//   justifyContent: "center",
//   alignItems: "center",
//   paddingHorizontal: 20,
// },

// ----------------------------------------------DataAnalyticsScreen-------------------------------
// const DATA = [
//   {
//     id: 0,
//     title: "Heart and Circulatory Health",
//   },
//   {
//     id: 1,
//     title: "Digestive Wellness",
//   },
//   {
//     id: 2,
//     title: "Women's Health",
//   },
//   {
//     id: 3,
//     title: "Well Being",
//   },
//   {
//     id: 4,
//     title: "Respiratory Health",
//   },
//   {
//     id: 5,
//     title: "Joint and Bone Health",
//   },
//   {
//     id: 5,
//     title: "Skin Condition",
//   },
//   {
//     id: 6,
//     title: "Urinary Health",
//   },
// ];

// function lolClick() {
//   navigation.navigate("RecommendedRemediesScreen");
// }

// const Item = ({ title }) => (
//   <View>
//     <Pressable style={styles.button} onPress={() => buttonClick(title)}>
//       <Text style={styles.buttonText}> {title} </Text>
//     </Pressable>
//   </View>
// );
// function buttonClick(title) {
//   if (title == "Skin Conditions") {
//     title = "Skin Condition";
//   }
//   console.log("This iss a " + title);
//   console.log(userInput);

//   navigation.navigate("Specific Question", {
//     prevQuestion: title,
//   });
// }

// ----------------------------------------------ForgotPassword-------------------------------
// header: {
//   flexDirection: "row",
//   alignItems: "center",
//   justifyContent: "flex-start",
//   paddingTop: 50,
//   paddingHorizontal: 20,
//   backgroundColor: "#35D96F",
// },
// headerTitle: {
//   fontSize: 20,
//   fontWeight: "bold",
//   color: "white",
//   marginLeft: 20,
// },
// backIcon: {
//     padding: 5,
//   },

// --------------------------------------------PreparationDetails-----------------------------
// titleRow: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   alignItems: "baseline",
// },
//titleCon: {
//   alignItems: "center",
// },

// header: {
//   fontSize: 26,
//   marginBottom: 20,
//   fontWeight: "bold",
//   backgroundColor: "#f5f5f5",
//   padding: 10,
//   borderRadius: 8,
// },

// ----------------------------------------------QuestionTier3Screen--------------------------------
// title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },

/*navigation.navigate("RecommendedRemedyScreen", {
      category: selectedCategory,
      question: prevQuestion,
      age: ageGroup,
      gender: "Both",
      rating: rating
    }); */

// const [questions, setQuestions] = useState([]);

//----------------------------------------------RecommendedRemediesScreen---------------------------
// because: {
//   justifyContent: "flex-start",
// },
// input: {
//   height: 40,
//   margin: 12,
//   borderWidth: 1,
//   padding: 10,
// },
// buttonText: {
//   color: "#1e90ff",
//   fontWeight: "bold",
//   textAlign: "center",
// },

// -----------------------------------------RecommendedRemedyReviewScreen---------------------------
// warning: {
//   fontWeight: "bold",
//   fontSize: 20,
//   textAlign: "center",
//   paddingBottom: 10,
//   fontStyle: "italic",
// },

// subTitle: {
//   fontWeight: "bold",
//   fontSize: 30,
//   textAlign: "center",
//   paddingBottom: 10,
// },

// -------------------------------------RecommendedRemedyScreen---------------------------

/**
  <Text>{category}</Text>
  <Text>{question}</Text>
  <Text>{age}</Text>
  <Text>{gender}</Text>
  <Text>{rating}</Text>
  <Text>Your recommended remedy is {pred}</Text> */

// --------------------------------RemediesBarGraphScreen------------------------
// title: {
//   fontSize: 20,
//   fontWeight: "bold",
//   marginBottom: 8,
// },

// --------------------------------SearchResultsScreen------------------------
// title: {
//   fontSize: 25,
//   fontWeight: "bold",
// },
// header: {
//   alignItems: "center",
//   width: Dimensions.get("window").width,
//   height: 40,
//   backgroundColor: "#dfede0",
//   bottomBorderWidth: "0.5px",
//   borderColor: "black",
// },

// list: {},
// container: {
//   flex: 1,
// },

// var width = Dimensions.get("window").width; //full width
// var height = Dimensions.get("window").height; //full height
// var rems = db.collectionGroup("Remedies");

// ------------------------------UserProfileScreen------------------------

// const textInputstyles = StyleSheet.create({
//   textInput: {
//     borderColor: "black",
//     borderWidth: 1,
//     padding: 10,
//     marginBottom: 10,
//     width: "90%",
//   },
// });

// title: {
//   flex: 1, // Add flex property
//   fontSize: 20,
//   fontWeight: "bold",
//   color: "white",
//   marginLeft: 40,
//   textAlign: "center",
// },

// header: {
//   flexDirection: "row",
//   alignItems: "center",
//   paddingTop: 50,
//   justifyContent: "space-between",
//   backgroundColor: "#35D96F",
//   padding: 16,
// },

//------------------------------ViewAllRecommendationsScreen------------------------
// continueButton: {
//   borderRadius: 10,
//   borderWidth: 1.5,
//   marginTop: 10,
//   justifyContent: "center",
//   alignItems: "center",
//   padding: 10,
//   borderColor: "black",
// },

// logoutText: {
//   color: "white",
// },

// title: {
//   fontSize: 20,
//   fontWeight: "bold",
//   color: "white",
// },

// bigButtonContainer: {
//   alignItems: "center",
// },
// iconContainer: {
//   justifyContent: "center",
//   alignItems: "center",
// },

// topSection: {
//   backgroundColor: "#35D96F",
//   justifyContent: "center",
//   alignItems: "center",
//   paddingHorizontal: 20,
// },
// bookmarksText: {
//   textAlign: "center",
//   color: "white",
//   fontSize: 18,
//   fontWeight: "bold",
// },

// header: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   alignItems: "center",
//   width: "100%",
//   backgroundColor: "#35D96F",
// },

//---------------------------------------------ViewRecommendationDetailScreen--------------------------------

// warning: {
//   fontWeight: "bold",
//   fontSize: 20,
//   textAlign: "center",
//   paddingBottom: 10,
//   fontStyle: "italic",
// },
// continueButton: {
//   borderRadius: 10,
//   borderWidth: 1.5,
//   marginTop: 10,
//   justifyContent: "center",
//   alignItems: "center",
//   padding: 10,
//   borderColor: "#1e90ff",
// },
// buttonText: {
//   fontWeight: "bold",
//   textAlign: "center",
//   color: "#1e90ff",
// },

// title: {
//   textAlign: "center",
//   paddingBottom: 190,
//   color: "#32cd32",
// },

/**
       * 
       *  <Text style={styles.subTitle}>Question: {recommendation.Question}</Text>
            <Text style={[styles.subTitle, { color: 'grey' }]}>Your Condition: {recommendation.UserCondition}</Text>
            <Text style={[styles.subTitle, { color: 'purple' }]}>Your Biological Sex: {recommendation.Sex}</Text>
            <Text style={[styles.subTitle, { color: 'red' }]}>How severe is your current condition?: {recommendation.Severity}</Text>
            <Text style={[styles.subTitle, { color: 'green' }]}>Your recommended Remedy: {recommendation.Remedy}</Text>
       */
