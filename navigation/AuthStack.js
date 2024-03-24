import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../constants/styles";
import Icon from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import SignupScreen from "../screens/Auth/SignupScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import ForgotPassword from "../screens/Auth/ForgotPassword";
import SplashScreen from "../screens/Auth/SplashScreen";
const Stack = createNativeStackNavigator();

function AuthStack() {
  const navigation = useNavigation();
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
      {/* This was previously Onboarding */}
      <Stack.Screen
        name="Welcome"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
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
        name="Reset Password"
        component={ForgotPassword}
        options={() => ({
          headerBackVisible: false,
          headerLeft: () => (
            <Icon
              name="arrow-left"
              size={24}
              color="white"
              onPress={() => navigation.navigate("Login")}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
