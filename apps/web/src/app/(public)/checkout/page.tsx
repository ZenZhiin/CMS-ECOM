'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ShoppingBag, CreditCard, Truck, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useCommerce } from '@/context/CommerceContext';
import { commerceService } from '@/features/commerce/services/commerce.service';
import { useToast } from '@/context/ToastContext';
import CheckoutForm from './CheckoutForm';
import styles from './page.module.css';

// We'll use the publishable key from settings in a real app
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export default function CheckoutPage() {
  const { cart, cartTotal, customer } = useCommerce();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [clientSecret, setClientSecret] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const { showToast } = useToast();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
    email: customer?.email || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create Payment Intent
      const { clientSecret } = await commerceService.createPaymentIntent({
        amount: cartTotal,
        currency: 'usd'
      });
      setClientSecret(clientSecret);
      setStep(2);
    } catch (err) {
      showToast('Failed to initialize payment', 'error');
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className={styles.emptyContainer}>
        <ShoppingBag size={64} />
        <h1 className="brand-font">Your cart is empty</h1>
        <p>You need to add items to your cart before checking out.</p>
        <Button onClick={() => window.location.href = '/shop'}>Go to Shop</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.stepper}>
        <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
          <div className={styles.stepNum}>1</div>
          <span>Shipping</span>
        </div>
        <div className={styles.divider} />
        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
          <div className={styles.stepNum}>2</div>
          <span>Payment</span>
        </div>
        <div className={styles.divider} />
        <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
          <div className={styles.stepNum}>3</div>
          <span>Confirmation</span>
        </div>
      </div>

      <div className={styles.content}>
        {step === 1 && (
          <form onSubmit={handleShippingSubmit} className={styles.form}>
            <div className={styles.section}>
              <h2 className="brand-font">Shipping Information</h2>
              <div className={styles.row}>
                <Input 
                  label="First Name" 
                  value={shippingInfo.firstName}
                  onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                  required
                />
                <Input 
                  label="Last Name" 
                  value={shippingInfo.lastName}
                  onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                  required
                />
              </div>
              <Input 
                label="Email" 
                type="email"
                value={shippingInfo.email}
                onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                required
              />
              <Input 
                label="Street Address" 
                value={shippingInfo.street}
                onChange={(e) => setShippingInfo({...shippingInfo, street: e.target.value})}
                required
              />
              <div className={styles.row}>
                <Input 
                  label="City" 
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                  required
                />
                <Input 
                  label="State / Province" 
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                  required
                />
              </div>
              <div className={styles.row}>
                <Input 
                  label="ZIP / Postal Code" 
                  value={shippingInfo.zip}
                  onChange={(e) => setShippingInfo({...shippingInfo, zip: e.target.value})}
                  required
                />
                <Input 
                  label="Country" 
                  value={shippingInfo.country}
                  onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className={styles.footer}>
              <Button variant="secondary" onClick={() => window.location.href = '/cart'}>
                <ArrowLeft size={18} /> Back to Cart
              </Button>
              <Button type="submit">
                Continue to Payment <ArrowRight size={18} />
              </Button>
            </div>
          </form>
        )}

        {step === 2 && clientSecret && (
          <div className={styles.paymentContainer}>
            <h2 className="brand-font">Payment Method</h2>
            <p>Your payment is secure and encrypted.</p>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm 
                clientSecret={clientSecret} 
                shippingInfo={shippingInfo}
                onSuccess={(order) => {
                  setOrderData(order);
                  setStep(3);
                }}
              />
            </Elements>
          </div>
        )}

        {step === 3 && orderData && (
          <div className={styles.successContainer}>
            <CheckCircle size={80} className={styles.successIcon} />
            <h1 className="brand-font">Order Confirmed!</h1>
            <p>Thank you for your purchase. Your order number is <strong>#{orderData.orderNumber}</strong>.</p>
            <p>We've sent a confirmation email to {shippingInfo.email}.</p>
            <div className={styles.successActions}>
              <Button onClick={() => window.location.href = '/account'}>View My Orders</Button>
              <Button variant="secondary" onClick={() => window.location.href = '/shop'}>Continue Shopping</Button>
            </div>
          </div>
        )}

        {/* Sidebar Summary */}
        {step !== 3 && (
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>
              <div className={styles.itemsList}>
                {cart.map((item: any) => (
                  <div key={item.variantId} className={styles.summaryItem}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.divider} />
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span className={styles.free}>FREE</span>
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
