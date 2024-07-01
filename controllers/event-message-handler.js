import { consumer } from '../config/kafka.js';
import WebhookSubscription from './models/WebhookSubscription';

const processEvent = async (message) => {
  const { source, event, data } = JSON.parse(message.value.toString());

  const subscriptions = await WebhookSubscription.find({ source, events: event });
  subscriptions.forEach(sub => {
    // Process the event (e.g., send to another service or save to DB)
  });
};

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'webhook-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      await processEvent(message);
    },
  });
};

runConsumer().catch(console.error);
