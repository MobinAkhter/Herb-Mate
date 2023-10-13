import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { UserContext } from "./contexts/userContext";
import UserProvider from "./contexts/userContext";
import AuthenticatedStack from "./navigation/AuthenticatedStack";
import AuthStack from "./navigation/AuthStack";
import { auth } from "./firebase";
import { LogBox } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import UserProfileScreen from "./screens/UserProfileScreen";
import DonationScreen from "./screens/DonationScreen";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import OnboardingScreen from "./screens/OnboardingScreen";

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
      <Drawer.Screen
        name="Donate"
        component={DonationScreen}
        options={{
          headerTitle: "Donate",
          headerStyle: { backgroundColor: "#35D96F" },
          headerTintColor: "white",
        }}
      />
    </Drawer.Navigator>
  );
}
function Navigation() {
  LogBox.ignoreAllLogs();

  const { user, setUser } = React.useContext(UserContext);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value == null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null;
  }

  if (isFirstLaunch === true) {
    return <OnboardingScreen />;
  }

  return (
    <NavigationContainer>
      {user ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <StatusBar style="light" />
        <Navigation />
      </ThemeProvider>
    </UserProvider>
  );
}
