import { useEffect, useState } from "react";
import { Text, FlatList, StyleSheet, View , TextInput} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import BigButton from "../ui/BigButton";
import { db, auth } from "../../firebase";
import Button from "../ui/Button";

function UserProfile() {
    var user = auth.currentUser;
  //display user information
  return(
   
    <View>
        <Text> First Name : </Text>
        <Text> Last Name : </Text>
        <Text> Email : {user.email}</Text>
        <Text> Change Password </Text>
        <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Enter Current Password"
     
      />
       <TextInput
        style={styles.input}
        secureTextEntry={true}
        placeholder="Enter New Password"
      />

      <Button> Update</Button>
    </View>
  )
}

export default UserProfile;

const styles = StyleSheet.create({});
