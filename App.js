import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { UserContext } from "./contexts/userContext";
import UserProvider from "./contexts/userContext";
import AuthenticatedStack from "./navigation/AuthenticatedStack";
import AuthStack from "./navigation/AuthStack";
import { auth } from "./firebase";
import { LogBox } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import UserProfileScreen from "./screens/UserProfileScreen";

const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={AuthenticatedStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      {/* For now, I think Home and Profile should be inside of drawer navigation, other screens can be added later */}
    </Drawer.Navigator>
  );
}
function Navigation() {
  LogBox.ignoreAllLogs();

  const { user, setUser } = React.useContext(UserContext);

  return (
    <NavigationContainer>
      {user ? <DrawerNavigator /> : <AuthStack />}
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
