import { UserContext } from "../contexts/userContext";
import Icon from "@expo/vector-icons/FontAwesome";
import React from "react";
import {
  Text,
  StyleSheet,
  View,
  Alert,
  TextInput,
  Modal,
  Button as RNButton,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useState, useEffect, useLayoutEffect } from "react";
import Button from "../components/ui/Button";
// import { useTheme } from "../contexts/ThemeContext";
import firebase from "firebase/app";
import { auth } from "../firebase";

function UserProfileScreen({ navigation }) {
  const { setUser } = React.useContext(UserContext);

  const handleLogout = async () => {
    // console.log("logout");
    await auth.signOut();
    navigation.navigate("Login");
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
  const [emailChangeVisible, setEmailChangeVisible] = useState(false);
  // const { theme, toggleTheme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "User Profile",
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout}>
          <Text
            style={{
              color: "white",
              fontSize: 18,
              padding: 9,
              textAlign: "center",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

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

  // const getThemeStyles = (theme) => ({
  //   background: theme === "dark" ? "black" : "white",
  //   color: theme === "dark" ? "white" : "black",
  // });

  // const themeStyles = getThemeStyles(theme);

  return (
    <>
      {userData && (
        <>
          <View style={[styles.textContainer]}>
            <Text style={styles.text}>First Name*</Text>
            <TextInput
              style={styles.textInput}
              secureTextEntry={false}
              value={newFirstName}
              onChangeText={setFirstName}
              placeholder={userData.firstName}
              placeholderTextColor={"black"}
            ></TextInput>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}>Last Name*</Text>
            <TextInput
              style={styles.textInput}
              secureTextEntry={false}
              value={newLastName}
              onChangeText={setLastName}
              placeholder={userData.lastName}
              placeholderTextColor={"black"}
            ></TextInput>
          </View>

          <TouchableOpacity style={styles.continueButton} onPress={updateUser}>
            <Text style={styles.text}>Update</Text>
          </TouchableOpacity>

          <View>
            <Pressable style={styles.continueButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.text}> Change Password </Text>
            </Pressable>
            

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
                  placeholderTextColor={"black"}
                  style={textInputstyles.textInput}
                />

                <TextInput
                  placeholder="Enter New Password"
                  
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholderTextColor={"black"}
                  style={textInputstyles.textInput}
                />

                <TextInput
                  placeholder="Re-Enter New Password"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholderTextColor={"black"}
                  style={textInputstyles.textInput}
                />

                <View style={{ marginTop: 10, marginBottom: 10 }}>
                  <Button title="Submit" onPress={handleChangePassword}>
                    Submit
                  </Button>
                </View>

                <Button title="Cancel" onPress={() => setModalVisible(false)}>
                  Cancel
                </Button>
              </View>
            </Modal>

            <Modal visible={emailChangeVisible} animationType="slide">
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextInput
                  placeholder="Enter New Email"
                  secureTextEntry
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  placeholderTextColor={"black"}
                  style={textInputstyles.textInput}
                />

                <TextInput
                  placeholder="Enter Password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholderTextColor={"black"}
                  style={textInputstyles.textInput}
                />
                <View style={{ marginTop: 10, marginBottom: 10 }}>
                  <Button title="Submit" onPress={handleChangePassword}>
                    Submit
                  </Button>
                </View>

                <Button
                  title="Cancel"
                  onPress={() => setEmailChangeVisible(false)}
                >
                  Cancel
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
    fontSize: 15,
    fontWeight: "bold",
  },
  textInput: {
    padding: 20,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    marginTop: 20,
  },
  continueButton:{
    borderRadius: 10,
    borderWidth: 1.5,
    marginTop: 10,
    marginLeft: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderColor: "black",
    width: "50%",
    backgroundColor: "white"
  },
});

const textInputstyles = StyleSheet.create({
  textInput: {
    borderColor: "black", 
    borderWidth: 1, 
    padding: 10, 
    marginBottom: 10, 
    width: "90%", 
  },
});
