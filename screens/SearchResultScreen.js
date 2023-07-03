import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebase";

function SearchResultScreen({ route }) {
  const { searchVal } = route.params;
  console.log(searchVal);
  const navigation = useNavigation();
  //gets/sets list of remedies to show in flatlist
  const [conditions, setConditions] = useState([]);
  const [remedies, setRemedies] = useState([]);
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
  var rems = db.collectionGroup("Remedies");

  //Fills list of conditions to show in flatlist based on the bodypart selected
  useEffect(() => {
    // const con = [];
    // bpList.forEach((element) => {
    //   col
    //     .doc(element)
    //     .collection("Conditions")
    //     .get()
    //     .then((querySnapshot) => {
    //       querySnapshot.forEach((doc) => {
    //         if (doc.id.toLowerCase().includes(searchVal.toLowerCase())) {
    //           console.log("result: " + doc.id);
    //           con.push({
    //             ...doc.data(),
    //             key: doc.id,
    //             bp: element,
    //           });
    //         }
    //         //console.log(doc.id);
    //       });
    //       setConditions(con);
    //     })
    //     .catch((error) => {
    //       console.log("Error getting documents: ", error);
    //     });
    // });
    // const remList = [];
    // //Gets a list of remedies to populate the second flat list depending on search terms entered
    // rems.get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     if (doc.id.toLowerCase().includes(searchVal.toLowerCase())) {
    //       console.log("rem result: " + doc.id);
    //       remList.push({
    //         ...doc.data(),
    //         key: doc.id,
    //       });
    //     }
    //     //console.log(doc.id, " => ", doc.data());
    //   });
    //   setRemedies(remList);
    // });
  }, []);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Searching for: {searchVal}</Text>
      {/* <View style={styles.header}>
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
      /> */}
      <View style={styles.header}>
        <Text style={styles.title}>Remedies</Text>
      </View>
      {/* <FlatList
        data={remedies}
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
      /> */}
    </View>
  );
}

export default SearchResultScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  header: {
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: 40,
    backgroundColor: "#35D96F",
  },
  list: {},
});
