const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Expo } = require("expo-server-sdk");
const { SessionsClient } = require("@google-cloud/dialogflow");

admin.initializeApp();
const db = admin.firestore();
const expo = new Expo();

// store it in environment variables later, at least for security reasons
const projectId = "herballife-udcu";
const sessionId = "some-session-id";

const client = new SessionsClient({
  keyFilename: "./fir-auth-b5f8a-b5371b052504.json",
});

exports.dialogflowGateway = functions.https.onRequest(async (req, res) => {
  console.log("Received request for dialogflowGateway with payload:", req.body);

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { text } = req.body;

  const sessionPath = client.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: "en-US",
      },
    },
  };

  try {
    const responses = await client.detectIntent(request);
    const result = responses[0].queryResult.fulfillmentText;
    console.log("Received response from Dialogflow:", result);
    return res.status(200).send({ message: result });
  } catch (error) {
    console.error("Error calling Dialogflow:", error.message);
    return res.status(500).send(error);
  }
});

// This function pushes notifications, will need to see how it works. Every 5 mins it worked, this pushes the notifications every month on first day, lets see in October.
exports.sendPushNotifications = functions.pubsub
  .schedule("0 0 1 * *")
  .timeZone("America/Toronto")
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
          data: { withSome: "data" },
        });
      }
    });

    console.log("Preparing to send push notifications...");

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(
          "Successfully sent a chunk of push notifications:",
          ticketChunk
        );
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(
          "Error sending a chunk of push notifications:",
          error.message
        );
      }
    }
  });
