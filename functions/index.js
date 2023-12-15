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

// Check if all these herbs exist in our app. Used gpt to give me all
// these messages text. Phew, saved a lot of time coming up with them.
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
  "Aconite: A powerful herb for pain relief. Explore more on HerbalLife!",
  "Discover the calming properties of Agrimony on HerbalLife!",
  "Unlock the secrets of Aloe for skin health. Dive in now!",
  "Angelica: Nature's remedy for digestion. Learn more on HerbalLife!",
  "Boost heart health with Arjun. Explore on HerbalLife!",
  "Arnica: Your natural solution for bruises and pain. Discover more!",
  "Ashwagandha: Stress relief from nature. Visit HerbalLife!",
  "Astragalus: Enhance your immune system naturally. Learn how!",
  "Barberry: A herbal remedy for digestive health. Explore on HerbalLife!",
  "Basil: Not just for cooking – discover its health benefits!",
  "Bay laurel: Aromatic herb with wellness benefits. Dive in now!",
  "Bilberry: Good for eyes and more. Explore on HerbalLife!",
  "Black Cohosh: Natural relief for menopause. Learn more!",
  "Boswellia: Tackle inflammation the natural way. Visit HerbalLife!",
  "Buchu: Herbal remedy for urinary health. Discover more!",
  "Bupleurum: Balance your body with this ancient herb.",
  "Burdock: Detoxify and revitalize with this herbal remedy.",
  "Butcher’s Broom: Improve circulation naturally. Learn how!",
  "Butterbur: Say goodbye to migraines. Explore on HerbalLife!",
  "Calendula: Gentle herb for skin and wellness. Dive in now!",
  "California Poppy: Natural aid for relaxation. Visit HerbalLife!",
  "Cayenne: Spice up your health with this herb. Learn more!",
  "Chickweed: Discover the healing power of this herb.",
  "Chrysanthemum: A soothing herb for stress relief.",
  "Comfrey: Nature's remedy for joint and muscle health.",
  "Cornflower: Herbal beauty secrets. Explore on HerbalLife!",
  "Cramp Bark: Alleviate menstrual cramps naturally.",
  "Cranberry: Support urinary tract health. Dive in now!",
  "Dandelion: Detoxify your body with this herbal hero.",
  "Deadly Nightshade: Beware, but learn about its history.",
  "Dong Quai: Balance hormones naturally. Visit HerbalLife!",
  "Echinacea: Boost your immune system with this herb.",
  "Elder: Traditional remedy for colds and flu. Learn more!",
  "Elecampane: Respiratory wellness from nature. Explore now!",
  "Eucalyptus: Breathe easier with this herbal remedy.",
  "Evening Primrose: Enhance skin and hormonal health.",
  "Eyebright: Herbal support for eye health. Dive in now!",
  "Feverfew: Your migraine solution from nature. Visit HerbalLife!",
  "Flaxseed: Superfood for heart and digestion. Learn more!",
  "Fo Ti: Ancient remedy for longevity and vitality.",
  "Frankincense: Explore the history and benefits of this resin.",
  "Garlic: The herbal powerhouse for immune support.",
  "Gentian: Herbal remedy for digestion and appetite.",
  "German Chamomile: Calm your nerves the natural way.",
  "Ginger: Spice up your health with this herbal favorite.",
  "Ginkgo: Enhance memory and circulation. Dive in now!",
  "Ginseng: Vitality and energy from nature. Visit HerbalLife!",
  "Goji Berry: Discover the antioxidant benefits of this superfood.",
  "Goldenseal: Herbal remedy for immune and digestive health.",
  "Gotu Kola: Brain health and more with this herb.",
];

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

// This function pushes notifications, will need to see how it works.
// TODO: This function only works if the app is running in background. Apparently not.
// It works when it feels like it. Created a function more innovative than AI. Damnnn 🔥
// Will need to ensure it notifies the user even if the app is not running!
exports.sendPushNotifications = functions.pubsub
  .schedule("52 04 * * *")
  .timeZone("America/Toronto")
  .onRun(async (context) => {
    const messages = [];
    const usersSnapshot = await db.collection("users").get();

    usersSnapshot.forEach((doc) => {
      const expoPushToken = doc.data().expoPushToken;

      const randomIndex = Math.floor(
        Math.random() * notificationMessages.length
      );
      const randomMessage = notificationMessages[randomIndex];
      if (Expo.isExpoPushToken(expoPushToken)) {
        messages.push({
          to: expoPushToken,
          sound: "default",
          body: randomMessage,
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
