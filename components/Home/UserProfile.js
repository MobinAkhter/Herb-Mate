import { useEffect, useState } from "react";
import { Text, FlatList, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import BigButton from "../ui/BigButton";
import { db } from "../../firebase";
import Button from "../ui/Button";

function UserProfile() {
  
  //display user information
  return(
    <View>
        <Text> User Profile</Text>
    </View>
  )
}

export default UserProfile;

const styles = StyleSheet.create({});
