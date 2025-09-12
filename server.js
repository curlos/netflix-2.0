require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Verify Stripe checkout session and return subscription data
app.post('/api/verify-stripe-session', async (req, res) => {
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
});

// Cancel Stripe subscription
app.post('/api/cancel-subscription', async (req, res) => {
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
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// For Vercel serverless functions, export the app
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available endpoints:');
    console.log(`  POST http://localhost:${PORT}/api/verify-stripe-session`);
    console.log(`  POST http://localhost:${PORT}/api/cancel-subscription`);
    console.log(`  GET  http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel
module.exports = app;