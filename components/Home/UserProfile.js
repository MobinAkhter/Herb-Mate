import { Text, TextInput, StyleSheet, View, Modal} from 'react-native';
import firebase from 'firebase/app';
import { useState, useEffect } from 'react'
import 'firebase/firestore';
import 'firebase/auth'
import Button from "../ui/Button";

function UserProfile() {
    //var user = auth.currentUser;
    const [userData, setUserData] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [newFirstName, setFirstName] = useState("");
    const [newLastName, setLastName] = useState("");
    const [newEmail, setEmail] = useState("");

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

    const updateUser = async () => {
     
      const firestore = firebase.firestore();
      const auth = firebase.auth();
      const authId = auth.currentUser.uid;
      const userRef = firestore.collection('users').doc(authId);

      
    
   /*   await userRef.set({
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail
      }, {merge: true}).catch((error) => {
        console.error('Error updating document: ', error);
      }); */

      if(newFirstName != "")
      {
        updateFirst(newFirstName)
      }

      if(newLastName != "")
      {
        updateLast(newLastName)
      }

      if(newEmail != "")
      {
        updateEmail(newEmail)
      }


      function updateFirst(first){
         userRef.set({
          firstName: first,
        }, {merge: true}).catch((error) => {
          console.error('Error updating document: ', error);
        });
      }

      function updateLast(last){
        userRef.set({
          lastName: last,
        }, {merge: true}).catch((error) => {
          console.error('Error updating document: ', error);
        });
      }

      function updateEmail(email){
        userRef.set({
          email: email
        }, {merge: true}).catch((error) => {
          console.error('Error updating document: ', error);
        });
      }

    }//end function

    const toggleModal = () => {
      setIsVisible(!isVisible);
    };

    const checkPassword = (pass) =>{

    }

    
   
  
    return (
      <>
        {userData && (
          <>
            <View>
            <Text>First Name: {userData.firstName}</Text>
            <TextInput 
            style={styles.input}
            secureTextEntry={false}
            value={newFirstName}
            onChangeText={setFirstName}
            placeholder="Enter new first name">

            </TextInput>
            </View>

            <View>
            <Text>Last Name: {userData.lastName}</Text>
            <TextInput 
            style={styles.input}
            secureTextEntry={false}
            value={newLastName}
            onChangeText={setLastName}
            placeholder="Enter new last name"></TextInput>
            </View>

            <View>
            <Text> <Text>Email: {userData.email}</Text></Text>
            <TextInput 
            style={styles.input}
            secureTextEntry={false}
            value={newEmail}
            onChangeText={setEmail}
            placeholder="Enter new email"></TextInput>
            </View>

          <Button onPress={updateUser}>
            Change NOW
          </Button>
            
          <Button onPress={toggleModal}>
           Confirm Changes
          </Button>

          <View>
          <Modal visible={isVisible} animationType="slide">
        <View style={{ marginTop: 22 }}>
          <View>
            <Text>Enter Current Password</Text>
            <TextInput 
            style={styles.input}
            secureTextEntry={true}
            placeholder="Current Password"></TextInput>
            <Button title="Close" onPress={toggleModal}> Close</Button>
          </View>
        </View>
      </Modal>

    
          </View>

          <Button>
            Create New Password
          </Button>
    
          </>
        )}
      </>
    );
        

  
}

export default UserProfile;

const styles = StyleSheet.create({});
