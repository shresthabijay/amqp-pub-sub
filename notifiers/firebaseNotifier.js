const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-notification-71ca7.firebaseio.com"
});

const messaging = admin.messaging();

const sendNotificationToTopic = async (title, body, image, topic) => {
  try {
    const result = await messaging.send({
      topic,
      notification: { title, body, image }
    });
    console.log(`[Firebase] success`);
  } catch (error) {
    console.log(`[Firebase] error:`, error.message);
  }
};

exports.sendNotificationToTopic = sendNotificationToTopic