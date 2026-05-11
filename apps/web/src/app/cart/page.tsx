'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useCommerce } from '@/context/CommerceContext';
import styles from './page.module.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCommerce();

  if (cart.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyContent}>
          <h1 className="brand-font">Your cart is empty</h1>
          <p>Go back to the shop to find something amazing.</p>
          <Link href="/shop">
            <Button>
              <ArrowLeft size={18} /> Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/shop" className={styles.backLink}>
          <ArrowLeft size={20} /> Back to Shop
        </Link>
        <h1 className="brand-font">Shopping Cart</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.cartList}>
          {cart.map((item) => (
            <div key={item.variantId} className={styles.cartItem}>
              <div className={styles.itemInfo}>
                <h3>{item.name}</h3>
                <span>Variant: {item.variantName}</span>
              </div>
              <div className={styles.itemControls}>
                <div className={styles.quantity}>
                  <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>+</button>
                </div>
                <div className={styles.price}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button className={styles.removeBtn} onClick={() => removeFromCart(item.variantId)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <h3>Order Summary</h3>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <Button className={styles.checkoutBtn} onClick={() => window.location.href = '/checkout'}>
              <CreditCard size={18} /> Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
