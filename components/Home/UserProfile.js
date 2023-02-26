import { Text, TextInput, StyleSheet, View, Modal, Alert} from 'react-native';
import firebase from 'firebase/app';
import { useState, useEffect } from 'react'
import 'firebase/firestore';
import 'firebase/auth'
import Button from "../ui/Button";
import Toast from 'react-native-easy-toast';

const Col = (props) => {
  return(
    <View>
      <Text> {props.colorName}</Text>
    </View>
  )
}

const Themes = props => {
  return(
    <View>
      <Text> {props.colTheme} </Text>
    </View>
  )
}

function UserProfile() {
    //var user = auth.currentUser;
    const [userData, setUserData] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [newFirstName, setFirstName] = useState("");
    const [newLastName, setLastName] = useState("");
    const [newEmail, setEmail] = useState("");
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

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
      //updating email
      function updateEmail(email) {
        const user = firebase.auth().currentUser;
      
        user.updateEmail(email)
          .then(() => {
            console.log('Email updated successfully.');
            user.reload()
              .then(() => {
                userRef.set({
                  email: email,
                }, {merge: true})
                  .then(() => {
                    console.log('Firestore document updated successfully.');
                    alert("Email has been updated");
                  })
                  .catch((error) => {
                    console.error('Error updating Firestore document: ', error);
                  });
              })
              .catch((error) => {
                console.error('Error reloading user data: ', error);
              });
          })
          .catch((error) => {
            console.error('Error updating email: ', error);
          });
      }
      

      
      

      
  }

    
  

    

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(
      user.email,
      oldPassword
    );
    user.reauthenticateWithCredential(credentials)
      .then(() => {
        user.updatePassword(newPassword)
          .then(() => {
            alert('Password updated successfully');
            setModalVisible(false);
          })
          .catch((error) => {
            alert(error.message);
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  };


    const showAlert = (text) => {
      Alert.alert(
        text,
        'Your Changes Have Been Updated',
        [
          
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        
      );
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
            <Text> Email: {userData.email}</Text>
            <TextInput 
             autoCapitalize="none"
            style={styles.input}
            secureTextEntry={false}
            value={newEmail}
            onChangeText={setEmail}
            placeholder="Enter new email"></TextInput>
            </View>

          <Button onPress={updateUser}>
            Update
          </Button>


          
          <View>
      <Button  onPress={() => setModalVisible(true)}> 
          Change New Password
      </Button>
      
      <Modal visible={modalVisible} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
          <TextInput
            placeholder="Enter Old Password"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TextInput
            placeholder="Enter New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            placeholder="Enter Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Button title="Submit" onPress={handleChangePassword}> Submit</Button> 
          <Button title="Cancel" onPress={() => setModalVisible(false)}> Cancel </Button>
        </View>
      </Modal>
    </View>


          </>
        )}
      </>
    );
        

        
}

export default UserProfile;

const styles = StyleSheet.create({});
