import { StyleSheet, View, Text, TextInput, FlatList } from "react-native";
import { db, auth } from "../../firebase";
import { useEffect, useState } from "react";
import { Button } from "react-native";
import BigButton from "../ui/BigButton";
import { useNavigation } from "@react-navigation/native";


function AppSettings(){
/** *  const navigation = useNavigation();
  //need to extract the remedies collection from the user's bookmark collection

  const user = auth.currentUser.uid
  const userRef = db.collection("users").doc(user)
  const bookMarks =  userRef.collection("bookmarks").get()
  const [bookmarkCollection, setBookmarkCollection] = useState([]);

  useEffect( () => {
    const con = []
    bookMarks.then(querySnapshot => {
      querySnapshot.forEach(doc => {
        con.push({
          ...doc.data(),
          key: doc.id,
        });
      })
      setBookmarkCollection(con);
     })
  
  })  **/

  
    return(
        <>
        
            <Text> BOOKMARKS</Text>
            
         {/**   <FlatList
              data={bookmarkCollection}
              renderItem={({ item }) => (
                <View>
                  <BigButton
                  onPress={() => {
                    navigation.navigate("AboutRemedy", {
                      rem: item.name,
                    });
                  }}>
                  <Text>{item.name}</Text>
                  </BigButton>
                 
                </View>
              )}
              */} 
        </>
    )
}

export default AppSettings

const styles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffc2c2",
    },
    title: {
      fontSize: 18,
      marginVertical: 2,
    },
    subtitle: {
      fontSize: 14,
      color: "#888",
    },
  });