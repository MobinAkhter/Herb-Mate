import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/styles";
import { TouchableOpacity } from "react-native";
import { Platform } from "react-native";
import WelcomeScreen from "../screens/WelcomeScreen";
import ConditionScreen from "../screens/ConditionScreen";
import RemedyListScreen from "../screens/RemedyListScreen";
import AboutRemedyScreen from "../screens/AboutRemedyScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import AppSettingsScreen from "../screens/AppSettingsScreen";
import SearchResultScreen from "../screens/SearchResultScreen";
import DataAnalyticsScreen from "../screens/DataAnalyticsScreen";
import RemediesBarGraphScreen from "../screens/RemediesBarGraphScreen";
import QuestionTier2Screen from "../screens/QuestionTier2Screen";
import QuestionTier3Screen from "../screens/QuestionTier3Screen";
import RecommendedRemedyScreen from "../screens/RecommendedRemedyScreen";
import ChatScreen from "../screens/ChatScreen";
import SortedRemedies from "../screens/SortedRemedies";
import DonationScreen from "../screens/DonationScreen";
import RecommendedRemediesScreen from "../screens/RecommendedRemediesScreen";
import PreparationScreen from "../screens/PreparationScreen";
import PreparationDetails from "../screens/PreparationDetails";
import NotesScreen from "../screens/NotesScreen";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Home() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
      }}
    >
      <Stack.Screen
        name="Home"
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
      <Stack.Screen name="Donation" component={DonationScreen} />
      <Stack.Screen name="RemediesBar" component={RemediesBarGraphScreen} />
      <Stack.Screen name="QuestionTier2" component={QuestionTier2Screen} />
      <Stack.Screen name="QuestionTier3" component={QuestionTier3Screen} />
      <Stack.Screen
        name="RecommendedRemedyScreen"
        component={RecommendedRemedyScreen}
      />
      <Stack.Screen
        name="RecommendedRemediesScreen"
        component={RecommendedRemediesScreen}
      />
      <Stack.Screen name="Preparation Screen" component={PreparationScreen} />
      <Stack.Screen name="Preparation Details" component={PreparationDetails} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
      }}
    >
      <Stack.Screen
        name="Profile"
        component={UserProfileScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu-outline" size={28} />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

export function BookmarkStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        //headerShown: false,
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
      }}
    >
      <Stack.Screen
        name="Bookmarks"
        component={AppSettingsScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu-outline" size={28} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Remedy Details"
        component={AboutRemedyScreen}
        options={{
          headerShown: true,
          headerTitle: "Remedy Details",
          headerStyle: { backgroundColor: "#35D96F" },
          headerTintColor: "white",
          // headerLeft: () => (
          //   <TouchableOpacity onPress={() => navigation.goBack()}>
          //     <Ionicons name="arrow-back" size={28} color="white" />
          //   </TouchableOpacity>
          // ),
        }}
      />
      <Stack.Screen name="Preparation Screen" component={PreparationScreen} />
      <Stack.Screen name="Preparation Details" component={PreparationDetails} />
    </Stack.Navigator>
  );
}

function RecommendationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
      }}
    >
      <Stack.Screen
        name="Data Analytics"
        component={DataAnalyticsScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu-outline" size={28} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="QuestionTier2" component={QuestionTier2Screen} />
      <Stack.Screen name="QuestionTier3" component={QuestionTier3Screen} />
      <Stack.Screen
        name="RecommendedRemedyScreen"
        component={RecommendedRemedyScreen}
      />
      <Stack.Screen
        name="RecommendedRemediesScreen"
        component={RecommendedRemediesScreen}
      />
      <Stack.Screen name="Remedy Details" component={AboutRemedyScreen} />
      <Stack.Screen name="Preparation Screen" component={PreparationScreen} />
      <Stack.Screen name="Preparation Details" component={PreparationDetails} />
    </Stack.Navigator>
  );
}

function AZHerbStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        //headerShown: false,
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
      }}
    >
      <Stack.Screen
        name="A-Z Herbs"
        component={SortedRemedies}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu-outline" size={28} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Remedy Details" component={AboutRemedyScreen} />
    </Stack.Navigator>
  );
}

export function PreparationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        //headerShown: false,
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
      }}
    >
      <Stack.Screen
        name="Herb Preparation"
        component={PreparationScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu-outline" size={28} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Preparation Details"
        component={PreparationDetails}
        // options={({ navigation }) => ({
        //   headerLeft: () => (
        //     <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        //       <Ionicons name="menu-outline" size={28} />
        //     </TouchableOpacity>
        //   ),
        // })}
      />
    </Stack.Navigator>
  );
}

function NotesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        //headerShown: false,
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
      }}
    >
      <Stack.Screen name="Notes" component={NotesScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
        tabBarHideOnKeyboard: Platform.OS === "android" ? true : false,
        tabBarActiveTintColor: "#35D96F",
        tabBarInactiveTintColor: "#A9A9A9",
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarStyle: {
          display: "flex",
        },
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
        name="A-Z Herbs"
        component={AZHerbStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Preparation"
        component={PreparationStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="eyedrop-outline" color={color} size={size} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Bookmarks"
        component={BookmarkStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmarks-outline" size={size} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Recommendation System"
        component={RecommendationStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="md-analytics" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notes"
        component={NotesStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="document-text-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AuthenticatedStack;
