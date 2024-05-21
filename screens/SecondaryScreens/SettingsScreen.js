import React, { useCallback, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { UserContext } from "../../contexts/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = ({ navigation }) => {
  const { userLanguage, setUserLanguage } = useContext(UserContext);

  const handleLanguageChange = useCallback(async (languageCode) => {
    try {
      // Update the context or state with the new language
      setUserLanguage(languageCode);

      // Persist the preference
      await AsyncStorage.setItem("userLanguage", languageCode);

      // Get the language name based on the language code (example: 'ms' -> 'Bahasa Malaysia')
      const languageName = getLanguageName(languageCode);

      // Show feedback message
      Alert.alert(
        "Language Changed",
        `Language has been changed to ${languageName}.`,
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ]
      );

      // TODO: Refresh the content or re-render the app as needed
    } catch (error) {
      console.error("Error saving user language preference:", error);
      // Show error message if saving preference fails
      Alert.alert(
        "Error",
        "Failed to change language. Please try again later.",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ]
      );
    }
  }, []);

  const getLanguageName = (languageCode) => {
    // Add logic to map language codes to language names
    switch (languageCode) {
      case "ms":
        return "Bahasa Malaysia";
      // Add more cases for other languages as needed
      default:
        return languageCode; // Return the language code if no name is found
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.disclaimer}>
        Note: This screen is currently under development and some
        functionalities may not work as expected. We appreciate your patience
        and support as we work to improve the app.
      </Text>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleLanguageChange("en")}
      >
        <Text style={styles.optionText}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleLanguageChange("ms")}
      >
        <Text style={styles.optionText}>Bahasa Malaysia</Text>
      </TouchableOpacity>
      {/* Add more language options here */}
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate("ThemeSettings")}
      >
        <Text style={styles.optionText}>Theme Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#35D96F",
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#35D96F",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    width: "80%",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
});

export default SettingsScreen;
