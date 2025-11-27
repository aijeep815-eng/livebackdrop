// models/Background.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const BackgroundSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    prompt: {
      type: String
    },
    model: {
      type: String
    },
    imageUrl: {
      type: String,
      required: true
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Background ||
  mongoose.model("Background", BackgroundSchema);
