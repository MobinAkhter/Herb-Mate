// import React, { useEffect, useState } from "react";
// import { StyleSheet, View, Text } from "react-native";
// import { db, auth } from "../../../firebase";

// function ViewRecommendationDetailScreen({ route }) {
//   const { recommendId } = route.params;
//   const user = auth.currentUser.uid;
//   const [recommendation, setRecommendation] = useState({});

//   const getRecommendation = async () => {
//     const userDocRef = db.collection("users").doc(user);

//     // Use the get() method to fetch the user's document
//     const userDocSnapshot = await userDocRef.get();

//     if (userDocSnapshot.exists) {
//       // Check if the document exists

//       const userData = userDocSnapshot.data();
//       const collection = userDocRef.collection("recommendedRemedies");

//       if (userData && collection) {
//         // Find the doc with the specified recommendId
//         const remedyDoc = await collection.doc(recommendId).get();

//         if (remedyDoc.exists) {
//           // If the document exists, setRecommendation to its data
//           setRecommendation(remedyDoc.data());
//           console.log(recommendation);
//         } else {
//           // Handle the case where the document does not exist
//           console.error("Document not found");
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     getRecommendation();
//   }, []);

//   useEffect(() => {
//     console.log(recommendation);
//   }, []);

//   return (
//     <>
//       <View style={styles.subContainer}>
//         <View style={styles.rootContainer}>
//           <Text style={styles.subTitle}>Age: </Text>
//           <Text style={styles.subTitle}>Condition: </Text>
//           <Text style={styles.subTitle}>Biological Sex: </Text>
//           <Text style={styles.subTitle}>Severity: </Text>
//           <Text style={styles.subTitle}>Recommended Remedy: </Text>
//         </View>

//         <View style={styles.rootContainer}>
//           <Text style={[styles.subTitle, { color: "green" }]}>
//             {recommendation.Age}
//           </Text>
//           <Text style={[styles.subTitle, { color: "green" }]}>
//             {recommendation.UserCondition}
//           </Text>
//           <Text style={[styles.subTitle, { color: "green" }]}>
//             {recommendation.Sex}
//           </Text>
//           <Text style={[styles.subTitle, { color: "green" }]}>
//             {recommendation.Severity}
//           </Text>
//           <Text style={[styles.subTitle, { color: "green" }]}>
//             {recommendation.Remedy}
//           </Text>
//         </View>
//       </View>
//     </>
//   );
// }

// export default ViewRecommendationDetailScreen;

// const styles = StyleSheet.create({
//   rootContainer: {
//     alignItems: "flex-start",
//   },
//   subContainer: {
//     flex: 1,
//     justifyContent: "space-around",
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   subTitle: {
//     fontWeight: "bold",
//     fontSize: 15,
//     textAlign: "center",
//     paddingBottom: 10,
//   },
// });
