import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, Switch, TextInput, Pressable } from "react-native";
import Button from "../components//ui/Button";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";


const QuestionTier3Screen = ({ route }) => {
  const { prevQuestion } = route.params;
  const {selectedCategory} = route.params;
  const navigation = useNavigation();
  const [questions, setQuestions] = useState([]);
  const category = db.collection("Tier2Questions");
  const documentRef = category.doc(prevQuestion);
  const [sex, setSex] = useState("Male");
  const [age, setAge] = useState("");
  const [rating, setRating] = useState("")

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
    }
  ];

  //for selecting the buttons
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    if(isEnabled == true)
    {
      setSex("Male")
    }
    else
    {
      setSex("Female")
    }
    setIsEnabled(previousState => !previousState);
  }
  
 
  function selectRating(rating)
  {
     setRating(rating)
     console.log("This is your current rating: " + rating)
     console.log("fff")
  }
  

  useEffect(() => {
    setRating(3)
    
  }, []);

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
      category: selectedCategory,
      question: prevQuestion,
      age: ageGroup,
      gender: "Both",
      rating: rating
    });
  }

  const Item = ({ title }) => (
    <View>
      <Button
       style={styles.button}
      onPress={() => selectRating(title.id)}
      >
      <Text style={styles.buttonText}> {title.title} </Text>    
      </Button>
    </View>
  );

  return (
    <View style={styles.rootContainer}>
      <Text>{selectedCategory}</Text>

      <Text> Select Your Biological Sex: {sex}</Text>

      <Switch
        trackColor={{false: '#81b0ff', true: '#ffb6c1'}}
        thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
        ios_backgroundColor="#81b0ff"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />

<TextInput
        style={styles.input}
        onChangeText={setAge}
        value={age}
        placeholder="Enter Your Age"
        keyboardType="numeric"
      />
      
      <Text>How severe is your condition</Text>
      <FlatList
         data={DATA}
         renderItem={({ item }) => <Item title={item} />}
         keyExtractor={(item) => item.id}
      />

      <Text>This is your current rating:{rating}</Text>

      <Button onPress={buttonClick}>Continue To Next Page</Button>
    </View>
  );
};

export default QuestionTier3Screen;

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

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
