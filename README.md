# webhook-application server

## Description

This project provides a webhook management system with functionalities for users to sign up, log in, subscribe to webhooks by providing the source URL and a callback URL, list subscribed webhooks, view details of incoming webhook events, and display a real-time log of incoming webhook events as they are processed.

### Features
- User Authentication
- Sign up
- Log in
- Log out
- Token refresh
- Webhook Subscription Management
- Subscribe to webhooks
- List subscribed webhooks
- View webhook details
- Real-Time Event Logging
- View real-time logs of incoming webhook events

## Installation

```bash
$ git clone https://github.com/khushboo683/webhook-application.git
$ cd webhook-application
$ npm install
```
## Set up environment variable (.env file) for Mongodb Atlas url and JWT secret key as:

```bash
DATABASE_URL=xxxxx 
JWT_SECRET_KEY=your generated key
```
### If not set up MongoDb Atlas url, MongoDb will run locally as docker container on mongodb://root:example@localhost:27017, but need to generate jwt secret key for authentication.
### You may create a random key by using node.

```bash
Type node in your terminal, press the return key,
Type crypto.randomBytes(20).toString(‘hex’)
```

## Running the app

```bash
# run docker compose file
$ docker compose up -d

# development
$ npm start

```
## Webhook simulation
- create a js file with name: /simulation.js. Copy the code in this file:
 ```bash
const axios = require('axios');

// Function to send a POST request to the webhook endpoint
const sendWebhookEvent = async (webhookUrl, eventData) => {
  try {
    const response = await axios.post(webhookUrl, eventData);
    console.log(`Status: ${response.status}`);
    console.log(`Response data: ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.error(`Error sending webhook event: ${error.message}`);
  }
};

// Sample data to send in the webhook event
const sampleEventData = {
  source: 'http:/api/source3',
  event: 'SAMPLE_EVENT3',
  data: {
    id: '12347',
    name: 'Sample Event 3',
    description: 'This is a sample webhook event 3',
  },
};
const sampleEventData1 = {
    source: 'http:/api/source2',
    event: 'SAMPLE_EVENT2',
    data: {
      id: '12346',
      name: 'Sample Event 2',
      description: 'This is a sample webhook event 2',
    },
  };

// URL of your webhook handling endpoint
const webhookUrl = 'http://localhost:3000/api/webhooks/events'; 

// Send the webhook event
sendWebhookEvent(webhookUrl, sampleEventData);
```
initialize npm:
```bash
$ npm init -y
$ npm install axios
$ node simulation.js
```
## Architecture
The application follows a client-server architecture with the following components:

Frontend: Built with React.js and Material-UI, the frontend handles user interactions and displays data fetched from the backend.
Backend: Built with Node.js and Express.js, the backend handles API requests, authentication, and database interactions.
Database: MongoDB is used to store user data, webhook subscriptions, and incoming webhook events.
Real-Time Communication: Socket.io is used to push real-time updates of incoming webhook events to the frontend.
Event Streaming: Kafka is used for publishing incoming events from the source and then consuming them to store the events in the database and emit them to the frontend.

## Design Choices
Authentication and Authorization: JWT tokens are used for secure authentication and authorization. JWT is stateless and scales well with distributed systems.
Database: MongoDB is chosen for its flexibility and scalability. It supports a large number of concurrent users and is suitable for storing JSON-like documents.
Real-Time Log: Socket.io is used to implement real-time updates, ensuring that users can see incoming webhook events as they are processed.
Event Streaming: Kafka is used to handle the high volume of incoming events, ensuring they are processed efficiently and stored reliably.
Separation of Concerns: The application logic is separated into different routes and controllers, following the MVC pattern.

## Technologies Used

Backend Framework: NodeJs and Express.Js

Programming Language: JavaScript

Database: MongoDB

Event-Streaming: Kafka

Containerization: Docker

