// pages/api/stripe/create-checkout-session.js

import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// 这里用的是订阅价格 ID（从 Stripe Dashboard 复制过来）
// 例如 price_1234567890abcdef
const creatorPriceId = process.env.STRIPE_CREATOR_PRICE_ID;

// 用 NEXTAUTH_URL 作为站点根地址（你之前已经配置过）
const appBaseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!stripeSecretKey) {
    return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY env' });
  }
  if (!creatorPriceId) {
    return res.status(500).json({ error: 'Missing STRIPE_CREATOR_PRICE_ID env' });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-06-20',
  });

  try {
    // 如果你想根据 req.body.plan 支持多个套餐，可以在这里做判断
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: creatorPriceId,
          quantity: 1,
        },
      ],
      // 支付成功 / 取消后的跳转页面
      success_url: `${appBaseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appBaseUrl}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({
      error: 'Unable to create checkout session',
      message: err.message,
    });
  }
}
