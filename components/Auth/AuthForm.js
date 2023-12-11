import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import Button from "../ui/Button";
import Input from "./Input";
import Checkbox from "expo-checkbox";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";
import firebase from "firebase/app";
import "firebase/firestore";

function AuthForm({ isLogin, onSubmit, credentialsInvalid, setUser }) {
  const [enteredFirstName, setFirstName] = useState("");
  const [enteredLastName, setLastName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigation = useNavigation();

  const {
    email: emailIsInvalid,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  useEffect(() => {
    // Check if user's email is verified
    const user = auth.currentUser;
    if (user) {
      setEmailVerified(user.emailVerified);
    }
  }, []);

  useEffect(() => {
    if (termsAgreed) {
      setTermsModalVisible(false);
    }
  }, [termsAgreed]);

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

  const firestore = firebase.firestore();

  function submitHandler() {
    if (!isLogin && !termsAgreed) {
      Alert.alert(
        "Terms and Conditions",
        "Please agree to the terms and conditions."
      );
      return;
    }
    if (!isLogin) {
      auth
        .createUserWithEmailAndPassword(enteredEmail, enteredPassword)
        .then((authUser) => {
          // setUser(authUser.user);
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

            // Send verification email
            authUser.user
              .sendEmailVerification()
              .then(() => {
                // Verification link sent
                Alert.alert(
                  "Verification Email Sent",
                  "Please verify your email before signing in."
                );

                // Navigate to sign-in screen
                navigation.replace("Login");
              })
              .catch((error) => {
                console.log("Error sending verification email:", error);
              });
          });
        })
        .catch((error) => alert(error.message));
    } else {
      auth
        .signInWithEmailAndPassword(enteredEmail, enteredPassword)
        .then((authUser) => {
          if (authUser.user.emailVerified) {
            setUser(authUser.user);
            navigation.navigate("Home"); // Navigate to welcome screen if email is verified
          } else {
            Alert.alert(
              "Email Verification Required",
              "Please verify your email before signing in."
            );

            // Redirect to sign-in screen
            navigation.replace("Login");
          }
        })
        .catch((error) => alert(error));
    }
  }

  function toggleTermsModal() {
    setTermsModalVisible(!termsModalVisible);
  }

  return (
    <KeyboardAvoidingView style={styles.form}>
      <View>
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
          secure={!isPasswordVisible}
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

        {!isLogin && (
          <View style={styles.checkboxContainer}>
            <Checkbox value={termsAgreed} onValueChange={setTermsAgreed} />
            <TouchableOpacity onPress={toggleTermsModal}>
              <Text style={styles.checkboxLabel}>
                I agree to the{" "}
                <Text style={styles.linkText}>terms and conditions</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.buttons}>
          <Button onPress={submitHandler} style={styles.signupButton}>
            {isLogin ? "Log In" : "Sign Up"}
          </Button>
        </View>
      </View>

      <Modal visible={termsModalVisible} animationType="slide" transparent>
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Medical Disclosure</Text>
              {/* Create a separate file for this text and import it */}
              <Text style={styles.complianceText}>
                The herbal content in this app is provided as general health
                information only. It provides information on herbal remedies as
                an alternative treatment, but it is not a substitute for medical
                advice or treatment of any health condition. {"\n"}
                {"\n"}
                The team at HerbalLife makes no warranties about the
                effectiveness of the remedies in curing your health problems, so
                we do not assume any risk whatsoever for your use of the
                information contained within the app. {"\n"}
                {"\n"}You are hereby advised to consult with a herbalist or
                other professionals in the healthcare industry before using any
                of the information provided in this app. {"\n"}
                {"\n"}If you're on any medication, please consult with health
                care professionals before taking any remedies listed in the app.
                {"\n"}
                {"\n"}By agreeing to the terms and conditions, and registering
                to the app, you agree that neither the team at HerbalLife nor
                any other party is or will be liable for any decision you make
                based on the information provided in this app.
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={toggleTermsModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
  signupButton: {
    backgroundColor: "#35D96F",
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
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
    marginTop: 15,
  },
  complianceText: {
    fontSize: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
  },
});
