import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import BigButton from "../ui/BigButton";
import { Colors } from "../../constants/styles";
import { db } from "../../firebase";

function SearchResults({ searchVal }) {
  console.log(searchVal);
  const navigation = useNavigation();
  //gets/sets list of remedies to show in flatlist
  const [conditions, setConditions] = useState([]);
  const col = db.collection("BodyParts");
  const bpList = [
    "Circulatory",
    "Digestive",
    "Female Reproductive",
    "Head and Neck",
    "Male Reproductive",
    "Mental",
    "Respiratory",
    "Skeletal",
    "Skin",
    "Urinary",
  ];

  var width = Dimensions.get("window").width; //full width
  var height = Dimensions.get("window").height; //full height

  //Fills list of conditions to show in flatlist based on the bodypart selected
  useEffect(() => {
    const con = [];
    bpList.forEach((element) => {
      col
        .doc(element)
        .collection("Conditions")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.id.toLowerCase().includes(searchVal.toLowerCase())) {
              console.log("result: " + doc.id);
              con.push({
                ...doc.data(),
                key: doc.id,
                bp: element,
              });
            }
            //console.log(doc.id);
          });
          setConditions(con);
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    });
    // col
    //   .doc(bodyPart)
    //   .collection("Conditions")
    //   .get()
    //   .then((querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //       con.push({
    //         ...doc.data(),
    //         key: doc.id,
    //       });
    //       console.log(doc.id);
    //     });
    //     setConditions(con);
    //   })
    //   .catch((error) => {
    //     console.log("Error getting documents: ", error);
    //   });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Searching for: {searchVal}</Text>
      <View style={styles.header}>
        <Text style={styles.title}>Conditions</Text>
      </View>
      <FlatList
        style={styles.list}
        data={conditions}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <BigButton
              onPress={() => {
                navigation.navigate("RemedyList", {
                  bp: item.bp,
                  con: item.name,
                  //rem: item.name,
                });
              }}
            >
              <Text styles={styles.itemText}>{item.name}</Text>
              {console.log("condition: " + item.name)}
            </BigButton>
          </View>
        )}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Remedies</Text>
      </View>
      <FlatList
        data={conditions}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <BigButton
              onPress={() => {
                navigation.navigate("RemedyList", {
                  bp: item.bp,
                  con: item.name,
                  //rem: item.name,
                });
              }}
            >
              <Text styles={styles.itemText}>{item.name}</Text>
              {console.log("condition: " + item.name)}
            </BigButton>
          </View>
        )}
      />
    </View>
  );
}

export default SearchResults;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  header: {
    //justifyContent: "space-between",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: 40,
    backgroundColor: "#35D96F",
  },
  list: {},
});