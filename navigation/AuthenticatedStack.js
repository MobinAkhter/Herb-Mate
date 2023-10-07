import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/styles";

import WelcomeScreen from "../screens/WelcomeScreen";
import ConditionScreen from "../screens/ConditionScreen";
import RemedyListScreen from "../screens/RemedyListScreen";
import AboutRemedyScreen from "../screens/AboutRemedyScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import AppSettingsScreen from "../screens/AppSettingsScreen";
import SearchResultScreen from "../screens/SearchResultScreen";
import DataAnalyticsScreen from "../screens/DataAnalyticsScreen";
import ChatScreen from "../screens/ChatScreen";
import SortedRemedies from "../screens/SortedRemedies";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { TouchableOpacity } from "react-native";

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
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu-outline" size={28} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Profile" component={UserProfileScreen} />
      <Stack.Screen name="Condition" component={ConditionScreen} />
      <Stack.Screen name="Remedies" component={RemedyListScreen} />
      <Stack.Screen name="Remedy Details" component={AboutRemedyScreen} />
      <Stack.Screen name="SearchResult" component={SearchResultScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => navigation.goBack()} // This will navigate to the previous screen
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
      })}
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
      {/* changed App Settings to Settings, revert if something breaks */}
      <Tab.Screen
        name="Bookmarks"
        component={AppSettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-settings" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Data Analytics"
        component={DataAnalyticsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-analytics" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="A-Z Herbs"
        component={SortedRemedies}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-book-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AuthenticatedStack;
