// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   Image,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { db, auth } from "../../../firebase";
// import * as Haptics from "expo-haptics";

// function ViewAllRecommendationsScreen() {
//   const [recommendations, setRecommendations] = useState([]);
//   const user = auth.currentUser.uid;
//   const navigation = useNavigation();

//   const getRecommendations = async () => {
//     const userDocRef = db.collection("users").doc(user);

//     // Use the get() method to fetch the user's document
//     const userDocSnapshot = await userDocRef.get();

//     if (userDocSnapshot.exists) {
//       // Check if the document exists

//       const userData = userDocSnapshot.data();
//       const collection = userDocRef.collection("recommendedRemedies");

//       const recommendationArray = [];

//       if (userData && collection) {
//         const remediesSnapshot = await collection.get();

//         // Iterate through the documents and log the 'UserCondition' property
//         remediesSnapshot.forEach((doc) => {
//           const remedyData = doc.data();
//           if (remedyData && remedyData.UserCondition) {
//             console.log("UserCondition:", remedyData.UserCondition);
//             console.log("Id:", doc.id);
//             recommendationArray.push({
//               id: doc.id,
//               userCondition: remedyData.UserCondition,
//             });
//           }
//         });
//       }

//       setRecommendations(recommendationArray);
//       console.log(recommendations);
//     }
//   };

//   useEffect(() => {
//     getRecommendations();
//   }, []);

//   //when an item gets clicked
//   function itemSelected(item) {
//     navigation.navigate("View Symptoms Details", {
//       recommendId: item.id,
//     });
//   }

//   function lol() {
//     navigation.navigate("About Recommendation System");
//   }

//   //when x button gets clicked
//   function removeSymptom(item) {
//     Alert.alert(
//       //This is title
//       "Warning",
//       //This is body text
//       "Are you sure you want to remove this symptom?",
//       [
//         {
//           text: "Yes",
//           onPress: async () => {
//             try {
//               const collection = db
//                 .collection("users")
//                 .doc(user)
//                 .collection("recommendedRemedies");

//               // Find the document reference with the specified ID
//               const docRef = collection.doc(item.id);

//               // Delete the document
//               await docRef.delete();

//               // Fetch recommendations again after updating the Firestore collection
//               getRecommendations();

//               console.log(`Symptom with ID ${item.id} removed successfully.`);
//             } catch (error) {
//               console.error("Error removing symptom:", error);
//             }
//           },
//         },
//         {
//           text: "No",
//           onPress: () => console.log("No Pressed"),
//           style: "cancel",
//         },
//       ],
//       { cancelable: false }
//       //on clicking out side, Alert will not dismiss
//     );
//   }

//   return (
//     <>
//       <View style={styles.rootContainer}>
//         <View style={styles.container}>
//           <View style={styles.bottomSection}>
//             <FlatList
//               data={recommendations}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   onPress={() => {
//                     Haptics.ImpactFeedbackStyle.Light;
//                     Haptics.selectionAsync();
//                     itemSelected(item);
//                   }}
//                 >
//                   {/* TODO: Fix the styling later, no point in using listItemStyle */}
//                   <View style={listItemStyle.rootContainer}>
//                     <Text style={listItemStyle.Text}>{item.userCondition}</Text>
//                     <TouchableOpacity onPress={() => removeSymptom(item)}>
//                       <Image
//                         style={listItemStyle.herbImage}
//                         source={require("../../../assets/trash.jpeg")}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </View>

//         <TouchableOpacity onPress={() => lol()}>
//           <Text style={styles.buttonText}> + </Text>
//         </TouchableOpacity>
//       </View>
//     </>
//   );
// }

// const listItemStyle = StyleSheet.create({
//   rootContainer: {
//     flex: 1,
//     alignItems: "flex-start",
//     paddingTop: 20,
//     paddingBottom: 20,
//     paddingLeft: 10,
//     borderBottomWidth: 1, // Add a border width for the black line
//     borderBottomColor: "grey",
//     justifyContent: "space-between",
//     flexDirection: "row",
//   },

//   Text: {
//     fontSize: 20,
//     color: "black",
//     fontWeight: "500",
//     fontFamily: "DamascusSemiBold",
//     marginTop: 20,
//   },
//   herbImage: {
//     width: 80,
//     height: 60,
//     marginLeft: 0,
//     borderRadius: 0,
//   },
// });

// const styles = StyleSheet.create({
//   rootContainer: {
//     flex: 1,
//     alignItems: "center",
//     backgroundColor: "white",
//   },

//   container: {
//     flex: 1,
//     width: "100%",
//   },

//   bottomSection: {
//     flex: 1,
//     backgroundColor: "white",
//   },

//   buttonText: {
//     fontWeight: "bold",
//     fontSize: "90",
//     textAlign: "center",
//     color: "green",
//   },
// });

// export default ViewAllRecommendationsScreen;
