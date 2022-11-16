import { useState } from "react";
import { StyleSheet, View } from "react-native";

import Button from "../ui/Button";
import Input from "./Input";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [enteredFirstName, setFirstName] = useState("");
  const [enteredLastName, setLastName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  const {
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
  } = credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "firstName":
        setFirstName(enteredValue);
        break;
      case "LastName":
        setLastName(enteredValue);
        break;
      case "email":
        setEnteredEmail(enteredValue);
        break;
      case "confirmEmail":
        setEnteredConfirmEmail(enteredValue);
        break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      firstName: enteredFirstName,
      lastName: enteredLastName,
      email: enteredEmail,
      // confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
    });
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  return (
    <View style={styles.form}>
      <View>
        {/* Will distinguish each field later, for now want it to appear nicel */}
        <Input
          label="First Name"
          onUpdateValue={updateInputValueHandler.bind(this, "firstName")}
          value={enteredFirstName}
          // keyboardType="email-address"
          // isInvalid={emailIsInvalid}
        />
        <Input
          label="Last Name"
          onUpdateValue={updateInputValueHandler.bind(this, "lastName")}
          value={enteredLastName}
          // keyboardType="email-address"
          // isInvalid={emailIsInvalid}
        />
        <Input
          label="Email Address"
          onUpdateValue={updateInputValueHandler.bind(this, "email")}
          value={enteredEmail}
          keyboardType="email-address"
          isInvalid={emailIsInvalid}
        />
        {/* {!isLogin && (
          <Input
            label="Confirm Email Address"
            onUpdateValue={updateInputValueHandler.bind(this, "confirmEmail")}
            value={enteredConfirmEmail}
            keyboardType="email-address"
            isInvalid={emailsDontMatch}
          />
        )} */}
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
    </View>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
});
