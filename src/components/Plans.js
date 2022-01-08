import React, { useState, useEffect } from 'react'
import { collection, doc, getDocs, getDoc, addDoc, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useSelector } from 'react-redux'
import { selectUser } from '../features/userSlice'
import { loadStripe } from '@stripe/stripe-js'
import Spinner from 'react-bootstrap/Spinner'

const Plans = () => {
  const [products, setProducts] = useState({})
  const user = useSelector(selectUser)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const fetchFromDB = async () => {
      const customerDoc = doc(db, 'customers', user.uid)
      const querySnapshot = await getDocs(collection(customerDoc, 'subscriptions'))
      
      querySnapshot.forEach((subscription) => {
        setSubscription({
          role: subscription.data().role,
          current_period_end: subscription.data().current_period_end.seconds,
          current_period_start: subscription.data().current_period_start.seconds
        })
      })
      setLoading(false)
    }
    fetchFromDB()
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetchFromDB = async () => {
      const q = query(collection(db, "products"), where("active", "==", true) )
      const querySnapshot = await getDocs(q)
      const products = {}

      querySnapshot.forEach(async (productDoc) => {
        products[productDoc.id] = productDoc.data()
        const priceSnap = await getDocs(collection(productDoc.ref, 'prices'))

        priceSnap.docs.forEach((price) => {
          products[productDoc.id].prices = {
            priceId: price.id,
            priceData: price.data()
          }
        })
        setProducts(products)
      })
      setLoading(false)
    }

    fetchFromDB()
  }, [])

  console.log(products)
  console.log(subscription)

  const loadCheckout = async (priceID) => {
    const customerDoc = doc(db, 'customers', user.uid)
    const customerCollection = collection(customerDoc, 'checkout_sessions')

    const docRef = await addDoc(customerCollection, {
      price: priceID,
      success_url: window.location.origin,
      cancel_url: window.location.origin
    })
    
    onSnapshot(docRef, async (snap) => {
      const { error, sessionId } = snap.data()

      if (error) {
        alert(`An error occured: ${error.message}`)
      }

      if (sessionId) {
        const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
        stripe.redirectToCheckout({ sessionId })
      }
    })
  }

  const getTitleCase = (string) => {
    const strArr = []
    string.split(' ').forEach((word) => {
      strArr.push(`${string[0].toUpperCase()}${string.slice(1,)}`)
    })
    return strArr.join(' ')
  }

  return (
    loading ? <div className=""><Spinner animation="border" variant="danger" /></div>: (
      <div className="space-between-y-2">
        {!subscription ? 
          <div>
            Plans (Current Plan: None)
          </div> : null}
        {subscription ? 
          (
            <div>
              <div>Plans (Current Plan: {getTitleCase(subscription?.role)})</div>
              <div className="fs-md">
                Renewal date: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
              </div>
            </div>
          ) : null}

        <div className="fs-md space-between-y-4">
          {Object.entries(products).map(([productId, productData]) => {
            const isCurrentPackage = subscription ? (productData?.name.toLowerCase().includes(subscription?.role)) : false

            return (
              <div key={productId} className="d-flex justify-content-between gap-2 w-100">
                <div>
                  <div>{productData.name}</div>
                  <div>{productData.description}</div>
                </div>

                <button className={`${isCurrentPackage ? 'netflixGrayButton' : 'netflixRedButton'}`} onClick={() => {
                  if (!isCurrentPackage) {
                    loadCheckout(productData.prices.priceId)}
                  }
                }>
                  {isCurrentPackage ? 'Current Package' : 'Subscribe'}
                </button>
              </div>
            )
          })}
          
        </div>
      </div>
    )
  )
}

export default Plans