import { StyleSheet, View } from "react-native";
import AboutRemedy from "../components/Home/AboutRemedy";

function AboutRemedyScreen({ route }) {
  const { bp, con, rem } = route.params;
  return (
    <View style={styles.rootContainer}>
      <AboutRemedy condition={con} bodyPart={bp} rem={rem} />
    </View>
  );
}

export default AboutRemedyScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
