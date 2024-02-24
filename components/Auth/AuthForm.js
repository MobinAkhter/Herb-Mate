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
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import Button from "../ui/Button";
import Input from "./Input";
import Checkbox from "expo-checkbox";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
// import firebase from "firebase/app";
// import "firebase/firestore";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // const firestore = firebase.firestore();

  function submitHandler() {
    setIsSubmitting(true);
    if (!isLogin && !termsAgreed) {
      Alert.alert(
        "Terms and Conditions",
        "Please agree to the terms and conditions."[
          { text: "OK", onPress: () => setIsSubmitting(false) }
        ]
      );
      return;
    }
    if (!isLogin && enteredPassword !== enteredConfirmPassword) {
      Alert.alert("Password Error", "Passwords do not match.", [
        { text: "OK", onPress: () => setIsSubmitting(false) },
      ]);
      return;
    }
    if (!isLogin) {
      const passwordStrengthRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!enteredPassword.match(passwordStrengthRegex)) {
        Alert.alert(
          "Weak Password",
          "Password must be at least 8 characters long, include a number, a symbol, and both uppercase and lowercase letters."
        );
        return;
      }
      createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword)
        .then((authUser) => {
          const authId = authUser.user.uid;
          const newUser = {
            firstName: enteredFirstName,
            lastName: enteredLastName,
            email: enteredEmail,
          };
          // Use Firestore setDoc to save the user's details
          const userRef = doc(db, "users", authId);
          return setDoc(userRef, newUser); // Continue the promise chain
        })
        .then(() => {
          console.log("User created and saved successfully");
          // Call sendEmailVerification here with the current user object
          if (auth.currentUser) {
            return sendEmailVerification(auth.currentUser); // Correctly call sendEmailVerification
          }
        })
        .then(() => {
          console.log("Verification email sent");
          Alert.alert(
            "Verification Email Sent",
            "Please verify your email before signing in.",
            [{ text: "OK", onPress: () => setIsSubmitting(false) }]
          );
          navigation.navigate("Login");
        })
        .catch((error) => {
          console.error(
            "Error during the sign-up or email verification process:",
            error
          );
          alert(error.message);
          setIsSubmitting(false);
        });
    } else {
      signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
        .then((authUser) => {
          console.log(authUser);
          if (authUser.user.emailVerified) {
            setUser(authUser.user);
            navigation.navigate("Home"); // Navigate to welcome screen if email is verified
          } else {
            Alert.alert(
              "Email Verification Required",
              "Please verify your email before signing in.",
              [{ text: "OK", onPress: () => setIsSubmitting(false) }]
            );
            // Redirect to sign-in screen
            navigation.navigate("Login");
          }
        })
        .catch((error) => {
          if (error.code === "auth/wrong-password") {
            Alert.alert(
              "Login Failed",
              "The password you entered is incorrect. Please try again.",
              [{ text: "OK", onPress: () => setIsSubmitting(false) }]
            );
          } else if (error.code === "auth/user-not-found") {
            Alert.alert(
              "Login Failed",
              "No user found with this email. Please sign up.",
              [{ text: "OK", onPress: () => setIsSubmitting(false) }]
            );
          } else {
            Alert.alert(
              "Login Error",
              "An unexpected error occurred. Please try again later."[
                { text: "OK", onPress: () => setIsSubmitting(false) }
              ]
            );
          }
        });
    }
  }

  function toggleTermsModal() {
    setTermsModalVisible(!termsModalVisible);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.form}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {!isLogin && (
              <Input
                label="First Name"
                placeholder="John"
                onUpdateValue={updateInputValueHandler.bind(this, "firstName")}
                value={enteredFirstName}
              />
            )}
            {!isLogin && (
              <Input
                label="Last Name"
                placeholder="Doe"
                onUpdateValue={updateInputValueHandler.bind(this, "lastName")}
                value={enteredLastName}
              />
            )}
            <Input
              label="Email Address"
              placeholder="email@gmail.com"
              onUpdateValue={updateInputValueHandler.bind(this, "email")}
              value={enteredEmail}
              keyboardType="email-address"
              isInvalid={emailIsInvalid}
            />

            <Input
              label="Password"
              placeholder="Password"
              onUpdateValue={updateInputValueHandler.bind(this, "password")}
              secure={!isPasswordVisible}
              value={enteredPassword}
              isInvalid={passwordIsInvalid}
            />

            {!isLogin && (
              <Input
                label="Confirm Password"
                placeholder="Confirm Password" // Add placeholder prop like this
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
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel="I agree to the terms and conditions"
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: termsAgreed }}
                  onPress={toggleTermsModal}
                >
                  <Text style={styles.checkboxLabel}>
                    I agree to the{" "}
                    <Text style={styles.linkText}>terms and conditions</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.buttons}>
              <Button onPress={submitHandler} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <ActivityIndicator size="small" color="#FFF" />
                    {isLogin ? " Logging In..." : " Signing Up..."}
                  </>
                ) : isLogin ? (
                  "Log In"
                ) : (
                  "Sign Up"
                )}
              </Button>
            </View>
          </View>
        </ScrollView>

        <Modal visible={termsModalVisible} animationType="slide" transparent>
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Medical Disclosure</Text>
                {/* Create a separate file for this text and import it */}
                <Text style={styles.complianceText}>
                  The herbal content in this app is provided as general health
                  information only. It provides information on herbal remedies
                  as an alternative treatment, but it is not a substitute for
                  medical advice or treatment of any health condition. {"\n"}
                  {"\n"}
                  The team at Herb Mate makes no warranties about the
                  effectiveness of the remedies in curing your health problems,
                  so we do not assume any risk whatsoever for your use of the
                  information contained within the app. {"\n"}
                  {"\n"}You are hereby advised to consult with a herbalist or
                  other professionals in the healthcare industry before using
                  any of the information provided in this app. {"\n"}
                  {"\n"}If you're on any medication, please consult with health
                  care professionals before taking any remedies listed in the
                  app.
                  {"\n"}
                  {"\n"}By agreeing to the terms and conditions, and registering
                  to the app, you agree that neither the team at Herb Mate nor
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
    </TouchableWithoutFeedback>
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
  disabledButton: {
    backgroundColor: "gray",
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
  closeButton: {
    height: 48,
    width: 48,
    // backgroundColor: "lightgreen",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "blue",
  },
});
