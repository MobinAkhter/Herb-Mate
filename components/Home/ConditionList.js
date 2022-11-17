import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import BigButton from "../ui/BigButton";
import { db } from "../../firebase";

function ConditionList({ bodyPart }) {
  const navigation = useNavigation();
  const [conditions, setConditions] = useState([]);
  const col = db.collection("BodyParts");

  //Fills list of conditions to show in flatlist based on the bodypart selected
  useEffect(() => {
    const con = [];
    col
      .doc(bodyPart)
      .collection("Conditions")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          con.push({
            ...doc.data(),
            key: doc.id,
          });
          console.log(doc.id);
        });
        setConditions(con);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {bodyPart === "Digestive" && (
          <MaterialCommunityIcons
            styles={styles.icon}
            name="stomach"
            size={40}
            color="black"
          />
        )}
        {bodyPart === "Circulatory" && (
          <Fontisto
            styles={styles.icon}
            name="blood-drop"
            size={40}
            color="black"
          />
        )}
        {bodyPart === "Head/Neck" && (
          <FontAwesome5
            styles={styles.icon}
            name="head-side-virus"
            size={40}
            color="black"
          />
        )}
        {bodyPart === "Mental" && (
          <MaterialCommunityIcons
            styles={styles.icon}
            name="brain"
            size={40}
            color="black"
          />
        )}
        {bodyPart === "Respiratory" && (
          <FontAwesome5
            styles={styles.icon}
            name="lungs"
            size={40}
            color="black"
          />
        )}
        {bodyPart === "Skeletal" && (
          <FontAwesome5
            styles={styles.icon}
            name="bone"
            size={40}
            color="black"
          />
        )}
        {bodyPart === "Skin" && (
          <Ionicons styles={styles.icon} name="body" size={40} color="black" />
        )}
        {bodyPart} Conditions
      </Text>

      <FlatList
        data={conditions}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <BigButton
              onPress={() => {
                navigation.navigate("RemedyList", {
                  bp: bodyPart,
                  con: item.name,
                });
              }}
            >
              <Text styles={styles.itemText}>{item.name}</Text>
            </BigButton>
          </View>
        )}
      />
    </View>
  );
}

export default ConditionList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
});
