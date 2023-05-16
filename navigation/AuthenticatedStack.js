import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import WelcomeScreen from "../screens/WelcomeScreen";
import ConditionScreen from "../screens/ConditionScreen";
import RemedyListScreen from "../screens/RemedyListScreen";
import AboutRemedyScreen from "../screens/AboutRemedyScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import AppSettingsScreen from "../screens/AppSettingsScreen";
import SearchResultScreen from "../screens/SearchResultScreen";
import DataAnalyticsScreen from "../screens/DataAnalyticsScreen";
import RemediesBarGraphScreen from "../screens/RemediesBarGraphScreen";
import { Colors } from "../constants/styles";

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
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerLeft: null }}
      />
      <Stack.Screen name="Profile" component={UserProfileScreen} />
      <Stack.Screen name="Condition" component={ConditionScreen} />
      <Stack.Screen name="RemedyList" component={RemedyListScreen} />
      <Stack.Screen name="AboutRemedy" component={AboutRemedyScreen} />
      <Stack.Screen name="SearchResult" component={SearchResultScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="App Settings"
        component={AppSettingsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-settings" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DataAnalytics"
        component={DataAnalyticsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-analytics" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BarGraph"
        component={RemediesBarGraphScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-bar-chart" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// function AuthenticatedStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="MainTabs"
//         component={MainTabs}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// }
// Might need to do what has been commented later, i think. The app seems to work perfectly fine so I'll keep as is.

export default AuthenticatedStack;
