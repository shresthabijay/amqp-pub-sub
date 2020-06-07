const amqp = require("amqplib");
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
                console.log(`[AMQP] (${queue}) message recieved`);
                consumerHandler(channel, msg);
            },
            consumeProperties
        );
    } catch (err) {
        console.error("[AMQP] channel error", err.message);
    }
}

module.exports = {
    startMessagingConnection,
    startConsumer,
};

