const express = require('express');
require('dotenv').config()

const { startMessagingConnection, publish, sendToQueue } = require('./publisher')

// starting rabbitMQ connection
startMessagingConnection();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.post('/',async (req, res) => {
    const { message } = req.body;

    // publishing message using exchange
    // this example sends message to both email-notification and sms-notification-queue
    const ROUTING_KEY = '';
    const EXCHANGE = 'notify.exchange';
    const OPTIONS = {
        persistence: true,
        headers: {
            all: true
        }
    }

    try{
        await publish(EXCHANGE, ROUTING_KEY, message, OPTIONS);
        res.status(200).send('Hello Hooman Dev!');
    }
    catch(err){
        res.status(400).send('Failed :(');
    }
});

app.post('/sms',async (req, res) => {
    const { message } = req.body;

    // this example send direct message to sms-notification queue
    const OPTIONS = {
        persistence: true,
    }

    const QUEUE = 'sms-notification'

    try{
        await sendToQueue(QUEUE, message, OPTIONS)
        res.status(200).send('Hello Hooman Dev!');
    }
    catch(err){
        res.status(400).send('Failed :(');
    }
});

app.listen(7770, () => {
    console.log('server started at 7770');
});

