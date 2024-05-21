import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "../constants/styles";
import { Animated, Dimensions, Text, TouchableOpacity } from "react-native";
import { Platform } from "react-native";
import WelcomeScreen from "../screens/MainFlow/WelcomeScreen";
import ConditionScreen from "../screens/MainFlow/ConditionScreen";
import RemedyListScreen from "../screens/MainFlow/RemedyListScreen";
import AboutRemedyScreen from "../screens/MainFlow/AboutRemedyScreen";
import UserProfileScreen from "../screens/SecondaryScreens/UserProfileScreen";
import BookmarkScreen from "../screens/SecondaryScreens/BookmarkScreen";
import SearchResultScreen from "../screens/SearchResultScreen";
import SortedRemedies from "../screens/BottomTabs/AtoZ/SortedRemedies";
import DonationScreen from "../screens/SecondaryScreens/DonationScreen";
import PreparationScreen from "../screens/BottomTabs/Preparation/PreparationScreen";
import PreparationDetails from "../screens/BottomTabs/Preparation/PreparationDetails";
import NotesScreen from "../screens/BottomTabs/Notes/NotesScreen";
import Icon from "react-native-vector-icons/Ionicons";
import styled from "styled-components/native";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const screen_width = Dimensions.get("window").width;
const iconSize = screen_width * 0.06; // dynamic icon sizing

const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

const ActiveIndicator = styled(Animated.View)`
  position: absolute;
  height: 10px; // Increased height
  width: 10px; // Increased width
  border-radius: 5px; // Ensuring it's a perfect circle
  background-color: #35d96f;
  bottom: 3px; // Adjust position above the icon
`;

const StyledTabBarIcon = ({ name, focused, tintColor }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: focused ? 1.2 : 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleValue]);

  return (
    <AnimatedIcon
      name={name}
      size={iconSize}
      color={tintColor}
      style={{ transform: [{ scale: scaleValue }] }}
    />
  );
};

const TabBarIconWrapper = styled.View`
  align-items: center;
  justify-content: center;
  top: 10px;
`;

function HomeStack() {
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
      <Stack.Screen name="ProfileScreen" component={UserProfileScreen} />
      <Stack.Screen name="Condition List" component={ConditionScreen} />
      <Stack.Screen name="Remedies List" component={RemedyListScreen} />
      <Stack.Screen name="Remedy Details" component={AboutRemedyScreen} />
      <Stack.Screen name="Search Result" component={SearchResultScreen} />
      <Stack.Screen name="DonationScreen" component={DonationScreen} />
      <Stack.Screen name="Herb Preparation" component={PreparationScreen} />
      <Stack.Screen
        name="Herb Preparation Details"
        component={PreparationDetails}
      />
    </Stack.Navigator>
  );
}
// At this point the bugs are the initial load one, and search result
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
        name="UserProfileScreen" // Ensured unique name
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
        headerStyle: { backgroundColor: "#35D96F" },
        headerTintColor: "white",
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: Colors.white },
      }}
    >
      <Stack.Screen
        name="Your Bookmarks" // Ensured unique name
        component={BookmarkScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu-outline" size={28} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Remedy Details" // Ensured unique name
        component={AboutRemedyScreen}
        options={{
          headerShown: true,
          headerTitle: "Remedy Details",
          headerStyle: { backgroundColor: "#35D96F" },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="BookmarkPreparationScreen"
        component={PreparationScreen}
      />
      <Stack.Screen
        name="BookmarkPreparationDetailsScreen"
        component={PreparationDetails}
      />
    </Stack.Navigator>
  );
}

function AZHerbStack() {
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
        name="A-Z Herbs" // Ensured unique name
        component={SortedRemedies}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu-outline" size={28} />
            </TouchableOpacity>
          ),
        })}
      />
      {/* <Stack.Screen name="Remedy Details" component={AboutRemedyScreen} /> */}
    </Stack.Navigator>
  );
}

export function PreparationStack() {
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
        name="Herbs Preparation"
        component={PreparationScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu-outline" size={28} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Preparation Details" component={PreparationDetails} />
    </Stack.Navigator>
  );
}

function NotesStack() {
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
        name="Your Notes"
        component={NotesScreen}
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

function AuthenticatedStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#35D96F",
        tabBarInactiveTintColor: "#A9A9A9",
        tabBarLabel: ({ focused, color }) => (
          <Text style={{ color, fontSize: 12, marginBottom: 3 }}>
            {route.name}
          </Text>
        ),

        // Display the label only when the tab is active
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 3,
        },

        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "transparent",
          elevation: 20,
          shadowOffset: { width: 0, height: 0 },
          shadowColor: "black",
          shadowOpacity: 0.15,
          shadowRadius: 20,
          height: 60,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "md-home";
          } else if (route.name === "A-Z Herbs") {
            iconName = "md-book-outline";
          } else if (route.name === "Preparation") {
            iconName = "eyedrop-outline";
          } else if (route.name === "Notes") {
            iconName = "document-text-outline";
          }

          return (
            <TabBarIconWrapper>
              {focused && (
                <ActiveIndicator
                  style={{
                    transform: [{ scale: scaleValue }],
                  }}
                />
              )}
              <StyledTabBarIcon
                name={iconName}
                focused={focused}
                tintColor={color}
              />
            </TabBarIconWrapper>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
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
          tabBarIcon: ({ color, size }) => (
            <Icon name="eyedrop-outline" color={color} size={size} />
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
