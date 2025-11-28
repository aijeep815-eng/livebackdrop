// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // 仅邮箱注册用户有密码，Google 登录用户可以为空
    image: { type: String },
    provider: { type: String, default: 'credentials' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
