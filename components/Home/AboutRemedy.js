import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { db } from "../../firebase";
import BigButton from "../ui/BigButton";
import BookMarkButton from "../ui/BookmarkButton";

function AboutRemedy({ bodyPart, condition, rem }) {
  const [remedy, setRemedy] = useState({});
  const col = db.collection("BodyParts");
  console.log("rem: ", rem);

  //Gets specific herbal remedy to show information about
  //currently has an issue getting the document id.  rem parameter should give
  // document id from previous screen but it shows as undefined
  useEffect(() => {
    col
      .doc(bodyPart)
      .collection("Conditions")
      .doc(condition)
      .collection("Remedies")
      .doc(rem)
      .get()
      .then((doc) => {
        console.log(doc.data());
        setRemedy(doc.data());
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{remedy.name}</Text>

        <View
          style={{
            width: 150,
            height: 150,
            backgroundColor: "green",
          }}
        />
        <View style={styles.info}>
          <Text style={styles.head}>Description</Text>
          <Text style={styles.desc}>{remedy.description}</Text>
          <Text style={styles.head}>Precautions</Text>
          <Text style={styles.desc}>{remedy.precautions}</Text>
        </View>
        <BookMarkButton>BOOKMARK</BookMarkButton>
      </View>
    </ScrollView>
  );
}

export default AboutRemedy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  titleCon: {
    alignItems: "center",
  },
  info: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    padding: 15,
  },
  desc: {
    fontSize: 20,
  },
  head: {
    fontSize: 30,
    fontWidth: 'bold'
  },
});
