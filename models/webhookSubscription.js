import mongoose from 'mongoose';

const webhookSubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sourceUrl: { type: String, required: true, unique:true },
    callbackUrl: { type: String, required: true }
});

const WebhookSubscription = mongoose.model('WebhookSubscription', webhookSubscriptionSchema);
export default WebhookSubscription;


