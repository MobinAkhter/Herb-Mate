import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import Button from "../components//ui/Button";

const RemediesBarGraphScreen = () => {
  const [pred, setPred] = useState("");

  const [t1, sett1] = useState("");
  const [t2, sett2] = useState("");
  const [t3, sett3] = useState("");

  const apiUrl = "http://127.0.0.1:5000/predict";

  // Define the data you want to send to the API
  const [blob, setBlob] = useState("");
  const [ray, setRay] = useState("");

  // Send a POST request to the API

  function buttonClick() {
    const requestData = {
      Category: t1,
      FirstQuestion: t2,
      SecondQuestion: t3,
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
  }

  return (
    <View style={styles.rootContainer}>
      <Text> Random name is {blob}</Text>

      <Text>
        {" "}
        Random desc of {blob} is {ray}{" "}
      </Text>

      <TextInput
        placeholder="useless placeholder"
        onChangeText={(newText) => sett1(newText)}
        value={t1}
      ></TextInput>

      <TextInput
        placeholder="useless placeholder"
        onChangeText={(newText) => sett2(newText)}
        value={t2}
      ></TextInput>

      <TextInput
        placeholder="useless placeholder"
        onChangeText={(newText) => sett3(newText)}
        value={t3}
      ></TextInput>

      <Text>{pred}</Text>
      <Button onPress={() => buttonClick()}>CLick</Button>
    </View>
  );
};

export default RemediesBarGraphScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
