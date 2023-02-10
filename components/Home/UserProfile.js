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

      function updateEmail(email){
        userRef.set({
          email: email,
        }, {merge: true}).catch((error) => {
          console.error('Error updating document: ', error);
        });
        
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            user.updateEmail(email).then(() => {
              console.log('Email updated successfully.');
              user.sendEmailVerification().then(() => {
                console.log('Verification email sent.');
            }).catch((error) => {
                console.log(error);
            });
            }).catch((error) => {
              console.log(error);
            });
          }
        });
       
  
      }

      showAlert();

    }//end function

    
  

    const toggleModal = () => {
      setIsVisible(!isVisible);
    };

    
    function changePassword(newPassword) {
      if(newPassword == "")
      {
          passEmptyAlert();
      }
      var user = firebase.auth().currentUser;
      user.updatePassword(newPassword).then(() => {
          console.log("Password Updated!");
          passAlert()
      }).catch((error) => {
          console.log(error);
      });
  }


  const passAlert = () => {
    Alert.alert(
      'Password Update',
      'Your Password Has Been Changed',
      [
        
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      
    );
  }

  const passEmptyAlert = () => {
    Alert.alert(
      'Password Empty',
      'Please Enter Your New Password',
      [
        
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      
    );
  }

    const showAlert = () => {
      Alert.alert(
        'Update',
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
            Change NOW
          </Button>

          <Text>Enter New Password</Text>
                <TextInput 
                  autoCapitalize="none"
                  style={styles.input}
                  secureTextEntry={true}
                  value={newPass}
                  onChangeText={setNewPass}
                  placeholder="Enter new password">
            </TextInput>
            
          <Button onPress={() => changePassword(newPass)} >
           Change Password
          </Button>

          <View>
            <Col colorName="Green" ></Col>
            <Col colorName="Blue" ></Col>
            <Col colorName="Red" ></Col>
            <Col colorName="Orange" ></Col>
            <Col colorName="Magenta" ></Col>
            <Col colorName="Purple" ></Col>
          </View>

          <View>
            <Text> Color Themes</Text>
            <Themes colTheme="Light"></Themes>
            <Themes colTheme="Dim"></Themes>
            <Themes colTheme="Dark"></Themes>
          </View>
          </>
        )}
      </>
    );
        

        
}

export default UserProfile;

const styles = StyleSheet.create({});
