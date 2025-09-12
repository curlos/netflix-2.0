require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
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
    res.json({ 
      success: true, 
      subscription_id: canceledSubscription.id,
      status: canceledSubscription.status 
    });

  } catch (error) {
    console.error('Error canceling subscription:', error.message);
    res.status(400).json({ 
      error: 'Failed to cancel subscription', 
      details: error.message 
    });
  }
}