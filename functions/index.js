const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {Expo} = require("expo-server-sdk");

admin.initializeApp();
const db = admin.firestore();
const expo = new Expo();

exports.sendPushNotifications = functions.pubsub
    .schedule("every 1 month")
    .onRun(async (context) => {
      const messages = [];
      const usersSnapshot = await db.collection("users").get();

      usersSnapshot.forEach((doc) => {
        const expoPushToken = doc.data().expoPushToken;
        if (Expo.isExpoPushToken(expoPushToken)) {
          messages.push({
            to: expoPushToken,
            sound: "default",
            body: "This is a test notification",
            data: {withSome: "data"},
          });
        }
      });

      const chunks = expo.chunkPushNotifications(messages);
      const tickets = [];
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    });
