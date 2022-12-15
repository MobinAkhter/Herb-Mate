import { StyleSheet, Text, View } from "react-native";
import UserProfile from "../components/Home/UserProfile";

function UserProfileScreen() {
  return (
    <View style={styles.rootContainer}>
      <UserProfile />
    </View>
  );
}

export default UserProfileScreen;

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
