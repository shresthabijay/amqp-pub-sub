require('dotenv').config();

const { startMessagingConnection, startConsumer } = require("./rabbitMQ");
const firebaseConsumer = require("./consumers/firebase-consumer");
const emailConsumer = require("./consumers/email-consumer");
const smsConsumer = require("./consumers/sms-consumer");

const initApplication = async () => {
    await startMessagingConnection();

    startConsumer("firebase-notification", firebaseConsumer, {
        assertQueueProperties: {
            durable: true,
        },
        consumeProperties: {},
    });

    startConsumer("email-notification", emailConsumer, {
        assertQueueProperties: {
            durable: true,
        },
        consumeProperties: {},
    });

    startConsumer("sms-notification", smsConsumer, {
        assertQueueProperties: {
            durable: true,
        },
        consumeProperties: {},
    });
};

initApplication();
