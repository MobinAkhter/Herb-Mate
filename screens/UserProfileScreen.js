import { UserContext } from "../contexts/userContext";
import Icon from "@expo/vector-icons/FontAwesome";
import React from "react";
import { auth } from "../firebase";
import {
  Text,
  StyleSheet,
  View,
  Alert,
  TextInput,
  Modal,
  Button as RNButton,
} from "react-native";
import firebase from "firebase/app";
import { useState, useEffect } from "react";
// import "firebase/firestore";
// import "firebase/auth";
import Button from "../components/ui/Button";

function UserProfileScreen({ navigation }) {
  const { setUser } = React.useContext(UserContext);

  const handleLogout = async () => {
    console.log("logout");
    await auth.signOut();
    setUser(null);
  };

  //var user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [newFirstName, setFirstName] = useState("");
  const [newLastName, setLastName] = useState("");
  const [newEmail, setEmail] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const firestore = firebase.firestore();
    const auth = firebase.auth();
    const authId = auth.currentUser.uid;
    const userRef = firestore.collection("users").doc(authId);
    userRef.get().then((doc) => {
      if (doc.exists) {
        setUserData(doc.data());
      }
    });
  }, []);

  const updateUser = async () => {
    const firestore = firebase.firestore();
    const auth = firebase.auth();
    const authId = auth.currentUser.uid;
    const userRef = firestore.collection("users").doc(authId);

    if (newFirstName != "") {
      updateFirst(newFirstName);
    }

    if (newLastName != "") {
      updateLast(newLastName);
    }

    if (newEmail != "") {
      updateEmail(newEmail);
    }

    function updateFirst(first) {
      userRef
        .set(
          {
            firstName: first,
          },
          { merge: true }
        )
        .catch((error) => {});
    }

    function updateLast(last) {
      userRef
        .set(
          {
            lastName: last,
          },
          { merge: true }
        )
        .catch((error) => {});
    }
    //updating email
    function updateEmail(email) {
      const user = firebase.auth().currentUser;

      user
        .updateEmail(email)
        .then(() => {
          user
            .reload()
            .then(() => {
              userRef
                .set(
                  {
                    email: email,
                  },
                  { merge: true }
                )
                .then(() => {
                  alert("Email has been updated");
                })
                .catch((error) => {});
            })
            .catch((error) => {});
        })
        .catch((error) => {});
    }
  };

  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(
      user.email,
      oldPassword
    );
    user
      .reauthenticateWithCredential(credentials)
      .then(() => {
        user
          .updatePassword(newPassword)
          .then(() => {
            alert("Password updated successfully");
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
    Alert.alert(text, "Your Changes Have Been Updated", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  return (
    <>
      <View style={styles.header}>
        <Icon
          style={styles.backIcon}
          name="arrow-left"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>User Profile</Text>
        <RNButton color="white" title={"Logout"} onPress={handleLogout} />
      </View>
      {userData && (
        <>
          <View style={styles.textContainer}>
            <Text style={styles.text}>First Name: {userData.firstName}</Text>
            <TextInput
              style={styles.textInput}
              secureTextEntry={false}
              value={newFirstName}
              onChangeText={setFirstName}
              placeholder="Enter new first name"
            ></TextInput>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}>Last Name: {userData.lastName}</Text>
            <TextInput
              style={styles.textInput}
              secureTextEntry={false}
              value={newLastName}
              onChangeText={setLastName}
              placeholder="Enter new last name"
            ></TextInput>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}> Email: {userData.email}</Text>
            <TextInput
              autoCapitalize="none"
              style={styles.textInput}
              secureTextEntry={false}
              value={newEmail}
              onChangeText={setEmail}
              placeholder="Enter new email"
            ></TextInput>
          </View>

          <Button onPress={updateUser}>Update</Button>

          <View>
            <Button onPress={() => setModalVisible(true)}>
              Change Password
            </Button>

            <Modal visible={modalVisible} animationType="slide">
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
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
                <Button title="Submit" onPress={handleChangePassword}>
                  {" "}
                  Submit
                </Button>
                <Button title="Cancel" onPress={() => setModalVisible(false)}>
                  {" "}
                  Cancel{" "}
                </Button>
              </View>
            </Modal>
          </View>
        </>
      )}
    </>
  );
}

export default UserProfileScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    justifyContent: "space-between",
    backgroundColor: "#35D96F",
    padding: 16,
  },

  title: {
    flex: 1, // Add flex property
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 40,
    textAlign: "center",
  },
  textContainer: {
    marginHorizontal: 20,
    marginTop: 15,
  },
  text: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: "bold",
  },
  textInput: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: "50%",
    marginBottom: 15,
  },
});
