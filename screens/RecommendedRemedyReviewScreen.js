import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from "react-native";
import Button from "../components/ui/Button";
import { useNavigation } from "@react-navigation/native";
import { cond } from "react-native-reanimated";

function RecommendedRemedyReviewScreen({ route }) {

  const { condition } = route.params;
  const { category} = route.params;
  const { age } = route.params;
  const { rating} = route.params;
  const { gender } = route.params;
  const {sex} = route.params;
  const [severity, setSeverity] = useState("")
  const navigation = useNavigation();


  useEffect(() =>{
    if(rating == "1")
    {
        setSeverity("Low");
    }
    else if(rating == "2")
    {
        setSeverity("Moderate");
    }
    else if(rating == "3")
    {
        setSeverity("Concerning");
    }
    else if(rating == "4")
    {
        setSeverity("Serious");
    }
    else if(rating == "5")
    {
        setSeverity("Critical");
    }
  })

  function buttonClick()
  {
    let ageGroup = ""
    
    if(age < 30)
    {
      ageGroup = "18 to 29"
    }
    else if (age >= 30 && age < 50)
    {
      ageGroup = "30 to 49"
    }
    else{
      ageGroup = "50 and over"
    }

    navigation.navigate("RecommendedRemedyScreen", {
      category: category,
      question: condition,
      age: ageGroup,
      gender: "Both",
      rating: rating
    })
  
  }
  
return(
    <>
    <View style={styles.rootContainer}>

        <Text style={styles.title}> Review </Text>
        
        <Text> Category: {category} </Text>

        <Text> Condition: {condition} </Text>

        <Text> Sex: {sex} </Text>

        <Text> Again: {age} </Text>

        <Text> Rating: {severity} </Text>

        <TouchableOpacity style={styles.continueButton} onPress={buttonClick}>
        <Text style={styles.buttonText}> CONTINUE </Text>
      </TouchableOpacity>

    </View>
    </>
)

}

export default RecommendedRemedyReviewScreen;

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
      fontSize: 30,
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
  