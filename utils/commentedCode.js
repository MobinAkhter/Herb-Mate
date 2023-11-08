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
