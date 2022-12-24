import { Text, TextInput, StyleSheet} from 'react-native';
import firebase from 'firebase/app';
import { useState, useEffect } from 'react'
import 'firebase/firestore';
import 'firebase/auth'

function UserProfile() {
    //var user = auth.currentUser;
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      const firestore = firebase.firestore();
      const auth = firebase.auth();
      const authId = auth.currentUser.uid;
      const userRef = firestore.collection('users').doc(authId);
  
      userRef.get().then((doc) => {
        if (doc.exists) {
          setUserData(doc.data());
        } else {
          console.log("No such user");
        }
      });
    }, []);
  
    return (
      <>
        {userData && (
          <>
            <Text>First Name: {userData.firstName}</Text>
            <Text>Last Name: {userData.lastName}</Text>
            <Text>Email: {userData.email}</Text>

            <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Enter Current Password"
     
      />
       <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Enter New Password"
      />
          </>
        )}
      </>
    );
        

  
}

export default UserProfile;

const styles = StyleSheet.create({});
