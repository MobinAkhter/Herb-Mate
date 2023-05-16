import { StyleSheet, View } from "react-native";
import RemediesBarGraph from "../components/Home/RemediesBarGraph";

const RemediesBarGraphScreen = ({}) => {
  return (
    <View style={styles.rootContainer}>
      <RemediesBarGraph />
    </View>
  );
};

export default RemediesBarGraphScreen;

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
