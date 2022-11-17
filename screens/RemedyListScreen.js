import { StyleSheet, Text, View } from "react-native";
import RemedyList from "../components/Home/RemedyList";

function RemedyListScreen({ route }) {
  const { bp, con, rem } = route.params;
  return (
    <View style={styles.rootContainer}>
      <RemedyList condition={con} bodyPart={bp} rem={rem} />
    </View>
  );
}

export default RemedyListScreen;

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
