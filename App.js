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

  // React.useEffect(() => {
  //   getUser();
  // }, []);

  // async function getUser() {
  //   const user = await auth.currentUser;
  //   if (user !== null) {
  //     // add a check here to see if user is not null
  //     setUser(user);
  //   }
  // }
  // Updating EXPO SDK SO that the app can run on physcial device using Expo Go.
  // Will try to fix these buttons and make them dynamic, so that the text shows up nicely.
  //Apparently last time, it automatically wanted me to upgrade to 48.0.0, i'll try 47.0.0, if it does not work, then I quit.
  // Trying once again to update the sdk. Won't quit before I resolve this. Will need to be able to say in the defense it has been tested by other people, we published it on google play for extra points.
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
