import { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";

import Button from "../ui/Button";
import Input from "./Input";
import { auth } from "../../firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function AuthForm({ isLogin, onSubmit, credentialsInvalid }) {
  const [enteredFirstName, setFirstName] = useState("");
  const [enteredLastName, setLastName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  // const [enteredConfirmEmail, setEnteredConfirmEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");

  const {
    email: emailIsInvalid,
    // confirmEmail: emailsDontMatch,
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
      // case "confirmEmail":
      //   setEnteredConfirmEmail(enteredValue);
      //   break;
      case "password":
        setEnteredPassword(enteredValue);
        break;
      case "confirmPassword":
        setEnteredConfirmPassword(enteredValue);
        break;
    }
  }

  function submitHandler() {
    // onSubmit({
    //   // firstName: enteredFirstName,
    //   // lastName: enteredLastName,
    //   email: enteredEmail,
    //   // confirmEmail: enteredConfirmEmail,
    //   password: enteredPassword,
    //   // confirmPassword: enteredConfirmPassword,
    // });
    auth
      .createUserWithEmailAndPassword(enteredEmail, enteredPassword)
      .then((authUser) => {
        // authUser.user.updateProfile(email, password);
      })
      .catch((error) => alert(error.message));
  }

  return (
    <KeyboardAvoidingView style={styles.form}>
      <View>
        {/* Will distinguish each field later, for now want it to appear nicel */}
        {!isLogin && (
          <Input
            label="First Name"
            onUpdateValue={updateInputValueHandler.bind(this, "firstName")}
            value={enteredFirstName}
            // keyboardType="email-address"
            // isInvalid={emailIsInvalid}
          />
        )}
        {!isLogin && (
          <Input
            label="Last Name"
            onUpdateValue={updateInputValueHandler.bind(this, "lastName")}
            value={enteredLastName}
            // keyboardType="email-address"
            // isInvalid={emailIsInvalid}
          />
        )}
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
    </KeyboardAvoidingView>
  );
}

export default AuthForm;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 12,
  },
});
