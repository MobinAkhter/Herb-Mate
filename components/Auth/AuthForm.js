import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import Button from "../ui/Button";
import Input from "./Input";
import Checkbox from "expo-checkbox";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/app";
import "firebase/firestore";
import { Modal } from "react-native";

function AuthForm({ isLogin, onSubmit, credentialsInvalid, setUser }) {
  const [enteredFirstName, setFirstName] = useState("");
  const [enteredLastName, setLastName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const navigation = useNavigation();

  const {
    email: emailIsInvalid,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  const [toggleCheckbox, setToggleCheckbox] = useState(false);
  const [complianceModal, setComplianceModal] = useState(true);

  useEffect(() => {
    if (!complianceModal) {
      // Navigate to the "Signup" screen when complianceModal becomes false
      navigation.navigate("Signup");
    }
  }, [complianceModal, navigation]);

  const handleContinueRegistration = () => {
    if (toggleCheckbox) {
      setComplianceModal(false);
    }
  };

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "firstName":
        setFirstName(enteredValue);
        break;
      case "lastName":
        setLastName(enteredValue);
        break;
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }
  function toggleTermsModal() {
    setTermsModalVisible(!termsModalVisible);
  }
  function agreeToTerms() {
    setTermsAgreed(true);
    setTermsModalVisible(false);
  }

  const firestore = firebase.firestore();

  function submitHandler() {
    if (!termsAgreed) {
      // Show an error message or prevent submission
      return;
    }
    if (isLogin) {
      auth
        .signInWithEmailAndPassword(enteredEmail, enteredPassword)
        .then((authUser) => {
          setUser(authUser.user);
          // navigation.navigate("Welcome");
        })

        .catch((error) => alert(error));
    } else {
      auth

        .createUserWithEmailAndPassword(enteredEmail, enteredPassword)
        .then((authUser) => {
          setUser(authUser.user);
          console.log(authUser.user.uid);
          const authId = authUser.user.uid;
          const usersCollection = firestore.collection("users").doc(authId);
          const newUser = {
            firstName: enteredFirstName,
            lastName: enteredLastName,
            email: enteredEmail,
          };
          usersCollection.set(newUser).then(() => {
            console.log("User created successfully");
            //     const foodsCollection = firestore.collection('users').doc(authId).collection('bookmarks');
            // Create an empty document to create the collection
            //     foodsCollection.doc('remedy').set({})
          });
        })
        .catch((error) => alert(error.message));
    }
  }

  return (
    <KeyboardAvoidingView style={styles.form}>
      <View>
        {/* Shows on signup screen and not on login screen */}
        {!isLogin && (
          <Input
            label="First Name"
            onUpdateValue={updateInputValueHandler.bind(this, "firstName")}
            value={enteredFirstName}
          />
        )}
        {!isLogin && (
          <Input
            label="Last Name"
            onUpdateValue={updateInputValueHandler.bind(this, "lastName")}
            value={enteredLastName}
          />
        )}
        <Input
          label="Email Address"
          onUpdateValue={updateInputValueHandler.bind(this, "email")}
          value={enteredEmail}
          keyboardType="email-address"
          isInvalid={emailIsInvalid}
        />

        <Input
          label="Password"
          onUpdateValue={updateInputValueHandler.bind(this, "password")}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />

        {!isLogin && (
          <Input
            label="Confirm Password"
            onUpdateValue={updateInputValueHandler.bind(
              this,
              "confirmPassword"
            )}
            secure
            value={enteredConfirmPassword}
            isInvalid={passwordsDontMatch}
          />
        )}
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </View>
      </View>

      {/* Terms and condition modal */}
      {/* Make it as a separate component later */}
      <View style={styles.mainContainer}>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={complianceModal}
          >
            <SafeAreaView>
              <ScrollView>
                <View style={styles.modalContainer}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalComplianceTitle}>
                      Medical Disclosure
                    </Text>
                    {/* Create a separate file for this text and import it */}
                    <Text style={styles.complianceText}>
                      The herbal content in this app is provided as general
                      health information only. It provides information on herbal
                      remedies as an alternative treatment, but it is not a
                      substitute for medical advice or treatment of any health
                      condition. {"\n"}
                      {"\n"}
                      The team at HerbalLife makes no warranties about the
                      effectiveness of the remedies in curing your health
                      problems, so we do not assume any risk whatsoever for your
                      use of the information contained within the app. {"\n"}
                      {"\n"}You are hereby advised to consult with a herbalist
                      or other professionals in the healthcare industry before
                      using any of the information provided in this app. {"\n"}
                      {"\n"}If you're on any medication, please consult with
                      health care professionals before taking any remedies
                      listed in the app.{"\n"}
                      {"\n"}By agreeing to the terms and conditions, and
                      registering to the app, you agree that neither the team at
                      HerbalLife nor any other party is or will be liable for
                      any decision you make based on the information provided in
                      this app.
                    </Text>
                    <View style={styles.checkboxContainer}>
                      <Checkbox
                        style={styles.checkbox}
                        disabled={false}
                        value={toggleCheckbox}
                        onValueChange={(newValue) =>
                          setToggleCheckbox(newValue)
                        }
                      />
                      <Text>I agree to the terms and conditions</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.registerButton,
                        {
                          backgroundColor: toggleCheckbox
                            ? "lightblue"
                            : "grey",
                        },
                      ]}
                      disabled={!toggleCheckbox}
                      onPress={handleContinueRegistration}
                    >
                      <Text>Continue to register</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </SafeAreaView>
          </Modal>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  checkboxLabel: {
    marginLeft: 8,
  },

  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: "80%",
    maxHeight: "80%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },

  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    margin: 20,
    padding: 20,
    alignItems: "center",
  },
  modalComplianceTitle: {
    marginBottom: 20,
    color: "lightblue",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  complianceText: {
    fontSize: 15,
  },

  checkbox: {
    width: 25,
    height: 25,
    marginRight: 20,
  },
  registerButton: {
    marginTop: 20,
    padding: 20,
    borderRadius: 18,
  },
});
