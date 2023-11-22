import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, Pressable, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BigButton from "../components/ui/BigButton";

const DataAnalyticsScreen = () => {
  const navigation = useNavigation();

  const DATA = [
    {
      id: 0,
      title: "Heart and Circulatory Health",
    },
    {
      id: 1,
      title: "Digestive Wellness",
    },
    {
      id: 2,
      title: "Women's Health",
    },
    {
      id: 3,
      title: "Well Being",
    },
    {
      id: 4,
      title: "Respiratory Health",
    },
    {
      id: 5,
      title: "Joint and Bone Health",
    },
    {
      id: 5,
      title: "Skin Condition",
    },
    {
      id: 6,
      title: "Urinary Health",
    },
  ];

  const [userInput, setUserInput] = useState('');
  const [prediction, setPrediction] = useState('');

  const handlePredict = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: userInput,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Response:', data); // Log the entire response
      console.log("This is a " + data.predicted_category)

      if(data.predicted_category == "Skin Conditions")
      {
        navigation.navigate("QuestionTier2", {
          prevQuestion: "Skin Condition",
       });
      }
      else
      {
        navigation.navigate("QuestionTier2", {
          prevQuestion: data.predicted_category,
       });
      }
      
      //setPrediction(data.predicted_category);

     // buttonClick(prediction)
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  function buttonClick(title) {
    if(title == "Skin Conditions")
    {
      title = "Skin Condition"
    }
    console.log("This iss a " + title)
   
    navigation.navigate("QuestionTier2", {
      prevQuestion: title,
   });
   //console.log()
  }

  function lolClick(){
    navigation.navigate("RecommendedRemediesScreen");
  }

  const Item = ({ title }) => (
    <View>
      <Pressable 
       style={styles.button}
      onPress={() => buttonClick(title)}
      >
      <Text style={styles.buttonText}> {title} </Text>    
      </Pressable>
    </View>
  );

  return (
    <>
    <View>

      <TextInput
          placeholder="Enter user input"
          value={userInput}
          onChangeText={(text) => setUserInput(text)}
      />

      <BigButton title="Predict" onPress={handlePredict} />

      <Text>This is your category {prediction}</Text>

    </View>

      <View style={styles.rootContainer}>
        <Pressable
        onPress={() => lolClick()}
        >
          <Text>CLICK HHHH</Text>
        </Pressable>
      <Text style={styles.title}> Select a category </Text>
      <FlatList 
        data={DATA}
        renderItem={({ item }) => <Item title={item.title} />}
        keyExtractor={(item) => item.id}
      />
      <Pressable>
        <Text> Not what you're looking for? </Text>
      </Pressable>
      </View>
    </>
  );
};

export default DataAnalyticsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  button:{
    borderRadius: 6,
    paddingVertical: 20,
    paddingHorizontal: 29,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    backgroundColor: "#4397f7"
  },
  buttonText:{
    color: "white"
  }
});
