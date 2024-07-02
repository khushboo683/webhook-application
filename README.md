# webhook-application

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
const webhookUrl = 'http://localhost:3000/api/webhooks/events'; // Change this to your actual endpoint

// Send the webhook event
sendWebhookEvent(webhookUrl, sampleEventData);
