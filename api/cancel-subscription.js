import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { subscription_id } = req.body;

    if (!subscription_id) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }

    console.log('Canceling Stripe subscription:', subscription_id);

    // Cancel the subscription on Stripe
    const canceledSubscription = await stripe.subscriptions.cancel(subscription_id);

    console.log('Subscription canceled successfully:', canceledSubscription.id);
    return res.json({ 
      success: true, 
      subscription_id: canceledSubscription.id,
      status: canceledSubscription.status 
    });

  } catch (error) {
    console.error('Error canceling subscription:', error.message);
    return res.status(400).json({ 
      error: 'Failed to cancel subscription', 
      details: error.message 
    });
  }
}