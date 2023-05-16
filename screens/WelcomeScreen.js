import { StyleSheet, Text, View } from "react-native";
import WelcomePage from "../components/Home/WelcomePage.js";

const WelcomeScreen = ({}) => {
  return (
    <View style={styles.rootContainer}>
      <WelcomePage />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
