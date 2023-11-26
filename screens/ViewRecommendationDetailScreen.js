import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import Button from "../components//ui/Button";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebase";

function ViewRecommendationDetailScreen({route}){
    const { recommendId } = route.params;
    const user = auth.currentUser.uid;
    const [recommendation, setRecommendation] = useState({});
    const navigation = useNavigation();

    const getRecommendation =  async () =>{
        const userDocRef = db.collection("users").doc(user);
      
        // Use the get() method to fetch the user's document
        const userDocSnapshot = await userDocRef.get();
    
        if (userDocSnapshot.exists) {
            // Check if the document exists
        
            const userData = userDocSnapshot.data();
            const collection = userDocRef.collection("recommendedRemedies");
        
            if (userData && collection) {
              // Find the doc with the specified recommendId
              const remedyDoc = await collection.doc(recommendId).get();
        
              if (remedyDoc.exists) {
                // If the document exists, setRecommendation to its data
                setRecommendation(remedyDoc.data());
                console.log(recommendation)
              } else {
                // Handle the case where the document does not exist
                console.error("Document not found");
              }
            }
        }
      }

      useEffect( () => {
          getRecommendation()
      },[])

      useEffect(() => {
        console.log(recommendation);
      }, [recommendation]);


      return(
        <>
            <View>
            
            <Text>Your Age: {recommendation.Age}</Text>
            <Text>Category: {recommendation.Category}</Text>
            <Text>Question: {recommendation.Question}</Text>
            <Text>Your Condition: {recommendation.UserCondition}</Text>
            <Text>Your Biological Sex: {recommendation.Sex}</Text>
            <Text>How severe is your current condition?: {recommendation.Severity}</Text>
            <Text>Your recommended Remedy: {recommendation.Remedy}</Text>

            </View> 
        </>
      )

}

export default ViewRecommendationDetailScreen;