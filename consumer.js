const amqp = require("amqplib");
require("dotenv").config();

const INSTANCE_URL = process.env.RABBITMQ_INSTANCE_URL;

let amqpConn = null;

async function startMessagingConnection() {
    try {
        amqpConn = await amqp.connect(INSTANCE_URL);

        amqpConn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });

        amqpConn.on("close", function () {
            console.error("[AMQP] reconnecting");
            return setTimeout(startMessagingConnection, 1000);
        });
        console.log("[AMQP] connected");

        whenConnected();
    } catch (err) {
        console.error("[AMQP]", err.message);
        return setTimeout(startMessagingConnection, 1000);
    }
}

async function startConsumer(
    queue,
    consumerHandler,
    { assertQueueProperties, consumeProperties = {} }
) {
    try {
        const channel = await amqpConn.createChannel();
        console.log(`${queue} channel created`);

        channel.assertQueue(queue, assertQueueProperties);

        channel.consume(
            queue,
            (msg) => {
                console.log(
                    `[AMQP] (${queue}) message recieved:\n${msg.content.toString()}`
                );
                consumerHandler(channel, msg);
            },
            consumeProperties
        );
    } catch (err) {
        console.error("[AMQP] channel error", err.message);
    }
}

function whenConnected() {
    startConsumer(
        "email-notification",
        (channel, msg) => {
            // handle messages here
            channel.ack(msg, true); // sending acknowledgement to make sure that message is removed from queue
        },
        {
            assertQueueProperties: {
                durable: true,
            },
            consumeProperties: {},
        }
    );

    startConsumer(
        "sms-notification",
        (channel, msg) => {
            // handle messages here
            channel.ack(msg, true); // sending acknowledgement to make sure that message is removed from queu
        },
        {
            assertQueueProperties: {
                durable: true,
            },
            consumeProperties: {},
        }
    );
}

module.exports = {
    startMessagingConnection,
};

startMessagingConnection();
