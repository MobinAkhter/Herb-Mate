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
    <>
      <View style={styles.header}>
        <Icon
          style={styles.backIcon}
          name="arrow-left"
          size={24}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>User Profile</Text>
        <Button color="white" title={"Logout"} onPress={handleLogout} />
      </View>
      <UserProfile />
    </>
  );
}

export default UserProfileScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    justifyContent: "space-between",
    backgroundColor: "#35D96F",
    padding: 16,
  },

  title: {
    flex: 1, // Add flex property
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 40,
    textAlign: "center",
  },
});
