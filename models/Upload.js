// models/Upload.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const UploadSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true, index: true },
    format: String,
    width: Number,
    height: Number,
    bytes: Number,
    originalFilename: String,
    resourceType: { type: String, default: 'image' },
    category: {
      type: String,
      enum: ['background', 'reference', 'upload'],
      default: 'upload',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Upload || mongoose.model('Upload', UploadSchema);
