# webhook-application server

## Description

This project provides a webhook management system with functionalities for users to sign up, log in, subscribe to webhooks by providing the source URL and a callback URL, list subscribed webhooks, view details of incoming webhook events, and display a real-time log of incoming webhook events as they are processed.

### Features
User Authentication
Sign up
Log in
Log out
Token refresh
Webhook Subscription Management
Subscribe to webhooks
List subscribed webhooks
View webhook details
Real-Time Event Logging
View real-time logs of incoming webhook events

## Installation

```bash
$ git clone https://github.com/khushboo683/webhook-application.git
$ cd webhook-application
$ npm install
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

## Technologies Used

Backend Framework: NodeJs and Express.Js

Programming Language: JavaScript

Database: MongoDB

Containerization: Docker

