'use client';

import React, { useState, useEffect } from 'react';
import { X, Truck, Package, CreditCard, User, MapPin, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/atoms/Modal';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { commerceService } from '../services/commerce.service';
import { useToast } from '@/context/ToastContext';
import styles from './OrderDetailsModal.module.css';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  onUpdate: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onUpdate
}) => {
  const [status, setStatus] = useState('');
  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setCarrier(order.shippingCarrier || '');
      setTracking(order.trackingNumber || '');
    }
  }, [order, isOpen]);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      await commerceService.updateOrder(order.id, {
        status,
        shippingCarrier: carrier,
        trackingNumber: tracking
      });
      showToast('Order updated successfully', 'success');
      onUpdate();
      onClose();
    } catch (err) {
      showToast('Failed to update order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={`Order #${order.orderNumber}`}
      size="large"
    >
      <div className={styles.container}>
        <div className={styles.main}>
          {/* Order Summary */}
          <div className={styles.section}>
            <h3>Order Items</h3>
            <div className={styles.itemsList}>
              {order.items?.map((item: any) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.variant.product.name}</span>
                    <span className={styles.itemMeta}>SKU: {item.variant.sku} × {item.quantity}</span>
                  </div>
                  <span className={styles.itemPrice}>${(parseFloat(item.priceAtPurchase) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className={styles.totalRow}>
              <span>Total Amount</span>
              <span>${parseFloat(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          {/* Customer & Address */}
          <div className={styles.section}>
            <h3>Customer Details</h3>
            <div className={styles.detailGrid}>
              <div className={styles.detail}>
                <User size={16} />
                <div>
                  <label>Name</label>
                  <p>{order.customer.firstName} {order.customer.lastName}</p>
                </div>
              </div>
              <div className={styles.detail}>
                <MapPin size={16} />
                <div>
                  <label>Shipping Address</label>
                  <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.statusCard}>
            <h3>Manage Shipping</h3>
            <div className={styles.formGroup}>
              <label>Order Status</label>
              <Select 
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
                options={[
                  { label: 'Pending', value: 'PENDING' },
                  { label: 'Paid', value: 'PAID' },
                  { label: 'Processing', value: 'PROCESSING' },
                  { label: 'Shipped', value: 'SHIPPED' },
                  { label: 'Delivered', value: 'DELIVERED' },
                  { label: 'Cancelled', value: 'CANCELLED' }
                ]}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Shipping Carrier</label>
              <Input 
                placeholder="e.g. FedEx, DHL, PosLaju" 
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Tracking Number</label>
              <Input 
                placeholder="Paste tracking ID..." 
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
              />
            </div>
            <Button 
              className={styles.saveBtn} 
              onClick={handleUpdate}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </aside>
      </div>
    </Modal>
  );
};
