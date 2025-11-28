// models/Usage.js
import mongoose from 'mongoose';

const UsageSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    type: { type: String, required: true }, // 'login', 'activity', 'generate', etc.
    ip: { type: String },
    userAgent: { type: String },
    meta: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.models.Usage || mongoose.model('Usage', UsageSchema);
