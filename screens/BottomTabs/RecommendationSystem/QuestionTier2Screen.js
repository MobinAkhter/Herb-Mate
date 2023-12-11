import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { db } from "../../../firebase";
import { useNavigation } from "@react-navigation/native";

const QuestionTier2Screen = ({ route }) => {
  const { prevQuestion } = route.params;
  const { condition } = route.params;
  const navigation = useNavigation();

  const [questions, setQuestions] = useState([]);
  const category = db.collection("Category");
  const documentRef = category.doc(prevQuestion.toString());

  useEffect(() => {
    console.log("This is your " + condition);
    console.log("This is a prevQuestion lol" + prevQuestion);
    if (!prevQuestion) {
      console.error("prevQuestion is empty or undefined");
      return;
    }
    console.log(prevQuestion);

    // Get the data from the document
    documentRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          // Check if the 'questions' field exists in the data
          if (data && data.userQuestions) {
            const questionData = data.userQuestions.map((question, index) => ({
              id: index,
              name: question,
            }));
            setQuestions(questionData);
          } else {
            console.error("No 'questions' field found in the document data.");
          }
        } else {
          console.error("Document does not exist.");
        }
      })
      .catch((error) => {
        console.error("Error retrieving data from Firestore: ", error);
      });
  }, []);

  function buttonClick(category, tier2) {
    navigation.navigate("Enter Your Info", {
      selectedCategory: category,
      prevQuestion: tier2,
      condition: condition,
    });
  }

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}> {prevQuestion} </Text>
      <Text style={styles.subTitle}>
        Please select any of the following questions below{" "}
      </Text>
      <FlatList
        data={questions}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => buttonClick(prevQuestion, item.name)}
          >
            <Text style={styles.textColor}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default QuestionTier2Screen;

const styles = StyleSheet.create({
  rootContainer: {
    marginTop: 160,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000080",
  },
  button: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#1e90ff",
    marginTop: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textColor: {
    color: "#1e90ff",
    fontWeight: "bold",
    textAlign: "center",
    fontStyle: "italic",
  },
  subTitle: {
    color: "#191970",
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: 10,
  },
});
