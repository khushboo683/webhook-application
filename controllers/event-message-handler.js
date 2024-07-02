import { consumer } from '../config/kafka.js';
import WebhookSubscription from '../models/webhookSubscription.js';
import Event from '../models/event.js';
import { io } from '../app.js';

const processEvent = async (message) => {
  const { source, event, data } = JSON.parse(message.value.toString());

  const subscriptions = await WebhookSubscription.find({ sourceUrl:source});
  subscriptions.forEach(sub => {
    const newEvent = new Event({
        webhookId: sub._id,
        payload:data,
        name: event
    })
    newEvent.save();
    io.emit('newEvent',newEvent);
  });
};

export const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'webhook-events', fromBeginning: true });
  console.log(`subscribed to topic: webhook-events`)
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      await processEvent(message);
    },
  });
};

