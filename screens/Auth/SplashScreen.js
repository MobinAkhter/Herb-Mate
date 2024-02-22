import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, StatusBar } from "react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Signup");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Image
        // source={require("./path-to-logo.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to Herb Mate</Text>
      <Text style={styles.subtitle}>Discover the world of herbs</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7", // A light grey background color
  },
  logo: {
    width: 150, // Adjust according to your logo's aspect ratio
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700", // Bold font weight
    color: "#34A853", // Primary color for your brand
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555", // Subdued text color for contrast
    marginTop: 5,
  },
});

export default SplashScreen;
