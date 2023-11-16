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
import RecommendRemediesViewModel from "../ViewModels/RecommendedRemediesViewModel";

function RecommendedRemediesScreen() {
  const user = auth.currentUser.uid;
  const userDocRef = db.collection("users").doc(user);
  const navigation = useNavigation();

  
  const [remedies, setRemedies] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [lol, setLol] = useState([]);
  const [conditionList1, setConditionsList1] = useState("")
  const [conditionList2, setConditionsList2] = useState("")
  const [conditionList3, setConditionsList3] = useState("")
  

  //get the conditions
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


  //filter out to get 3 random conditions
  const getThreeRemedies = () => {
    const shuffled = [...remedies].sort(() => Math.random() - 0.5);
    const randomRemedies = shuffled.slice(0, 3);
    console.log("5 random remedies:", randomRemedies);
    setLol(randomRemedies)

    for( let i = 0; i < 3; i++)
    {
      
      randomRemedy(randomRemedies[i], i);
    }
    
    
  }

  //for each condition, get 3 random remedies
  const randomRemedy = async (condition, count) => {
    console.log(condition)
    const documentId = condition;  // Replace with the actual document ID
    

    const conditionDocRef = db.collection('Conditions').doc(documentId);

  
    const docSnapshot = await conditionDocRef.get();

    if (docSnapshot.exists) {
      const conditionData = docSnapshot.data();
      console.log("These are the remedies for " + conditionData.name + conditionData.remedies)

      if(count == 0)
      {
      setConditionsList1(conditionData.remedies) 

      console.log(conditionList1)
      }
      else if (count == 1)
      {
        setConditionsList2(conditionData.remedies) 
        console.log(conditionList2)
      }
      else if (count == 2)
      {
        setConditionsList3(conditionData.remedies)
        console.log(conditionList3)
      }
    } 
  
  }      

  //for each remedy, get the object and get the name and image

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
      
        <View>
              <Text>Because you searched for {lol[0]}</Text>
              
              <FlatList
                data={conditionList1}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Remedy Details', {
                          rem: item,
                        });
                      }}
                    >
                        <View>
                          <Text>{item}</Text>
                          
                        </View>
                   
                    </TouchableOpacity>
                )}
              />
        </View>
        
        
        <View>
              <Text>Because you searched for {lol[1]}</Text>
              
              <FlatList
                data={conditionList2}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Remedy Details', {
                          rem: item,
                        });
                      }}
                    >
                        <View>
                          <Text>{item}</Text>
                          
                        </View>
                   
                    </TouchableOpacity>
                )}
              />


        </View>

        
        <View>
              <Text>Because you searched for {lol[2]}</Text>
              
              <FlatList
                data={conditionList3}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('Remedy Details', {
                          rem: item,
                        });
                      }}
                    >
                        <View>
                          <Text>{item}</Text>
                        </View>
                   
                    </TouchableOpacity>
                )}
              />

        </View>
        
      </View>
    </>
  );
}

export default RecommendedRemediesScreen;
