import mongoose from 'mongoose';

const webhookSubscriptionSchema = new mongoose.Schema({
  url: { type: String, required: true },
  source: { type: String, required: true },
  events: [{ type: String, required: true }],
  user:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true}
});

const WebhookSubscription = mongoose.model('WebhookSubscription', webhookSubscriptionSchema);
export default WebhookSubscription;