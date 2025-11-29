// pages/api/checkout/pro.js
// 安全占位版本：不引用 stripe，避免构建报错

export default async function handler(req, res) {
  return res.status(501).json({
    error:
      '支付接口暂未配置。请从网站中已有的升级入口进行付款，或者联系站长配置新的结算流程。',
  });
}
