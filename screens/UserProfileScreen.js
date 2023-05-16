import { StyleSheet, Text, View, Button } from "react-native";
import UserProfile from "../components/Home/UserProfile";
import { UserContext } from "../contexts/userContext";
import Icon from "@expo/vector-icons/FontAwesome";
import React from "react";
import { auth } from "../firebase";

function UserProfileScreen({ navigation }) {
  const { setUser } = React.useContext(UserContext);

  const handleLogout = async () => {
    console.log("logout");
    await auth.signOut();
    setUser(null);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        {/* <Text style={styles.title}>User Profile</Text> */}
        <Button title={"Logout"} onPress={handleLogout} />
      </View>
      <UserProfile />
    </View>
  );
}

export default UserProfileScreen;

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flexDirection: "row",
    // alignItems: "center",
    backgroundColor: "#35D96F",
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
