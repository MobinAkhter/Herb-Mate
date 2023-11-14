import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import MIcon from "../components/ui/MIcon";
import { removeSpace, iconMapper } from "../utils";
import { db, auth } from "../firebase";

function RecommendedRemediesScreen() {
  const user = auth.currentUser.uid;
  const userDocRef = db.collection("users").doc(user);
  const userDocSnapshot = userDocRef.get();
  const [remedies, setRemedies] = useState([]);
  const [lol, setLol] = useState([]);

  const getRemedies = () => {
    // Use the get() method to fetch the user's document
   
    // Use the get() method to fetch the user's document
  userDocRef
  .get()
  .then((userDocSnapshot) => {
    if (userDocSnapshot.exists) {
      // Check if the document exists
      const userData = userDocSnapshot.data();

      // Check if the searches property of the user is at least 20
      if (userData && userData.searches) {
        // Remove duplicates and log the array
        const uniqueRemedies = [...new Set(userData.searches)];
        console.log("Remedies after removing duplicates:", uniqueRemedies);

        // Set the state with unique values
        setRemedies(uniqueRemedies);
      }
      
    }
  })
  .catch((error) => {
    console.error("Error fetching remedies:", error);
  });
  };

  const getThreeRemedies = () => {
    console.log(remedies.length)
    const randomIndex = Math.floor(Math.random() * remedies.length);
    const randomElement = remedies[randomIndex];
    setLol(randomElement); // Set the state firstv
    console.log("Random remedy:", randomElement);
  }

  useEffect(() => {
    getRemedies();
    
  }, []);

  useEffect(() => {
    // This will be called whenever the remedies state changes
    getThreeRemedies();
  }, [remedies]);
  

  return (
    <>
      <View>
        <Text>{lol}</Text>
        <Text>{remedies[1]}</Text>
        <Text>{remedies[2]}</Text>
        <Text>{remedies[3]}</Text>
        <Text>{remedies[4]}</Text>
      </View>
    </>
  );
}

export default RecommendedRemediesScreen;
