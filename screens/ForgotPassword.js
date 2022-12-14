import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../firebase";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const forgotPassword = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent! Check your spam mail as well.");
      })
      .catch((error) => {
        alert(error);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.centerizedView}>
        <View style={styles.authBox}>
          <Text style={styles.loginTitleText}>Forgot Your Password?</Text>
          <Text style={styles.text}>
            Enter your email registered to the app and we will send you a link
            in your inbox to reset password.
          </Text>
          <View style={styles.inputBox}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              onChangeText={(email) => setEmail(email)}
              value={email}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="johnsmith@email.com"
            />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={forgotPassword}>
            <Text style={styles.loginButtonText}>Send Mail</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  centerizedView: {
    width: "100%",
    top: "15%",
  },
  authBox: {
    width: "90%",
    backgroundColor: "#fafafa",
    borderRadius: 20,
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingBottom: 40,
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  loginTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 55,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 6,
    paddingTop: 20,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#dfe4ea",
    borderRadius: 4,
    paddingHorizontal: 10,
    borderColor: "black",
  },
  loginButton: {
    backgroundColor: "#035afc",
    borderRadius: 4,
    marginTop: 10,
    paddingVertical: 10,
  },
  loginButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    color: "080808",
  },
});
