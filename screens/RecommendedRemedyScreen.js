import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import Button from "../components//ui/Button";
import { useNavigation } from "@react-navigation/native";

const RecommendedRemedyScreen = ({ route }) => {
  const { category } = route.params;
  const {question} = route.params;
  const { age } = route.params;
  const { gender } = route.params;
  const {rating} = route.params;
  const [pred, setPred] = useState("");
  const navigation = useNavigation();
  const apiUrl = "http://127.0.0.1:5001/predict"; 

  useEffect(() => {
    const requestData = {
      Category: category,
      Question: question,
      Age: age,
      Gender: gender,
      Rating: rating
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the API response here
        console.log("API Response:", data);
        // Extract the predicted remedy from the API response
        setPred(data.predicted_remedy);
        
       
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  function buttonClick()
  {
    navigation.navigate("Remedy Details", {
      rem: pred
    });
  }

  return (
    <>
    <View style={styles.rootContainer}>
      <Text>{category}</Text>
      <Text>{question}</Text>
      <Text>{age}</Text>
      <Text>{gender}</Text>
      <Text>{rating}</Text>
      <Text>Your recommended remedy is {pred}</Text>

     <View style={{ marginTop: 10, marginBottom: 10 }}>
     <Button 
       onPress={() => buttonClick()}>
        View {pred} </Button>
     </View>
    
     <Button> Try Again </Button>

    </View>
    </>
  );
};

export default RecommendedRemedyScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
