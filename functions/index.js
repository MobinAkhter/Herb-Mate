const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {Expo} = require("expo-server-sdk");
const {SessionsClient} = require("@google-cloud/dialogflow");

admin.initializeApp();
const db = admin.firestore();
const expo = new Expo();

// store it in environment variables later, at least for security reasons
const projectId = "herballife-udcu";
const sessionId = "some-session-id";

const client = new SessionsClient({
  keyFilename: "./fir-auth-b5f8a-b5371b052504.json",
});

const notificationMessages = [
  "Aloe Vera soothes sunburns. Discover more remedies on HerbalLife!",
  "Chamomile: More than tea – a remedy for insomnia. Learn more!",
  "Checked Ginger's benefits? Great for digestion. Explore on HerbalLife!",
  "Lavender tip: Aids relaxation and sleep. Dive in now!",
  "Nature holds many answers. Explore our herbal guides on HerbalLife.",
  "Boost knowledge with our latest herbal entries. Visit HerbalLife!",
  "Updates in our remedies list! Discover what's new on HerbalLife.",
  "From Basil to Turmeric, unveil nature's secrets on HerbalLife.",
  "Tip: Turmeric is anti-inflammatory. Better with black pepper!",
];

exports.dialogflowGateway = functions.https.onRequest(async (req, res) => {
  console.log("Received request for dialogflowGateway with payload:", req.body);

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const {text} = req.body;

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
    return res.status(200).send({message: result});
  } catch (error) {
    console.error("Error calling Dialogflow:", error.message);
    return res.status(500).send(error);
  }
});

// This function pushes notifications, will need to see how it works.
exports.sendPushNotifications = functions.pubsub
    .schedule("15 17 * * *")
    .timeZone("America/Toronto")
    .onRun(async (context) => {
      const messages = [];
      const usersSnapshot = await db.collection("users").get();

      usersSnapshot.forEach((doc) => {
        const expoPushToken = doc.data().expoPushToken;

        const randomIndex = Math.floor(
            Math.random() * notificationMessages.length,
        );
        const randomMessage = notificationMessages[randomIndex];
        if (Expo.isExpoPushToken(expoPushToken)) {
          messages.push({
            to: expoPushToken,
            sound: "default",
            body: randomMessage,
            data: {withSome: "data"},
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
              ticketChunk,
          );
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(
              "Error sending a chunk of push notifications:",
              error.message,
          );
        }
      }
    });
