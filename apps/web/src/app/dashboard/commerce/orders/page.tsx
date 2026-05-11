'use client';

import React, { useEffect, useState } from 'react';
import { Package, Truck, Search, Eye, ExternalLink, Calendar, User, DollarSign } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { commerceService } from '@/features/commerce/services/commerce.service';
import { useToast } from '@/context/ToastContext';
import { OrderDetailsModal } from '@/features/commerce/components/OrderDetailsModal';
import styles from './page.module.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await commerceService.getOrders();
      setOrders(data);
    } catch (err) {
      showToast('Failed to load orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return styles.paid;
      case 'SHIPPED': return styles.shipped;
      case 'DELIVERED': return styles.delivered;
      case 'CANCELLED': return styles.cancelled;
      default: return styles.pending;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="brand-font">Transactions & Orders</h1>
          <p>Manage sales, track shipping, and update order statuses.</p>
        </div>
        <div className={styles.actions}>
          <div className={styles.searchBar}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by order # or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="secondary" onClick={fetchOrders}>Refresh</Button>
        </div>
      </header>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Shipping</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className={styles.loading}>Loading orders...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={7} className={styles.empty}>No orders found</td></tr>
            ) : filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className={styles.orderNum}>#{order.orderNumber}</td>
                <td>
                  <div className={styles.customerInfo}>
                    <span>{order.customer.firstName} {order.customer.lastName}</span>
                    <small>{order.customer.email}</small>
                  </div>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className={styles.amount}>${parseFloat(order.totalAmount).toFixed(2)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.shippingCarrier ? (
                    <div className={styles.shippingInfo}>
                      <Truck size={14} />
                      <span>{order.shippingCarrier}</span>
                      <small>{order.trackingNumber}</small>
                    </div>
                  ) : (
                    <span className={styles.notShipped}>Not Shipped</span>
                  )}
                </td>
                <td>
                  <button 
                    className={styles.viewBtn} 
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        onUpdate={fetchOrders}
      />
    </div>
  );
}
