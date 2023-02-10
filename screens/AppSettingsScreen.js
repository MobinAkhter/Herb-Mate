import AppSettings from "../components/Home/AppSettings";
import { StyleSheet, View } from "react-native";

const AppSettingsScreen = ({ navigation }) => {
    return (
      <View>
        <AppSettings/>
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
  