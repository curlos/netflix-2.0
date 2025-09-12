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
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    console.log('Verifying Stripe session:', session_id);

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription']
    });

    if (!session.subscription) {
      return res.status(400).json({ error: 'No subscription found for this session' });
    }

    const subscription = session.subscription;
    
    // Get the subscription item (contains billing period info)
    const subscriptionItem = subscription.items.data[0];
    const price = subscriptionItem.price;
    
    // Map price to plan role - you can customize this logic
    let role = 'premium'; // default
    if (price.nickname) {
      role = price.nickname.toLowerCase();
    } else if (price.metadata && price.metadata.plan) {
      role = price.metadata.plan.toLowerCase();
    }

    // Return subscription data in Firebase-compatible format
    const subscriptionData = {
      role: role,
      current_period_end: subscriptionItem.current_period_end,
      current_period_start: subscriptionItem.current_period_start,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      status: subscription.status,
      price_id: price.id,
      amount: price.unit_amount,
      currency: price.currency,
      interval: price.recurring.interval
    };

    console.log('Subscription data verified:', subscriptionData);
    res.json(subscriptionData);

  } catch (error) {
    console.error('Error verifying Stripe session:', error.message);
    res.status(400).json({ 
      error: 'Failed to verify session', 
      details: error.message 
    });
  }
}