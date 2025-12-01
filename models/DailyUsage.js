import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * DailyUsage 表：按「用户 + 日期」记录每天大概的成本
 *
 * 目前只统计：
 *  - imageGenerations: 生成图片次数
 *  - costUsd:          估算的 OpenAI 成本（美元）
 *
 * 以后可以继续加：
 *  - labOperations
 *  - tokens 等
 */
const DailyUsageSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date, // 归一化到 UTC 00:00:00
      required: true,
    },
    imageGenerations: {
      type: Number,
      default: 0,
    },
    costUsd: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 同一个用户一天只有一条记录
DailyUsageSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.models.DailyUsage ||
  mongoose.model('DailyUsage', DailyUsageSchema);
