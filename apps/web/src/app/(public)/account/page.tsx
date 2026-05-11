'use client';

import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, ShoppingBag, Package, LogOut, ArrowLeft, ChevronRight, Download, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useCommerce } from '@/context/CommerceContext';
import { useToast } from '@/context/ToastContext';
import { commerceService } from '@/features/commerce/services/commerce.service';
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
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (isCustomerLoggedIn && customer?.id) {
      fetchOrders();
    }
  }, [isCustomerLoggedIn, customer?.id]);

  const fetchOrders = async () => {
    try {
      const data = await commerceService.getCustomerOrders(customer.id);
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await loginCustomer({ email: formData.email, password: formData.password });
        showToast('Welcome back!', 'success');
      } else {
        await commerceService.registerCustomer({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName
        });
        showToast('Account created! Please login.', 'success');
        setIsLogin(true);
      }
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return styles.statusPaid;
      case 'SHIPPED': return styles.statusShipped;
      case 'COMPLETED': return styles.statusCompleted;
      default: return styles.statusPending;
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
            <button 
              className={activeTab === 'orders' ? styles.active : ''} 
              onClick={() => setActiveTab('orders')}
            >
              <Package size={18} /> Orders
            </button>
            <button 
              className={activeTab === 'profile' ? styles.active : ''} 
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} /> Profile Settings
            </button>
            <button onClick={logoutCustomer} className={styles.logout}>
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </aside>

        <main className={styles.content}>
          <header className={styles.header}>
            <h1 className="brand-font">My {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p>
              {activeTab === 'orders' 
                ? 'Track your orders, downloads, and shipping status.' 
                : 'Manage your personal information and security.'}
            </p>
          </header>

          {activeTab === 'orders' && (
            <section className={styles.ordersSection}>
              {orders.length === 0 ? (
                <div className={styles.emptyOrders}>
                  <Package size={48} />
                  <h3>No orders yet</h3>
                  <p>You haven't placed any orders yet. Start shopping to see them here!</p>
                  <Button onClick={() => window.location.href = '/shop'}>Go to Shop</Button>
                </div>
              ) : (
                <div className={styles.ordersList}>
                  {orders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderHeader}>
                        <div>
                          <span className={styles.orderNumber}>#{order.orderNumber}</span>
                          <span className={styles.orderDate}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className={styles.orderItems}>
                        {order.items.map((item: any) => (
                          <div key={item.id} className={styles.orderItem}>
                            <div className={styles.itemInfo}>
                              <div className={styles.itemIcon}>
                                {item.variant.product.type === 'DIGITAL' ? <Download size={16} /> : <Package size={16} />}
                              </div>
                              <div>
                                <p className={styles.itemName}>{item.variant.product.name}</p>
                                <p className={styles.itemVariant}>{item.variant.sku} × {item.quantity}</p>
                              </div>
                            </div>
                            <span className={styles.itemPrice}>${(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className={styles.orderFooter}>
                        <div className={styles.orderTotal}>
                          <span>Total Amount</span>
                          <span className={styles.amount}>${parseFloat(order.totalAmount).toFixed(2)}</span>
                        </div>
                        
                        {order.status === 'SHIPPED' && order.trackingNumber && (
                          <div className={styles.shippingInfo}>
                            <Truck size={14} /> 
                            <span>{order.shippingCarrier}: {order.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'profile' && (
            <section className={styles.profileSection}>
              <div className={styles.card}>
                <h3>Personal Information</h3>
                <div className={styles.profileGrid}>
                  <div className={styles.profileField}>
                    <label>First Name</label>
                    <p>{customer?.firstName}</p>
                  </div>
                  <div className={styles.profileField}>
                    <label>Last Name</label>
                    <p>{customer?.lastName}</p>
                  </div>
                  <div className={styles.profileField}>
                    <label>Email Address</label>
                    <p>{customer?.email}</p>
                  </div>
                </div>
              </div>
            </section>
          )}
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
