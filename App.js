import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { UserContext } from "./contexts/userContext";
import UserProvider from "./contexts/userContext";
import AuthenticatedStack from "./navigation/AuthenticatedStack";
import AuthStack from "./navigation/AuthStack";
import { auth } from "./firebase";
import { LogBox } from "react-native";

function Navigation() {
  LogBox.ignoreAllLogs();

  const { user, setUser } = React.useContext(UserContext);

  React.useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const user = await auth.currentUser;
    if (user !== null) {
      // add a check here to see if user is not null
      setUser(user);
    }
  }

  return (
    <NavigationContainer>
      {user ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      {/* <StatusBar style="light" /> */}
      <Navigation />
    </UserProvider>
  );
}
