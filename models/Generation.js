import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Generation 表：存每一次 AI 生成 / 图像实验室处理的结果。
 *
 * 重要字段：
 *  - imageUrl: 前端 /history 用来展示缩略图 & 打开原图
 *  - result:   原始返回结果（可选，方便以后调试或做更多功能）
 */
const GenerationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
    },
    imageUrl: {
      type: String, // ✅ 关键：必须在 schema 里声明，否则不会存进 MongoDB
    },
    result: {
      type: Schema.Types.Mixed,
    },
    operation: {
      type: String,
      default: 'generate', // 也可以是 'lab', 'upscale' 等
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export default mongoose.models.Generation ||
  mongoose.model('Generation', GenerationSchema);
