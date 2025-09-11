import React, { useState, useEffect } from 'react';
import { collection, doc, getDocs, query, where, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import Spinner from 'react-bootstrap/Spinner';

/**
 * @description - 
 * @returns {React.FC}
 */
const Plans = () => {
  const [products, setProducts] = useState({});
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Payment link mapping (replace these with your actual Stripe payment link URLs)
  const PAYMENT_LINKS = {
    'price_1KAGXuJJIMSmOwQ2fEPSIfyE': 'https://buy.stripe.com/test_dRmbJ22nZgmB9LigdH2Nq00', // $17.99
    'price_1KAGXbJJIMSmOwQ2tmj68A6L': 'https://buy.stripe.com/test_3cI7sMd2Db2h6z6f9D2Nq01', // $13.99
    'price_1KAGXLJJIMSmOwQ2CeHHqrjl': 'https://buy.stripe.com/test_3cIfZiaUv7Q5aPm4uZ2Nq02', // $8.99
  };

  // Plan name mapping based on subscription amounts
  const PLAN_NAMES = {
    1799: 'Netflix Premium', // $17.99
    1399: 'Netflix Basic',   // $13.99
    899: 'Netflix Standard'  // $8.99
  };

  // Handle URL parameters (success/cancel from Stripe)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');
    const sessionId = urlParams.get('session_id');

    const syncSubscriptionFromStripe = async (sessionId) => {
      try {
        // Call our API endpoint to verify the Stripe session and get real subscription data
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/api/verify-stripe-session' // Vercel endpoint
          : 'http://localhost:3001/api/verify-stripe-session'; // Local Express server
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to verify session');
        }

        const subscriptionData = await response.json();
        
        const customerDoc = doc(db, 'customers', user.uid);
        
        // First, delete any existing subscriptions and cancel them on Stripe
        const existingSubscriptionsSnapshot = await getDocs(collection(customerDoc, 'subscriptions'));
        const deletePromises = [];
        const cancelPromises = [];
        
        existingSubscriptionsSnapshot.forEach((doc) => {
          const existingData = doc.data();
          console.log('Deleting existing subscription:', doc.id, existingData.stripe_subscription_id);
          
          // Delete from Firebase
          deletePromises.push(deleteDoc(doc.ref));
          
          // Cancel on Stripe
          if (existingData.stripe_subscription_id) {
            const cancelApiUrl = process.env.NODE_ENV === 'production' 
              ? '/api/cancel-subscription'
              : 'http://localhost:3001/api/cancel-subscription';
            
            cancelPromises.push(
              fetch(cancelApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription_id: existingData.stripe_subscription_id })
              }).then(response => {
                if (response.ok) {
                  console.log('Stripe subscription canceled:', existingData.stripe_subscription_id);
                } else {
                  console.error('Failed to cancel Stripe subscription:', existingData.stripe_subscription_id);
                }
              }).catch(error => {
                console.error('Error canceling subscription on Stripe:', error);
              })
            );
          }
        });
        
        // Wait for all deletions and cancellations to complete
        await Promise.all([...deletePromises, ...cancelPromises]);
        
        // Now create the new subscription document
        const subscriptionDoc = doc(collection(customerDoc, 'subscriptions'), subscriptionData.price_id);
        
        // Use real Stripe data instead of placeholder data
        await setDoc(subscriptionDoc, {
          role: subscriptionData.role,
          current_period_end: { seconds: subscriptionData.current_period_end },
          current_period_start: { seconds: subscriptionData.current_period_start },
          stripe_session_id: sessionId,
          stripe_subscription_id: subscriptionData.stripe_subscription_id,
          stripe_customer_id: subscriptionData.stripe_customer_id,
          status: subscriptionData.status,
          price_id: subscriptionData.price_id,
          amount: subscriptionData.amount,
          currency: subscriptionData.currency,
          interval: subscriptionData.interval,
          created_at: new Date()
        });

        console.log('Real subscription synced to Firebase');
        alert('Subscription activated successfully!');
        
        // Refresh the page to show updated subscription
        window.location.reload();
        
      } catch (error) {
        console.error('Error syncing subscription:', error);
        alert('Payment successful, but there was an issue updating your account. Please contact support.');
      }
    };

    if (success === 'true' && sessionId) {
      syncSubscriptionFromStripe(sessionId);
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled === 'true') {
      alert('Payment was canceled');
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    
    const fetchSubscription = async () => {
      try {
        const customerDoc = doc(db, 'customers', user.uid);
        const querySnapshot = await getDocs(collection(customerDoc, 'subscriptions'));

        console.log(querySnapshot)

        if (!querySnapshot.empty) {
          const subscriptionDoc = querySnapshot.docs[0];
          setSubscription({
            role: subscriptionDoc.data().role,
            current_period_end: subscriptionDoc.data().current_period_end.seconds,
            current_period_start: subscriptionDoc.data().current_period_start.seconds,
            price_id: subscriptionDoc.data().price_id,
            amount: subscriptionDoc.data().amount
          });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      }
    };
    
    fetchSubscription();
  }, [user?.uid]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "products"), where("active", "==", true));
        const querySnapshot = await getDocs(q);
        const products = {};

        // Use Promise.all instead of forEach for async operations
        await Promise.all(querySnapshot.docs.map(async (productDoc) => {
          products[productDoc.id] = productDoc.data();
          const priceSnap = await getDocs(collection(productDoc.ref, 'prices'));

          priceSnap.docs.forEach((price) => {
            products[productDoc.id].prices = {
              priceId: price.id,
              priceData: price.data()
            };
          });
        }));

        console.log(products)
        
        setProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const loadCheckout = async (priceID) => {
    const paymentLink = PAYMENT_LINKS[priceID];
    
    if (!paymentLink) {
      alert('Payment link not configured for this plan.');
      return;
    }
    
    // Redirect to the payment link (success/cancel URLs are configured in Stripe Dashboard)
    window.location.href = paymentLink;
  };

  const getTitleCase = (string) => {
    const strArr = [];
    string.split(' ').forEach((word) => {
      strArr.push(`${word[0].toUpperCase()}${word.slice(1)}`);
    });
    return strArr.join(' ');
  };

  return (
    loading ? <div className=""><Spinner animation="border" variant="danger" /></div> : (
      <div className="space-between-y-2">
        {!subscription ?
          <div className="fw-bold">
            Plans (Current Plan: None)
          </div> : null}
        {subscription ?
          (
            <div className="fw-bold">
              <div>Plans (Current Plan: {PLAN_NAMES[subscription?.amount] || getTitleCase(subscription?.role)})</div>
              <div className="fs-md">
                Renewal date: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
              </div>
            </div>
          ) : null}

        <div className="fs-md space-between-y-4">
          {Object.entries(products)
            .sort(([, a], [, b]) => b.prices.priceData.unit_amount - a.prices.priceData.unit_amount)
            .map(([productId, productData]) => {
            const isCurrentPackage = subscription ? (productData.prices.priceId === subscription.price_id) : false;

            return (
              <div key={productId} className="d-flex justify-content-between gap-2 w-100">
                <div>
                  <div>
                    {productData.name} - ${(productData.prices.priceData.unit_amount / 100).toFixed(2)}/month
                  </div>
                  <div>{productData.description}</div>
                </div>

                <button className={`${isCurrentPackage ? 'netflixGrayButton' : 'netflixRedButton'}`} onClick={() => {
                  if (!isCurrentPackage) {
                    loadCheckout(productData.prices.priceId);
                  }
                }
                }>
                  {isCurrentPackage ? 'Current Package' : 'Subscribe'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

export default Plans;