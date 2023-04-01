import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Image, Alert } from "react-native";
import { db, auth } from "../../firebase";
import BigButton from "../ui/BigButton";
import BookMarkButton from "../ui/BookmarkButton";
import {getAuth} from 'firebase/auth'

import firebase from 'firebase/app';
import 'firebase/firestore';

function AboutRemedy({ rem }) {
  const [remedy, setRemedy] = useState({});
  const [bookMarkText, setBookMarkText] = useState("BookMark")
 const [checkBookMark, setCheckBookMark] = useState("")
 const [buttonColor, setButtonColor] = useState("red")

  //access firestore
 
 //accessing the collection
  const remediesFirebase = db.collection("Remedies")
  //accessing current authenticated user
  
  //accessing the current user in firestore users collection in database by finding record through user id
  const user = auth.currentUser.uid

  const userRef = db.collection('users').doc(user);

  //accessing the bookmarks collection from the user
  //const bookmarks =  userRef.collection('bookmarks').doc('remedy').get();


  //Gets specific herbal remedy to show information about
  //currently has an issue getting the document id.  rem parameter should give
  // document id from previous screen but it shows as undefined
  
  useEffect(() => {
      remediesFirebase
      .doc(rem)
      .get()
      .then((doc) => {
        setRemedy(doc.data());
      })
      .catch((error) => {
      })
  }, []);

  function bookMarkRemedy()
  {

    if(checkBookMark == false){
        userRef.collection('bookmarks')
          .doc(rem)
          .set({
            name: remedy.name,
            description: remedy.description,
            precautions: remedy.precautions
          })
      
          Alert.alert(
            `${remedy.name} has been bookmarked!`
           )
          setBookMarkText("UNBOOKMARK")
         
          setCheckBookMark(true)
    }else{
      userRef.collection('bookmarks').doc(rem).delete()
      
      Alert.alert(
        `${remedy.name} has been removed from your bookmarks!`
       )
      setBookMarkText("BOOKMARK")
      setCheckBookMark(false)
    }

   

  }

  
  useEffect(() => {
   const checkRemedy = userRef.collection('bookmarks').doc(rem)
      checkRemedy.get()
          .then((docSnapshot) => {
            if (docSnapshot.exists){
         
              setBookMarkText("UNBOOKMARK")
              setCheckBookMark(true)
              
            }else{
             
              setBookMarkText("BOOKMARK")
              setCheckBookMark(false)
            }
          });
        
  }, [])

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{remedy.name}</Text>

        <View
         // style={{
        //    width: 150,
       ////     backgroundColor: "green",
       //   }}
       // <Image source={{uri: remedy.image}} style={{ width: 100, height: 150 }}/>
         
        />
        <View style={styles.info}>
          <Text style={styles.head}>Description</Text>
          <Text style={styles.desc}>{remedy.description}</Text>
          <Text style={styles.head}>Precautions</Text>
          <Text style={styles.desc}>{remedy.precautions}</Text>
        </View>
        <BookMarkButton 
        onPress={bookMarkRemedy}
        style={{ backgroundColor: "red" }} >
          {bookMarkText}
          </BookMarkButton>
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
