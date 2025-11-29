// models/Generation.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const GenerationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    thumbUrl: {
      type: String,
    },
    prompt: {
      type: String,
    },
    style: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    planAtGeneration: {
      type: String,
    },
    creditsCost: {
      type: Number,
    },
    meta: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Generation ||
  mongoose.model('Generation', GenerationSchema);
