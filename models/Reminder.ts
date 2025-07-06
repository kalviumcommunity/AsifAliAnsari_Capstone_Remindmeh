import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Reminder = mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);

export default Reminder;
