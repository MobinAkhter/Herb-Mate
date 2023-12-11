import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Switch,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const QuestionTier3Screen = ({ route }) => {
  const { prevQuestion } = route.params;
  const { selectedCategory } = route.params;
  const { condition } = route.params;
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([]);
  const category = db.collection("Tier2Questions");
  const documentRef = category.doc(prevQuestion);
  const [sex, setSex] = useState("Male");
  const [age, setAge] = useState("");
  const [rating, setRating] = useState("");

  const DATA = [
    {
      id: 1,
      title: "Low",
    },
    {
      id: 2,
      title: "Moderate",
    },
    {
      id: 3,
      title: "Concerning",
    },
    {
      id: 4,
      title: "Serious",
    },
    {
      id: 5,
      title: "Critical",
    },
  ];

  //for selecting the buttons
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    if (isEnabled == true) {
      setSex("Male");
    } else {
      setSex("Female");
    }
    setIsEnabled((previousState) => !previousState);
  };

  function selectRating(rating) {
    setRating(rating);
    console.log("This is your current rating: " + rating);
  }

  useEffect(() => {
    setRating(3);
    console.log("This is " + condition);
  }, []);

  function buttonClick() {
    let ageGroup = "";
    console.log("This is +" + age);
    if (age == null || age == "" || age < 18 || age > 120) {
      Alert.alert("Error", "Please enter an age between 18 to 120", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      if (age < 30) {
        ageGroup = "18 to 29";
      } else if (age >= 30 && age < 50) {
        ageGroup = "30 to 49";
      } else {
        ageGroup = "50 and over";
      }

      /*navigation.navigate("RecommendedRemedyScreen", {
      category: selectedCategory,
      question: prevQuestion,
      age: ageGroup,
      gender: "Both",
      rating: rating
    }); */
      navigation.navigate("Symptom Details Review", {
        category: selectedCategory,
        condition: prevQuestion,
        age: age,
        gender: "Both",
        rating: rating,
        sex: sex,
        userQuestion: condition,
      });
    }
  }

  //alert
  const createTwoButtonAlert = () =>
    Alert.alert(
      "Important Notice",
      "If you are transitioning or already have transitioned, please select the sex you were given at birth. Remember to consult with a healthcare practitioner before you use any remedy.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );

  const Item = ({ title }) => (
    <View>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: rating === title.id ? "#f8f8ff" : "white" },
          { borderColor: rating === title.id ? "#9370db" : "black" },
        ]}
        onPress={() => selectRating(title.id)}
      >
        <Text
          style={[
            styles.buttonText,
            { color: rating === title.id ? "#6a5acd" : "black" },
          ]}
        >
          {" "}
          {title.title}{" "}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.subTitle}> Select Your Biological Sex: {sex}</Text>

      <Switch
        trackColor={{ false: "#81b0ff", true: "#ffb6c1" }}
        thumbColor={isEnabled ? "#f4f3f4" : "#f4f3f4"}
        ios_backgroundColor="#81b0ff"
        style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />

      <Text onPress={createTwoButtonAlert}>
        Are you transgender or non-binary?
      </Text>

      <TextInput
        style={styles.input}
        onChangeText={setAge}
        value={age}
        placeholder="Enter Your Age"
        placeholderTextColor={"black"}
        keyboardType="numeric"
      />

      <Text style={styles.subTitle}>How severe is your condition?</Text>
      <FlatList
        data={DATA}
        renderItem={({ item }) => <Item title={item} />}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity style={styles.continueButton} onPress={buttonClick}>
        <Text style={styles.buttonText}> CONTINUE </Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuestionTier3Screen;

const styles = StyleSheet.create({
  rootContainer: {
    marginTop: 30,
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

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  subTitle: {
    color: "#191970",
    fontWeight: "bold",
    fontSize: "20",
    textAlign: "center",
    paddingBottom: 10,
  },
  button: {
    borderRadius: 10,
    borderWidth: 1.5,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // backgroundColor: "#f5fffa"
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#32cd32",
  },
  continueButton: {
    borderWidth: 1.5,
    borderColor: "#32cd32",
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 50,
  },
});
