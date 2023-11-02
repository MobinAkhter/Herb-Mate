import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import Lottie from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const OnboardingScreen = () => {
  const navigation = useNavigation();

  const handleFinishOnboarding = async () => {
    await AsyncStorage.setItem("alreadyLaunched", "true");
    navigation.replace("Signup");
  };

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleFinishOnboarding}
        onSkip={handleFinishOnboarding}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: "#a7f3d0",
            image: (
              <View style={styles.lottie}>
                <Lottie
                  style={{ flex: 1 }}
                  source={require("../assets/animations/leaves.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Discover Natural Remedies",
            subtitle:
              "Explore a vast collection of herbal solutions tailored to treat various conditions.",
          },
          {
            backgroundColor: "#fef3c7",
            image: (
              <View style={styles.lottie}>
                <Lottie
                  style={{ flex: 1 }}
                  source={require("../assets/animations/chatbot.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "Personalized Assistance",
            subtitle:
              "Chat with our intelligent bot to find the perfect remedy for your needs.",
          },
          {
            backgroundColor: "#a78bfa",
            image: (
              <View style={styles.lottie}>
                <Lottie
                  style={{ flex: 1 }}
                  source={require("../assets/animations/books.json")}
                  autoPlay
                  loop
                />
              </View>
            ),
            title: "A-Z of Herbs",
            subtitle:
              "Dive deep into our extensive herb library and learn about the benefits and uses of each herb.",
          },
        ]}
      />
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
});
