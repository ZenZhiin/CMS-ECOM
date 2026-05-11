'use client';

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/atoms/Button';
import { commerceService } from '@/features/commerce/services/commerce.service';
import { useCommerce } from '@/context/CommerceContext';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

interface CheckoutFormProps {
  clientSecret: string;
  shippingInfo: any;
  onSuccess: (order: any) => void;
}

export default function CheckoutForm({ clientSecret, shippingInfo, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart, cartTotal, customer, clearCart } = useCommerce();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        showToast(error.message || 'Payment failed', 'error');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful, now create order in backend
        const order = await commerceService.createOrder({
          customerId: customer?.id || null, // Allow guest checkout or logged in
          items: cart,
          totalAmount: cartTotal,
          shippingAddress: shippingInfo,
          paymentIntentId: paymentIntent.id
        });
        
        clearCart();
        onSuccess(order);
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.paymentForm}>
      <PaymentElement />
      <Button 
        type="submit" 
        className={styles.payBtn} 
        disabled={isProcessing || !stripe || !elements}
      >
        {isProcessing ? 'Processing Payment...' : `Pay $${cartTotal.toFixed(2)}`}
      </Button>
    </form>
  );
}
