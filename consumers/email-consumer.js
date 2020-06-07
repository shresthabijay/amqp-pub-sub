const { sendEmail } = require("../notifiers/emailNotifier");

module.exports = async (channel, msg) => {
    // handle messages here
    try {
        const messageString = msg.content.toString();
        const { to, subject, template, data } = JSON.parse(messageString);
        await sendEmail({ to, subject, template, data });
        console.log("[SES Email] success messageId:"); // sending acknowledgement to make sure that message is removed from query
        channel.ack(msg, true);
    } catch (err) {
        console.log("[SES Email] error\n", err);
    }
};
