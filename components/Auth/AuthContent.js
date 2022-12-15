import { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import FlatButton from "../ui/FlatButton";
import AuthForm from "./AuthForm";
import { Colors } from "../../constants/styles";
import { auth } from "../../firebase";
function AuthContent({ isLogin, onAuthenticate }) {
  const navigation = useNavigation();

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    // confirmEmail: false,
    confirmPassword: false,
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace("Signup");
    } else {
      navigation.replace("Login");
    }
  }
  function switchToForgot() {
    if (isLogin) {
      navigation.replace("ForgotPassword");
    }
  }

  function submitHandler(credentials) {
    let { email, password } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes("@");
    const passwordIsValid = password.length > 6;
    // const emailsAreEqual = email === confirmEmail;
    // const passwordsAreEqual = password === confirmPassword;

    if (!emailIsValid || !passwordIsValid || (!isLogin && !passwordsAreEqual)) {
      Alert.alert("Invalid input", "Please check your entered credentials.");
      setCredentialsInvalid({
        email: !emailIsValid,
        // confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password });
  }

  return (
    <KeyboardAvoidingView style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin ? "Don't have an account? Sign up now!" : "Log In Instead!"}
        </FlatButton>
      </View>
      <View>
        {isLogin && (
          <FlatButton onPress={switchToForgot}>Forgot password?</FlatButton>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#35D96F",
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});
