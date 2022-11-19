import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import BigButton from "../ui/BigButton";
import { Colors } from "../../constants/styles";
import { db } from "../../firebase";

function RemedyList({ bodyPart, condition }) {
  const navigation = useNavigation();
  //gets/sets list of remedies to show in flatlist
  const [remedies, setRemedies] = useState([]);
  const col = db.collection("BodyParts");

  //gets remedies based on condition from db
  useEffect(() => {
    const con = [];
    col
      .doc(bodyPart)
      .collection("Conditions")
      .doc(condition)
      .collection("Remedies")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          con.push({
            ...doc.data(),
            key: doc.id,
          });
          console.log(doc.id);
        });
        setRemedies(con);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={remedies}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <BigButton
              onPress={() => {
                navigation.navigate("AboutRemedy", {
                  bp: bodyPart,
                  con: condition,
                  rem: item.name,
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

export default RemedyList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
});
