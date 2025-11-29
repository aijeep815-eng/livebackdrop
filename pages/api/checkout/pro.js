import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res){
  try{
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_PRO, quantity: 1 }],
      success_url: process.env.NEXTAUTH_URL + '/success',
      cancel_url: process.env.NEXTAUTH_URL + '/cancel',
    });
    res.redirect(303, session.url);
  } catch(e){
    console.error(e);
    res.status(500).json({error: 'Stripe error'});
  }
}
