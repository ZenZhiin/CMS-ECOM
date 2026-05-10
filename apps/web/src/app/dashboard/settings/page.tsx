'use client';

import React, { useEffect, useState } from 'react';
import { Save, Globe, Image as ImageIcon, Plus, Trash2, Share2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { MediaPickerModal } from '@/components/organisms/MediaPickerModal';
import styles from './page.module.css';

export default function GeneralSettingsPage() {
  const { showToast } = useToast();
  const [settings, setSettings] = useState<any>({
    siteName: '',
    siteLogo: '',
    footerText: '',
    socialLinks: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await apiFetch('/settings');
      setSettings({
        ...data,
        socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : []
      });
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addSocialLink = () => {
    setSettings({
      ...settings,
      socialLinks: [...settings.socialLinks, { label: '', url: '', platform: 'custom' }]
    });
  };

  const removeSocialLink = (index: number) => {
    setSettings({
      ...settings,
      socialLinks: settings.socialLinks.filter((_: any, i: number) => i !== index)
    });
  };

  const updateSocialLink = (index: number, key: string, value: string) => {
    const newLinks = [...settings.socialLinks];
    newLinks[index][key] = value;
    setSettings({ ...settings, socialLinks: newLinks });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await apiFetch('/settings', {
        method: 'PATCH',
        body: JSON.stringify(settings)
      });
      showToast('Site settings updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading settings...</div>;

  return (
    <div className={styles.container}>
      {isMediaModalOpen && (
        <MediaPickerModal 
          onSelect={(url) => {
            setSettings({...settings, siteLogo: url});
            setIsMediaModalOpen(false);
          }}
          onClose={() => setIsMediaModalOpen(false)}
        />
      )}

      <header className={styles.header}>
        <h1 className="brand-font">Site Identity</h1>
        <p>Configure the global branding and meta settings for your website.</p>
      </header>

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Globe size={20} />
            <h2>General Branding</h2>
          </div>
          <div className={styles.grid}>
            <Input 
              label="Site Name" 
              value={settings.siteName} 
              onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              placeholder="e.g. My Awesome Agency"
              required
            />
            <div className={styles.logoField}>
              <label className={styles.label}>Company Logo</label>
              <div className={styles.logoRow}>
                <div className={styles.logoPreview}>
                  {settings.siteLogo ? (
                    <img src={settings.siteLogo} alt="Logo" />
                  ) : (
                    <ImageIcon size={24} />
                  )}
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={() => setIsMediaModalOpen(true)}>
                  Change Logo
                </Button>
                {settings.siteLogo && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSettings({...settings, siteLogo: ''})}>
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <div className={styles.fullWidth}>
              <label className={styles.label}>Footer Tagline</label>
              <textarea 
                className={styles.textarea}
                value={settings.footerText || ''}
                onChange={(e) => setSettings({...settings, footerText: e.target.value})}
                placeholder="A high-performance digital experience."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Share2 size={20} />
            <h2>Social Media Links</h2>
          </div>
          <div className={styles.socialList}>
            {settings.socialLinks.map((link: any, index: number) => (
              <div key={index} className={styles.socialItem}>
                <Input 
                  placeholder="Platform (e.g. LinkedIn)"
                  value={link.label}
                  onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                />
                <Input 
                  placeholder="URL (https://...)"
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                />
                <button type="button" className={styles.removeBtn} onClick={() => removeSocialLink(index)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={addSocialLink}>
              <Plus size={16} />
              Add Social Link
            </Button>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="submit" isLoading={isSaving} size="lg">
            <Save size={18} />
            Update Branding
          </Button>
        </div>
      </form>
    </div>
  );
}
