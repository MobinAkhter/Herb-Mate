import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { db, auth } from "../firebase";

export const UserContext = React.createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    if (user) {
      saveTokenToDatabase(user);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          setUser(firebaseUser);
        } else {
          // alert("Please verify your email");
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.warn(
        "Failed to get push token for push notification. Also before production, get rid of the alert message"
      );
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  }

  async function saveTokenToDatabase(user) {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    const usersRef = db.collection("users");
    await usersRef.doc(user.uid).update({
      expoPushToken: token,
    });

    console.log("Token saved to database");
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
