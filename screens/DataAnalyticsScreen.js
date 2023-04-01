import { StyleSheet, Text, View } from "react-native";
import DataAnalytics from "../components/Home/DataAnalytics";

const DataAnalyticsScreen = ({}) => {
  return (
    <View style={styles.rootContainer}>
      <DataAnalytics />
    </View>
  );
};

export default DataAnalyticsScreen;

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
