// models/Subscription.js
import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    plan: { type: String, default: "creator" }, // creator, studio, etc.
    status: { type: String, default: "active" }, // active, canceled, past_due, etc.
  },
  {
    timestamps: true,
  }
);

SubscriptionSchema.index({ email: 1, plan: 1 });

export default mongoose.models.Subscription || mongoose.model("Subscription", SubscriptionSchema);
