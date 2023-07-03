// TODO: CAN DELETE THIS NOW IMO. BUT KEEPING THIS UNTIL SHANE CAN CONFIRM ALL THE FUNCTIONALITY STILL WORKS.
//import { useEffect, useState } from "react";
// import { FlatList, StyleSheet, View, Text } from "react-native";
// import { useNavigation } from "@react-navigation/native";

// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { Fontisto } from "@expo/vector-icons";
// import { FontAwesome5 } from "@expo/vector-icons";
// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import BigButton from "../ui/BigButton";
// import { db } from "../../firebase";

// function ConditionList({ bodyPart }) {
//   const navigation = useNavigation();
//   const [conditions, setConditions] = useState([]);
//   const col = db.collection("BodyParts");

//   // Loads the conditions from cache or database
//   const loadConditions = async () => {
//     try {
//       const cacheKey = `conditions_${bodyPart}`;
//       const cachedConditions = await AsyncStorage.getItem(cacheKey);

//       if (cachedConditions !== null) {
//         console.log(`Fetching conditions from cache for body part: ${bodyPart}`);
//         setConditions(JSON.parse(cachedConditions));
//       } else {
//         console.log(`Fetching conditions from Firestore for body part: ${bodyPart}`);
//         const con = [];
//         const querySnapshot = await col
//           .doc(bodyPart)
//           .collection("Conditions")
//           .get();

//         querySnapshot.forEach((doc) => {
//           con.push({
//             ...doc.data(),
//             key: doc.id,
//           });
//         });

//         await AsyncStorage.setItem(cacheKey, JSON.stringify(con));
//         setConditions(con);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     loadConditions();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>
//         {bodyPart === "Digestive" && (
//           <MaterialCommunityIcons
//             styles={styles.icon}
//             name="stomach"
//             size={40}
//             color="black"
//           />
//         )}
//         {bodyPart === "Circulatory" && (
//           <Fontisto
//             styles={styles.icon}
//             name="blood-drop"
//             size={40}
//             color="black"
//           />
//         )}
//         {bodyPart === "Head and Neck" && (
//           <FontAwesome5
//             styles={styles.icon}
//             name="head-side-virus"
//             size={40}
//             color="black"
//           />
//         )}
//         {bodyPart === "Mental" && (
//           <MaterialCommunityIcons
//             styles={styles.icon}
//             name="brain"
//             size={40}
//             color="black"
//           />
//         )}
//         {bodyPart === "Respiratory" && (
//           <FontAwesome5
//             styles={styles.icon}
//             name="lungs"
//             size={40}
//             color="black"
//           />
//         )}
//         {bodyPart === "Skeletal" && (
//           <FontAwesome5
//             styles={styles.icon}
//             name="bone"
//             size={40}
//             color="black"
//           />
//         )}
//         {bodyPart === "Skin" && (
//           <Ionicons styles={styles.icon} name="body" size={40} color="black" />
//         )}
//         {bodyPart} Conditions
//       </Text>

//       <FlatList
//         data={conditions}
//         renderItem={({ item }) => (
//           <View style={styles.container}>
//             <BigButton
//               onPress={() => {
//                 navigation.navigate("RemedyList", {
//                   bp: bodyPart,
//                   con: item.name,
//                 });
//               }}
//             >
//               <Text styles={styles.itemText}>{item.name}</Text>
//             </BigButton>
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// export default ConditionList;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 25,
//     fontWeight: "bold",
//   },
// });
