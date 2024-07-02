import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  webhookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Webhook', required: true },
  payload: { type: Object, required: true },
  name: {type: String, required:true}
},{
    timestamps:true
});

const Event= mongoose.model('Event', EventSchema);
export default Event;
