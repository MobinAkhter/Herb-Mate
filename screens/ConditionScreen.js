import { StyleSheet, Text, View } from "react-native";
import ConditionList from "../components/Home/ConditionList";

function ConditionScreen({ route }) {
  const { bp } = route.params;
  return (
    <View style={styles.rootContainer}>
      <Text></Text>
      <ConditionList bodyPart={bp} />
    </View>
  );
}

export default ConditionScreen;

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
