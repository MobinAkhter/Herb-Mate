import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import { Colors } from "../constants/styles";
import ComplianceScreen from "../screens/ComplianceScreen";
import ForgotPassword from "../screens/ForgotPassword";

// Add references here

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerLeft: null,
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
      }}
    >
      {/* <Stack.Screen
        options={{ headerBackVisible: false, presentation: "modal" }}
        name="Compliance"
        component={ComplianceScreen}
      /> */}
      <Stack.Screen
        options={{ headerBackVisible: false }}
        name="Signup"
        component={SignupScreen}
      />
      <Stack.Screen
        options={{ headerBackVisible: false }}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{ headerBackVisible: false }}
        name="ForgotPassword"
        component={ForgotPassword}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
