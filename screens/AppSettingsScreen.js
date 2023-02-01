import AppSettings from "../components/Home/AppSettings";
import { View, StyleSheet, Icon, Text, Button } from "react-native";

const AppSettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.header}>
        {/* <Icon
          name="arrow-left"
          size={24}
          color="white"
          onPress={() => navigation.navigate("Welcome")}
        />
        <Text style={styles.title}>User Profile</Text>
        <Button title={"Logout"} /> */}
      </View>
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
