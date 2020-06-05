const amqp = require("amqplib");

const INSTANCE_URL = process.env.RABBITMQ_INSTANCE_URL;

console.log(process.env.RABBITMQ_INSTANCE_URL)

let amqpConn = null;
let pubChannel = null;

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

function whenConnected() {
    startPublisher();
}

async function startPublisher() {
    try {
        const channel = await amqpConn.createConfirmChannel();

        channel.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });

        channel.on("close", function () {
            console.log("[AMQP] channel closed");
        });

        pubChannel = channel;

        console.log("channel created");
    } catch (err) {
        console.error("[AMQP] channel error", err.message);
    }
}

async function publish(exchange, routingKey, content, options) {
    try {
        await pubChannel.publish(
            exchange,
            routingKey,
            new Buffer(content),
            options
        );
        console.log(
            `
        [AMQP] publish success
        Exchange: ${exchange}
        RoutingKey: ${routingKey}
        Content: ${content}
        `
        );
    } catch (e) {
        console.error(
            `
        [AMQP] publish failed
        Exchange: ${exchange}
        RoutingKey: ${routingKey}
        `,
            e.message
        );
        throw e;
    }
}

async function sendToQueue(queue, content, options) {
    try {
        await pubChannel.sendToQueue(queue, new Buffer(content), options);
        console.log(`[AMQP] (${queue}) sendToQueue success`, content);
    } catch (e) {
        console.error(`[AMQP] (${queue}) sendToQueue failed`, e.message);
        throw e;
    }
}

module.exports = {
    startMessagingConnection,
    publish,
    sendToQueue,
};
