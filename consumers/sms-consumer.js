const { sendSMS } = require("../notifiers/smsNotifier");

module.exports = async (channel, msg) => {
    // handle messages here
    try {
        const messageString = msg.content.toString();
        const { phoneNumber, body } = JSON.parse(messageString);
        await sendSMS({ phoneNumber, body });
        console.log("[SNS SMS] success :"); // sending acknowledgement to make sure that message is removed from query
        channel.ack(msg, true);
    } catch (err) {
        console.log("[SNS SMS] error\n", err);
    }
};
