import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import Button from "../components//ui/Button";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase";
import "firebase/firestore";
import { db, auth } from "../firebase";

const RecommendedRemedyScreen = ({ route }) => {
  const { category } = route.params;
  const { question } = route.params;
  const { age } = route.params;
  const { gender } = route.params;
  const { rating } = route.params;
  const { severity } = route.params;
  const { userAge } = route.params;
  const { sex } = route.params;
  const { userQuestion } = route.params;
  const [pred, setPred] = useState("");
  const navigation = useNavigation();
  const user = auth.currentUser.uid;
  const [area, setArea] = useState("");
  const apiUrl = "http://127.0.0.1:5001/predict";

  useEffect(() => {
    const requestData = {
      Category: category,
      Question: question,
      Age: age,
      Gender: gender,
      Rating: rating,
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
        console.log("ddd" + data.predicted_remedy);
        setPred(data.predicted_remedy);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, []);

  useEffect(() => {
    if (pred) {
      remediesFirebase
        .doc(pred)
        .get()
        .then((doc) => {
          const data = { id: doc.id, ...doc.data() };
          console.log("Setting doc: " + data.id);
          setRemedy(data);
        })
        .catch((error) => {
          console.error("Error fetching remedy from Firestore:", error);
        });
    }
  }, [pred]);

  function buttonClick() {
    navigation.navigate("Remedy Details", {
      rem: remedy,
    });
  }

  /**
  <Text>{category}</Text>
  <Text>{question}</Text>
  <Text>{age}</Text>
  <Text>{gender}</Text>
  <Text>{rating}</Text>
  <Text>Your recommended remedy is {pred}</Text> */

  const lol = async () => {
    const userDocRef = db.collection("users").doc(user);

    // Use the get() method to fetch the user's document
    const userDocSnapshot = await userDocRef.get();

    if (userDocSnapshot.exists) {
      // Check if the document exists

      const userData = userDocSnapshot.data();

      if (userData) {
        const foodCollectionRef = userDocRef.collection("recommendedRemedies");
        console.log("ffffff");
        // Add a document to the 'food' collection (you can add more as needed)
        await foodCollectionRef.add({
          Category: category,
          Question: question,
          UserCondition: userQuestion,
          Age: userAge,
          Sex: sex,
          Severity: severity,
          Remedy: pred,
        });
      }

      Alert.alert('Congratulations',
      'Your details have been recorded', [
       
       {text: 'Continue', onPress: () => console.log('OK Pressed')},
     ]);

    }
    navigation.navigate("View Your Symptoms");

  }

  return (
    <>
      <View style={styles.rootContainer}>
        <View>
          <Text style={styles.subTitle}>Your recommended remedy is </Text>
          <Text style={styles.title}>{pred}</Text>

          <Text style={styles.warning}>
            Remember to consult with a healthcare practitioner before you use
            any remedy.
          </Text>

          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => buttonClick()}
            >
              <Text style={styles.buttonText}> View {pred}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 10, marginBottom: 10 }}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => buttonClick()}
            >
              <Text style={styles.buttonText}> View {pred}</Text>
            </TouchableOpacity>

<<<<<<< HEAD
            <TouchableOpacity
              onPress={() => lol()}
              style={styles.continueButton}
            >
              <Text style={styles.buttonText}> Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
=======
     <View style={{ marginTop: 10, marginBottom: 10 }}>
      
     

        <TouchableOpacity
        onPress={() => lol()}
     style={styles.continueButton}>
        
        <Text style={styles.buttonText}> Continue</Text>
       
        </TouchableOpacity>
     </View>
    
     

    </View>
>>>>>>> code-refactor
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
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#32cd32",
  },
  subTitle: {
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    paddingBottom: 10,
  },
  warning: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    paddingBottom: 10,
    fontStyle: "italic",
  },
  continueButton: {
    borderRadius: 10,
    borderWidth: 1.5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderColor: "#1e90ff",
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e90ff",
  },
});
