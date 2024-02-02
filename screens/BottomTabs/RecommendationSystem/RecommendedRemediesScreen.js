// import React, { useEffect, useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { db, auth } from "../../../firebase";

// function RecommendedRemediesScreen() {
//   const user = auth.currentUser.uid;
//   const userDocRef = db.collection("users").doc(user);
//   const navigation = useNavigation();
//   const gap = 5;

//   const [remedies, setRemedies] = useState([]);
//   const [conditions, setConditions] = useState([]);
//   const [lol, setLol] = useState([]);
//   const [conditionList1, setConditionsList1] = useState("");
//   const [conditionList2, setConditionsList2] = useState("");
//   const [conditionList3, setConditionsList3] = useState("");

//   //get the conditions
//   const getRemedies = () => {
//     // Use the get() method to fetch the user's document

//     // Use the get() method to fetch the user's document
//     userDocRef
//       .get()
//       .then((userDocSnapshot) => {
//         if (userDocSnapshot.exists) {
//           // Check if the document exists
//           const userData = userDocSnapshot.data();

//           // Check if the searches property of the user is at least 20
//           if (userData && userData.searches) {
//             // Remove duplicates and log the array
//             const uniqueRemedies = [...new Set(userData.searches)];
//             console.log("Remedies after removing duplicates:", uniqueRemedies);

//             // Set the state with unique values
//             setRemedies(uniqueRemedies);
//           }
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching remedies:", error);
//       });
//   };

//   //filter out to get 3 random conditions
//   const getThreeRemedies = () => {
//     const shuffled = [...remedies].sort(() => Math.random() - 0.5);
//     const randomRemedies = shuffled.slice(0, 3);
//     console.log("5 random remedies:", randomRemedies);
//     setLol(randomRemedies);

//     for (let i = 0; i < 3; i++) {
//       randomRemedy(randomRemedies[i], i);
//     }
//   };

//   //for each condition, get 3 random remedies
//   const randomRemedy = async (condition, count) => {
//     console.log(condition);
//     const documentId = condition; // Replace with the actual document ID

//     const conditionDocRef = db.collection("Conditions").doc(documentId);

//     const docSnapshot = await conditionDocRef.get();

//     if (docSnapshot.exists) {
//       const conditionData = docSnapshot.data();
//       console.log(
//         "These are the remedies for " +
//           conditionData.name +
//           conditionData.remedies
//       );

//       if (count == 0) {
//         setConditionsList1(conditionData.remedies);

//         console.log(conditionList1);
//       } else if (count == 1) {
//         setConditionsList2(conditionData.remedies);
//         console.log(conditionList2);
//       } else if (count == 2) {
//         setConditionsList3(conditionData.remedies);
//         console.log(conditionList3);
//       }
//     }
//   };

//   //for each remedy, get the object and get the name and image

//   useEffect(() => {
//     getRemedies();
//   }, []);

//   useEffect(() => {
//     // This will be called whenever the remedies state changes
//     getThreeRemedies();
//   }, [remedies]);

//   return (
//     <>
//       <View style={styles.rootContainer}>
//         <View>
//           <Text style={styles.subTitle}>
//             Because you searched for {lol[0]}:
//           </Text>

//           <FlatList
//             horizontal
//             data={conditionList1}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => {
//                   navigation.navigate("Remedy Details", {
//                     rem: item,
//                   });
//                 }}
//               >
//                 <View style={styles.button}>
//                   <Text style={styles.title}>{item}</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//             ItemSeparatorComponent={() => (
//               <View style={{ width: 10 }} /> // We can adjust the width based on our desired spacing
//             )}
//           />
//         </View>

//         <View>
//           <Text style={styles.subTitle}>
//             Because you searched for {lol[1]}:
//           </Text>

//           <FlatList
//             horizontal
//             data={conditionList2}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => {
//                   navigation.navigate("Remedy Details", {
//                     rem: item,
//                   });
//                 }}
//               >
//                 <View style={styles.button}>
//                   <Text style={styles.title}>{item}</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//             ItemSeparatorComponent={() => (
//               <View style={{ width: 10 }} /> // We can adjust the width based on our desired spacing
//             )}
//           />
//         </View>

//         <View>
//           <Text style={styles.subTitle}>
//             Because you searched for {lol[2]}:
//           </Text>

//           <FlatList
//             horizontal
//             data={conditionList3}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={() => {
//                   navigation.navigate("Remedy Details", {
//                     rem: item,
//                   });
//                 }}
//               >
//                 <View style={styles.button}>
//                   <Text style={styles.title}>{item}</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//             ItemSeparatorComponent={() => (
//               <View style={{ width: 10 }} /> // We can adjust the width based on our desired spacing
//             )}
//           />
//         </View>
//       </View>
//     </>
//   );
// }

// export default RecommendedRemediesScreen;

// const styles = StyleSheet.create({
//   rootContainer: {
//     flex: 1,
//     paddingTop: 30,
//     marginLeft: 10,
//   },
//   button: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     borderWidth: 1.5,
//     borderColor: "#32cd32",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 25,
//     width: 150,
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 15,
//     fontWeight: "bold",
//   },
//   subTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 15,
//     paddingLeft: 2,
//   },
// });
