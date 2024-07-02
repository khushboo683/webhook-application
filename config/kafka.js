import {Kafka} from 'kafkajs';
import { runConsumer } from '../controllers/event-message-handler.js';

const kafka =new Kafka({
    clientId: 'webhook-server',
    brokers: ['localhost:9092']
})
const producer = kafka.producer();
const consumer = kafka.consumer({groupId:'webhook-group'});

const initKafka = async () => {
    try {
        await producer.connect();
        await runConsumer();
        console.log('Kafka connected');
      } catch (error) {
        console.error('Error connecting to Kafka:', error);
      }
  };
  export { producer, consumer, initKafka };