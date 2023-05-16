import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserProfileScreen from "../screens/UserProfileScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, Image, Settings } from "react-native";
import WelcomeScreen from "../screens/WelcomeScreen";
import ConditionScreen from "../screens/ConditionScreen";
import RemedyListScreen from "../screens/RemedyListScreen";
import AboutRemedyScreen from "../screens/AboutRemedyScreen";
import AppSettingsScreen from "../screens/AppSettingsScreen";
import SearchResultScreen from "../screens/SearchResultScreen";
import DataAnalyticsScreen from "../screens/DataAnalyticsScreen";
import RemediesBarGraphScreen from "../screens/RemediesBarGraphScreen";
import { Colors } from "../constants/styles";
// import { HomeIcon, HomeModernIcon } from "react-native-heroicons/outline";
// import { Profiler } from "react";
// import iconSet from "@expo/vector-icons/build/Fontisto";
import { Ionicons } from "@expo/vector-icons";

// Add references here

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Home() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.white },
      }}
    >
      <Tab.Screen
        name="Welcome"
        component={WelcomeScreen}
        screenOptions={{ headerLeft: null }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        screenOptions={{
          headerLeft: null,
          contentStyle: { backgroundColor: Colors.white },
        }}
      />
      <Tab.Screen name="Condition" component={ConditionScreen} />
      <Tab.Screen name="RemedyList" component={RemedyListScreen} />
      <Tab.Screen name="AboutRemedy" component={AboutRemedyScreen} />
      <Tab.Screen name="SearchResult" component={SearchResultScreen} />
      {/* <Tab.Screen
        name="AuthenticatedStack"
        component={AuthenticatedStack}
        options={{ title: "", headerTransparent: true }} */}
      {/* //
      https://stackoverflow.com/questions/61185135/react-native-navigation-error-the-action-navigate-with-payload-name-192-168
      ^ Tried to make navigation work. Tired atm, will think about this later /> */}
    </Stack.Navigator>
  );
}

function AuthenticatedStack({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
      }}
    >
      {/* These are the screens that get displayed on the bottom tab */}
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: () => {
            // setting the icon of the tab
            return <Ionicons name="md-home" size={28} color="#00ff0d" />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => {
            // setting the icon of the tab
            return <Ionicons name="md-person" size={28} color="#008cff" />;
          },
        }}
      />
      <Tab.Screen
        name="App Settings"
        component={AppSettingsScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => {
            // setting the icon of the tab
            return <Ionicons name="md-settings" size={28} color="#ff001f" />;
          },
        }}
      />
      <Tab.Screen
        name="Data Analytics"
        component={DataAnalyticsScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => {
            // setting the icon of the tab
            return <Ionicons name="md-settings" size={28} color="#ff001f" />;
          },
        }}
      />

      <Tab.Screen
        name="Bar Graph"
        component={RemediesBarGraphScreen}
        options={{
          headerShown: false,
          tabBarIcon: () => {
            // setting the icon of the tab
            return <Ionicons name="md-settings" size={28} color="#ff001f" />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default AuthenticatedStack;
