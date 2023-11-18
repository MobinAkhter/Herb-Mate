import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import Button from "../components//ui/Button";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";

const QuestionTier2Screen = ({ route }) => {
  const { prevQuestion } = route.params;
  const navigation = useNavigation();

  const [questions, setQuestions] = useState([]);
  const category = db.collection("Category");
  const documentRef = category.doc(prevQuestion);

  useEffect(() => {
    
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
          if (data && data.questions) {
            const questionData = data.questions.map((question, index) => ({
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
        console.error('Error retrieving data from Firestore: ', error);
      });
  }, []);

  function buttonClick(category, tier2)
  {
    navigation.navigate("QuestionTier3", {
      selectedCategory: category,
      prevQuestion: tier2 
    });
  }

  return (
    <View style={styles.rootContainer}>
      <Text>Questions for the {prevQuestion} category </Text>
      <FlatList
        data={questions}
        renderItem={({ item }) => (
          <Button onPress={() => buttonClick(prevQuestion, item.name)}>{item.name}</Button>
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
