import AppSettings from "../components/Home/AppSettings";
import { View, StyleSheet } from "react-native";
//random comment
const AppSettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.header}></View>
      <AppSettings />
    </View>
  );
};

export default AppSettingsScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingTop: 25,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 16,
    backgroundColor: "#35D96F",
  },
  rootContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
