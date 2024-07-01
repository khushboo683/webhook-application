import WebhookSubscription from '../models/webhookSubscription.js';
import User from '../models/user.js';
import {producer} from '../config/kafka.js';

export const subscribe = async (req, res) => {
  const { url, source, events } = req.body;

  try {
    const subscription = new WebhookSubscription({ url, source, events });
    await subscription.save();
    const {id} = req.user;
    const user = User.findById(id);
    if(!user){
        res.sendStatus(400).json({msg:'User not found.'});
    }
    if(user.subscriptions){
        user.subscriptions.push(subscription._id);
    }else {
        user.subscriptions=[subscription._id];
    }
    user.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listSubscriptions = async (req, res) => {
  try {
    const {id} = req.user;
    const user = User.findById(id);
    if(!user){
        res.sendStatus(400).json({msg:'User not found.'});
    }
    const subscriptions = [...user?.subscriptions];
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleEvent = async (req, res) => {
  const { source, event, data } = req.body;

  try {
    const message = JSON.stringify({ source, event, data });
    await producer.send({
      topic: 'webhook-events',
      messages: [{ value: message }],
    });
    res.status(200).json({ msg: 'Event handled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  const { subsId } = req.params;

  try {
    const {id} = req.user;
    const user = User.findById(id);
    if(!user){
        res.sendStatus(400).json({msg:'User not found.'});
    }
    if(user.subscriptions){
        const updatedSubscriptions=user.subscriptions.filter(sub=>toString(sub)!==subsId)
        user.subscriptions=updatedSubscriptions;
        await user.save();
    }else{
        res.sendStatus(400).json({msg:'User is not subscribed to any webhook'})
    }
    await WebhookSubscription.findByIdAndDelete(id);
    res.status(200).json({ msg: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
