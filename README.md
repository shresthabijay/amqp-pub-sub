# Notification Microservice (Based on RabbitMQ pub-sub model)

This a mircoservice that handles notifications (push notifcations, email and sms). It uses RabbitMQ publisher subscriber model in node. In this example project, publisher is exposed with express server and consumer node reacts to the messages and executes notification services.

# To run publisher server

Server exposes endpoint for three distinct notification services.

`
nodemon index.js
`

# To run subsciber/consumer Notification Microservice

Notification service starts consumers and handles notification on messages from respectives queues.

`
nodemon notificationService.js
`

# Why pubsub model ?

It helps to make asynchronous event based system. Publisher doesn't need to know who consumes the message and Subscriber doesn't need to know who published the message. It helps to separate certain service to a separate server. In this case notification service. The best part is we can scale these service up and down accordingly. If traffic for notification is high then we can launch another instance of same notification service and Rabbit MQ will round robin messages to server subscribed to same queue. When you have to take notification services down for a while, messaging queue will keep the messages queued and then later push those messages to subscribers. So no events missed. Yay!
