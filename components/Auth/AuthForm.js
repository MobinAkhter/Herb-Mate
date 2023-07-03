import React, { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";
import Button from "../ui/Button";
import Input from "./Input";
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
  const navigation = useNavigation();

  const {
    email: emailIsInvalid,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

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
    </KeyboardAvoidingView>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
});
