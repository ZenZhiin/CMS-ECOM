'use client';

import React, { useState } from 'react';
import { User, Lock, Mail, ShoppingBag, Package, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useCommerce } from '@/context/CommerceContext';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

export default function AccountPage() {
  const { 
    customer, 
    isCustomerLoggedIn, 
    loginCustomer, 
    logoutCustomer 
  } = useCommerce();
  const { showToast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await loginCustomer({ email: formData.email, password: formData.password });
        showToast('Welcome back!', 'success');
      } else {
        // Register logic...
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCustomerLoggedIn) {
    return (
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.profileInfo}>
            <div className={styles.avatar}>
              {customer?.firstName?.charAt(0) || customer?.email?.charAt(0)}
            </div>
            <div>
              <h3>{customer?.firstName} {customer?.lastName}</h3>
              <p>{customer?.email}</p>
            </div>
          </div>
          <nav className={styles.nav}>
            <button className={styles.active}><Package size={18} /> Orders</button>
            <button><ShoppingBag size={18} /> Subscriptions</button>
            <button><User size={18} /> Profile Settings</button>
            <button onClick={logoutCustomer} className={styles.logout}><LogOut size={18} /> Logout</button>
          </nav>
        </aside>

        <main className={styles.content}>
          <header className={styles.header}>
            <h1 className="brand-font">My Dashboard</h1>
            <p>Track your orders, downloads, and subscriptions.</p>
          </header>

          <section className={styles.ordersSection}>
            <div className={styles.emptyOrders}>
              <Package size={48} />
              <h3>No orders yet</h3>
              <p>You haven't placed any orders yet. Start shopping to see them here!</p>
              <Button onClick={() => window.location.href = '/shop'}>Go to Shop</Button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.logo}>Z</div>
          <h1 className="brand-font">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Login to access your downloads and orders.' : 'Join us to track your purchases.'}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.row}>
              <Input 
                label="First Name" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                required
              />
              <Input 
                label="Last Name" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                required
              />
            </div>
          )}
          <Input 
            label="Email Address" 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
          </Button>
        </form>

        <div className={styles.authFooter}>
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
