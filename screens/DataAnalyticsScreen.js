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
        navigation.navigate("Specific Question", {
          prevQuestion: "Skin Condition",
          condition: userInput
       });
      }
      else
      {
        navigation.navigate("Specific Question", {
          prevQuestion: data.predicted_category,
          condition: userInput
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
    console.log(userInput)
   
    navigation.navigate("Specific Question", {
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
    
      <View style={styles.rootContainer}>
        <View style={styles.instructions}>

        <Text style={styles.title}>About This System</Text>
        <Text style={styles.subTitle}>The recommendation system is used to determine the best remedy based on your current condition. Please remember to always talk to your health practitioner before you use any remedy</Text>

        </View>
      <TextInput
      style={styles.input}
          placeholder="What are you currently dealing with?"
          placeholderTextColor={"black"}
          value={userInput}
          onChangeText={(text) => setUserInput(text)}
      />

     

      <Pressable
      style={styles.button}
      onPress={handlePredict}>
        <Text style={styles.buttonText}>Continue</Text>
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
  
  button:{
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#1e90ff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width:120,
    marginBottom: 10
  },
  buttonText:{
    color: "#1e90ff",
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
    textDecorationLine: 'underline'
  },
  subTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 15,
    paddingLeft: 2
  },

  instructions:{
    justifyContent: "flex-start",
  
  }
});
