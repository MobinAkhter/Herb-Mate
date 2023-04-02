import { useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView, Image, Alert } from "react-native";
import { db, auth } from "../../firebase";
import BigButton from "../ui/BigButton";
import BookMarkButton from "../ui/BookmarkButton";
import {getAuth} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from 'firebase/app';
import 'firebase/firestore';

function AboutRemedy({ rem }) {
  const [remedy, setRemedy] = useState({});
  const [bookMarkText, setBookMarkText] = useState("BookMark")
  const [checkBookMark, setCheckBookMark] = useState("")
  const [buttonColor, setButtonColor] = useState("red")

  // access firestore
  const remediesFirebase = db.collection("Remedies")
  const user = auth.currentUser.uid
  const userRef = db.collection('users').doc(user);

  // define the key for AsyncStorage
  //const remedyKey = typeof rem === 'string' ? 'remedy-' + rem : null;

  useEffect(() => {
    // define the key for AsyncStorage
    const remedyKey = 'remedy-' + rem;
    
    // check if the remedy is in the cache and if the data is still fresh
    AsyncStorage.getItem(remedyKey)
      .then(cachedData => {
        if (cachedData) {
          const {data, timestamp} = JSON.parse(cachedData);
          const ageInMinutes = (Date.now() - timestamp) / (1000 * 60);
          if (ageInMinutes < 120) { // cache is still fresh
            console.log("Remedy was cached")
            setRemedy(data);
            return;
          }
        }
        
        // fetch the remedy from Firestore and save it in the cache
        remediesFirebase
          .doc(rem)
          .get()
          .then(doc => {
            const data = doc.data();
            console.log('Fetching remedy from Firebase')
            setRemedy(data);
            AsyncStorage.setItem(remedyKey, JSON.stringify({data, timestamp: Date.now()}));
          })
          .catch(error => {
            console.error('Error fetching remedy from Firestore:', error);
          });
      });
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

  


  /**useEffect(() => {
    const checkRemedy = userRef.collection('bookmarks').doc(rem)
    checkRemedy.get()
      .then(docSnapshot => {
        if (docSnapshot.exists) {
          setBookMarkText("UNBOOKMARK")
          setCheckBookMark(true)
        } else {
          setBookMarkText("BOOKMARK")
          setCheckBookMark(false)
        }
      });

  }, []) **/

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{remedy.name}</Text>

        <View
         // style={{
        //    width: 150,
       ////     backgroundColor: "green",
       //   }}   onPress={bookMarkRemedy}
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
