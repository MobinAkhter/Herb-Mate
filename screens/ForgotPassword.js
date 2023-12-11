import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../firebase";

const ForgotPassword = ({}) => {
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
            <Text style={styles.loginButtonText}>Reset Password</Text>
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
    backgroundColor: "#35D96F",
  },
  centerizedView: {
    width: "100%",
    top: "10%",
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    flex: 1,
    paddingTop: 40,
    alignItems: "center",
  },
  authBox: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingBottom: 40,
  },
  loginTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 20,
    textAlign: "center",
  },
  text: {
    fontSize: 17,
    paddingBottom: 20,
    textAlign: "center",
  },
  inputBox: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: "#323232",
    // alternate background color: '#1A8F57', '#789048'
    borderRadius: 4,
    marginTop: 10,
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 18,
  },
});
