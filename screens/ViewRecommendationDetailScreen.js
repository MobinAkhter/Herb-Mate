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
            <View style={styles.rootContainer}>
            
            <Text style={[styles.subTitle, { color: 'blue' }]}>Your Age: {recommendation.Age}</Text>
            <Text style={[styles.subTitle, { color: 'orange' }]}>Category: {recommendation.Category}</Text>
            <Text style={styles.subTitle}>Question: {recommendation.Question}</Text>
            <Text style={[styles.subTitle, { color: 'grey' }]}>Your Condition: {recommendation.UserCondition}</Text>
            <Text style={[styles.subTitle, { color: 'purple' }]}>Your Biological Sex: {recommendation.Sex}</Text>
            <Text style={[styles.subTitle, { color: 'red' }]}>How severe is your current condition?: {recommendation.Severity}</Text>
            <Text style={[styles.subTitle, { color: 'green' }]}>Your recommended Remedy: {recommendation.Remedy}</Text>

            </View> 
        </>
      )

}

export default ViewRecommendationDetailScreen;

const styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 32,
    },
    title: {
      fontSize: 50,
      fontWeight: "bold",
      marginBottom: 8,
      color: '#32cd32'
    },
    subTitle: {
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center",
      paddingBottom: 10
    },
    warning: {
      fontWeight: "bold",
      fontSize: 20,
      textAlign: "center",
      paddingBottom: 10,
      fontStyle: "italic"
    },
    continueButton:{
      borderRadius: 10,
      borderWidth: 1.5,
      marginTop: 10,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderColor: "#1e90ff"
    },
    buttonText: {
      fontWeight: "bold",
      textAlign: "center",
      color: '#1e90ff',
    },
  });