'use client';

import React, { useState } from 'react';
import { Settings, CreditCard, HardDrive, Globe, Save, Lock, Cloud, Shield } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

export default function CommerceSettingsPage() {
  const [activeTab, setActiveTab] = useState('payments');
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const [paymentConfig, setPaymentConfig] = useState({
    provider: 'stripe',
    publishableKey: '',
    secretKey: '',
    webhookSecret: '',
    currency: 'USD'
  });

  const [storageConfig, setStorageConfig] = useState({
    provider: 'local',
    bucketName: '',
    region: 'us-east-1',
    accessKey: '',
    secretKey: '',
    customDomain: ''
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Commerce settings saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="brand-font">Commerce Settings</h1>
          <p>Configure payments, storage, and fulfillment logic.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </header>

      <div className={styles.tabsContainer}>
        <nav className={styles.tabs}>
          <button 
            className={activeTab === 'payments' ? styles.activeTab : ''} 
            onClick={() => setActiveTab('payments')}
          >
            <CreditCard size={18} /> Payment Gateways
          </button>
          <button 
            className={activeTab === 'storage' ? styles.activeTab : ''} 
            onClick={() => setActiveTab('storage')}
          >
            <HardDrive size={18} /> Digital Storage
          </button>
          <button 
            className={activeTab === 'general' ? styles.activeTab : ''} 
            onClick={() => setActiveTab('general')}
          >
            <Globe size={18} /> General
          </button>
        </nav>

        <div className={styles.tabContent}>
          {activeTab === 'payments' && (
            <div className={styles.section}>
              <div className={styles.sectionInfo}>
                <h3>Payment Configuration</h3>
                <p>Allow your customers to pay via Stripe. More providers coming soon.</p>
              </div>
              <div className={styles.formCard}>
                <div className={styles.field}>
                  <label>Payment Provider</label>
                  <Select 
                    value={paymentConfig.provider}
                    onChange={(e) => setPaymentConfig({...paymentConfig, provider: e.target.value})}
                    options={[{ label: 'Stripe', value: 'stripe' }]}
                  />
                </div>
                <div className={styles.row}>
                  <Input 
                    label="Stripe Publishable Key" 
                    value={paymentConfig.publishableKey}
                    onChange={(e) => setPaymentConfig({...paymentConfig, publishableKey: e.target.value})}
                    placeholder="pk_test_..."
                  />
                  <Input 
                    label="Stripe Secret Key" 
                    type="password"
                    value={paymentConfig.secretKey}
                    onChange={(e) => setPaymentConfig({...paymentConfig, secretKey: e.target.value})}
                    placeholder="sk_test_..."
                  />
                </div>
                <Input 
                  label="Webhook Secret" 
                  value={paymentConfig.webhookSecret}
                  onChange={(e) => setPaymentConfig({...paymentConfig, webhookSecret: e.target.value})}
                  placeholder="whsec_..."
                />
              </div>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className={styles.section}>
              <div className={styles.sectionInfo}>
                <h3>Digital Delivery Storage</h3>
                <p>Configure where your digital products (zip, pdf, etc.) are securely stored.</p>
              </div>
              <div className={styles.formCard}>
                <div className={styles.field}>
                  <label>Storage Provider</label>
                  <Select 
                    value={storageConfig.provider}
                    onChange={(e) => setStorageConfig({...storageConfig, provider: e.target.value})}
                    options={[
                      { label: 'Self-Hosted (Local)', value: 'local' },
                      { label: 'Amazon S3', value: 's3' },
                      { label: 'Google Cloud Storage', value: 'gcs' }
                    ]}
                  />
                </div>
                
                {storageConfig.provider !== 'local' && (
                  <>
                    <div className={styles.row}>
                      <Input 
                        label="Bucket Name" 
                        value={storageConfig.bucketName}
                        onChange={(e) => setStorageConfig({...storageConfig, bucketName: e.target.value})}
                      />
                      <Input 
                        label="Region" 
                        value={storageConfig.region}
                        onChange={(e) => setStorageConfig({...storageConfig, region: e.target.value})}
                      />
                    </div>
                    <div className={styles.row}>
                      <Input 
                        label="Access Key" 
                        value={storageConfig.accessKey}
                        onChange={(e) => setStorageConfig({...storageConfig, accessKey: e.target.value})}
                      />
                      <Input 
                        label="Secret Key" 
                        type="password"
                        value={storageConfig.secretKey}
                        onChange={(e) => setStorageConfig({...storageConfig, secretKey: e.target.value})}
                      />
                    </div>
                  </>
                )}

                {storageConfig.provider === 'local' && (
                  <div className={styles.alert}>
                    <Shield size={18} />
                    <p>Files will be stored in the <code>/uploads/digital</code> directory on your server.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className={styles.section}>
              <div className={styles.sectionInfo}>
                <h3>General Commerce Settings</h3>
                <p>Basic store configuration and global defaults.</p>
              </div>
              <div className={styles.formCard}>
                <div className={styles.field}>
                  <label>Store Currency</label>
                  <Select 
                    value={paymentConfig.currency}
                    onChange={(e) => setPaymentConfig({...paymentConfig, currency: e.target.value})}
                    options={[
                      { label: 'USD - US Dollar', value: 'USD' },
                      { label: 'MYR - Malaysian Ringgit', value: 'MYR' },
                      { label: 'EUR - Euro', value: 'EUR' }
                    ]}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
