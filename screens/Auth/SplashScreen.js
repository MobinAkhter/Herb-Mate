import React, { useEffect } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace("Signup");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/leaf_icon.jpeg")}
        resizeMode="contain"
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Welcome to Herb Mate
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Discover the world of herbs
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#34A853",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginTop: 5,
  },
});

export default SplashScreen;
