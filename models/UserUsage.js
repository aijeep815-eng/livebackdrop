// models/UserUsage.js
import mongoose from "mongoose";

const UserUsageSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true, index: true }, // format: YYYY-MM-DD
    count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

UserUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.UserUsage || mongoose.model("UserUsage", UserUsageSchema);
