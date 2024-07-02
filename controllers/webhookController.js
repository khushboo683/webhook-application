import WebhookSubscription from '../models/webhookSubscription.js';
import User from '../models/user.js';
import Event from '../models/event.js';
import {producer} from '../config/kafka.js';

export const subscribe = async (req, res) => {
  const { sourceUrl, callbackUrl} = req.body;

  try {
    const user = await User.findById(req.user);
    if(!user){
        res.status(400).json({msg:'User not found.'});
        return;
    }
    const subscription = new WebhookSubscription({ sourceUrl, callbackUrl, userId:req.user});
    await subscription.save();
   
    if(user?.subscriptions?.length>0){
        user.subscriptions.push(subscription._id);
    }else {
        user.subscriptions=[subscription._id];
    }
    await user.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listSubscriptions = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate('subscriptions');
    if(!user){
        res.status(400).json({msg:'User not found.'});
        return;
    }
    const subscriptions = user?.subscriptions || [];
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleEvent = async (req, res) => {
    console.log("event request",req.body)
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
    const user = await User.findById(req.user);
    if(!user){
        res.status(400).json({msg:'User not found.'});
        return;
    }
    if(user?.subscriptions?.length>0){
        const updatedSubscriptions=user.subscriptions.filter(sub=>toString(sub)!==subsId)
        user.subscriptions=updatedSubscriptions;
        await user.save();
    }else{
        res.status(400).json({msg:'User is not subscribed to any webhook'})
    }
    await WebhookSubscription.findByIdAndDelete(subsId);
    res.status(200).json({ msg: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEvents = async (req, res) => {
    try {
        console.log(req.user)
      const user = await User.findById(req.user);
      if (!user) {
        res.status(400).json({ msg: 'User not found.' });
        return;
      }
  
      if (user.subscriptions?.length > 0) {
        // Collect all promises for Event.find calls
        const eventPromises = user.subscriptions.map((subs) => {
            console.log('subs',subs)
          return Event.find({ webhookId: subs.toString() });
        });
  
        // Execute all promises in parallel using Promise.allSettled
        const results = await Promise.allSettled(eventPromises);
  
        // Collect the fulfilled results
        const events = results
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value)
          .flat(); // Flatten the array since Event.find returns an array of events
  
        res.status(200).json(events);
      } else {
        res.status(200).json([]); // Return an empty array if no subscriptions
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };
