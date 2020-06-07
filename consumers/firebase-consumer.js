const { sendNotificationToTopic } = require("../notifiers/firebaseNotifier");

module.exports = async (channel, msg) => {
    // handle messages here
    try {
        const messageString = msg.content.toString();
        const { title, body, image, topic } = JSON.parse(messageString);
        await sendNotificationToTopic(title, body, image, topic);
        channel.ack(msg, true); // sending acknowledgement to make sure that message is removed from queue
    } catch (err) {
        // console.log('[Firebase] error', err);
        channel.ack(msg, true);
    }
};
