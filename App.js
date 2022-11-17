import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import { Colors } from "./constants/styles";

// Add references here

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.darkGreen },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.darkGreen },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />

      {/* <Stack.Screen
        name="AuthenticatedStack"
        component={AuthenticatedStack}
        options={{ title: "", headerTransparent: true }} */}
      {/* //
      https://stackoverflow.com/questions/61185135/react-native-navigation-error-the-action-navigate-with-payload-name-192-168
      ^ Tried to make navigation work. Tired atm, will think about this later /> */}
    </Stack.Navigator>
  );
}
// Switched to another branch
function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.greenColor },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.greenColor },
      }}
    >
      {/* <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
    </Stack.Navigator>
  );
}

function Navigation() {
  return (
    <NavigationContainer>
      <AuthStack />
      {/* Since this only contains AuthStack, that is why the user can not go to Authenticated Stack, will need to have it condition based. If user is logged in go to authenticated stack, otherwise show them the authstack */}
      {/* <AuthenticatedStack /> */}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Navigation />
    </>
  );
}
