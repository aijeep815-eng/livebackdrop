// models/Feedback.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const FeedbackSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    email: {
      type: String,
    },
    category: {
      type: String,
      enum: ['bug', 'idea', 'billing', 'other'],
      default: 'other',
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'closed'],
      default: 'open',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Feedback ||
  mongoose.model('Feedback', FeedbackSchema);
