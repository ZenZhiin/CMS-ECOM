'use client';

import React, { useEffect, useState } from 'react';
import { Save, Globe, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState<any>({
    siteName: '',
    siteLogo: '',
    footerText: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await apiFetch('/settings');
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiFetch('/settings', {
        method: 'PATCH',
        body: JSON.stringify(settings)
      });
      alert('Settings updated successfully');
    } catch (err) {
      alert('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="brand-font">Site Identity</h1>
        <p>Configure the global branding and meta settings for your website.</p>
      </header>

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.card}>
          <h2>General Settings</h2>
          <div className={styles.grid}>
            <Input 
              label="Site Name" 
              value={settings.siteName} 
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              placeholder="e.g. Zhiin CMS Portal"
            />
            <div className={styles.logoField}>
              <Input 
                label="Logo URL" 
                value={settings.siteLogo || ''} 
                onChange={(e) => setSettings({...settings, siteLogo: e.target.value})}
                placeholder="https://example.com/logo.png"
              />
              {settings.siteLogo && (
                <div className={styles.logoPreview}>
                  <img src={settings.siteLogo} alt="Logo Preview" />
                </div>
              )}
            </div>
            <div className={styles.fullWidth}>
              <label className={styles.label}>Footer Text</label>
              <textarea 
                className={styles.textarea}
                value={settings.footerText || ''}
                onChange={(e) => setSettings({...settings, footerText: e.target.value})}
                placeholder="© 2026 Zhiin Digital. All rights reserved."
              />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="submit" isLoading={isSaving}>
            <Save size={18} />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
