import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";

const RecommendedRemedyScreen = ({ route }) => {
  const { category } = route.params;
  const { question1 } = route.params;
  const { question2 } = route.params;
  const [pred, setPred] = useState("");
  const apiUrl = "http://127.0.0.1:5000/predict"; // Replace with your API URL

  useEffect(() => {
    const requestData = {
      Category: category,
      FirstQuestion: question1,
      SecondQuestion: question2,
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
        console.log("Predicted Remedy:", pred);
        console.log(t1);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  return (
    <View style={styles.rootContainer}>
      <Text>Your recommended remedy is {pred}</Text>
    </View>
  );
};

export default RecommendedRemedyScreen;

const styles = StyleSheet.create({
  rootContainer: {
    marginTop: 160,
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
