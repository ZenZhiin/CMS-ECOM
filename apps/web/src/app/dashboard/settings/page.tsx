'use client';

import React, { useEffect, useState } from 'react';

import { Save, Globe, Image as ImageIcon, Plus, Trash2, Share2, Upload, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { MediaPickerModal } from '@/components/organisms/MediaPickerModal';
import { Switch } from '@/components/atoms/Switch';
import { useSettings } from '@/context/SettingsContext';
import styles from './page.module.css';

export default function GeneralSettingsPage() {
  const { showToast } = useToast();
  const { settings: globalSettings, updateToggle } = useSettings();
  const [settings, setSettings] = useState<any>({
    siteName: '',
    siteLogo: '',
    footerText: '',
    socialLinks: [],
    isEcommerceEnabled: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeSocialIndex, setActiveSocialIndex] = useState<number | null>(null);

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

  const handleToggleEcommerce = async (checked: boolean) => {
    try {
      await updateToggle('isEcommerceEnabled', checked);
      setSettings({ ...settings, isEcommerceEnabled: checked });
      showToast(`E-commerce module ${checked ? 'enabled' : 'disabled'}`, 'success');
    } catch (err) {
      showToast('Failed to update feature state', 'error');
    }
  };

  const addSocialLink = () => {
    setSettings({
      ...settings,
      socialLinks: [...settings.socialLinks, { label: '', url: '', platform: 'custom', iconUrl: '' }]
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
            if (activeSocialIndex !== null) {
              updateSocialLink(activeSocialIndex, 'iconUrl', url);
              setActiveSocialIndex(null);
            } else {
              setSettings({...settings, siteLogo: url});
            }
            setIsMediaModalOpen(false);
          }}
          onClose={() => {
            setIsMediaModalOpen(false);
            setActiveSocialIndex(null);
          }}
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
                <Button type="button" variant="secondary" size="sm" onClick={() => {
                  setActiveSocialIndex(null);
                  setIsMediaModalOpen(true);
                }}>
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
            <Plus size={20} />
            <h2>Company Details</h2>
          </div>
          <div className={styles.grid}>
            <Input 
              label="Company Name" 
              value={settings.companyName || ''} 
              onChange={(e) => setSettings({...settings, companyName: e.target.value})}
              placeholder="e.g. Zhiin Digital Studio"
            />
            <Input 
              label="Contact Email" 
              value={settings.companyEmail || ''} 
              onChange={(e) => setSettings({...settings, companyEmail: e.target.value})}
              placeholder="hello@example.com"
            />
            <Input 
              label="Phone Number" 
              value={settings.companyPhone || ''} 
              onChange={(e) => setSettings({...settings, companyPhone: e.target.value})}
              placeholder="+1 (555) 000-0000"
            />
            <div className={styles.fullWidth}>
              <Input 
                label="Office Address" 
                value={settings.companyAddress || ''} 
                onChange={(e) => setSettings({...settings, companyAddress: e.target.value})}
                placeholder="123 Innovation Drive, Tech City, TC 10101"
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <ShoppingBag size={20} />
            <h2>Feature Modules</h2>
          </div>
          <div className={styles.modulesGrid}>
            <Switch 
              label="E-commerce Engine"
              description="Enable product catalog, inventory management, and checkout functionality."
              checked={settings.isEcommerceEnabled}
              onChange={handleToggleEcommerce}
            />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Share2 size={20} />
            <h2>Social Media Presence</h2>
          </div>
          <div className={styles.socialList}>
            <div className={styles.socialHeader}>
              <span>Platform</span>
              <span>Label</span>
              <span>URL</span>
              <span>Custom Icon</span>
              <span></span>
            </div>
            {settings.socialLinks.map((link: any, index: number) => (
              <div key={index} className={styles.socialGridItem}>
                <Select 
                  value={link.platform || 'custom'}
                  onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                  options={[
                    { label: 'Custom', value: 'custom' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Twitter/X', value: 'twitter' },
                    { label: 'YouTube', value: 'youtube' }
                  ]}
                />
                <Input 
                  placeholder="e.g. Facebook"
                  value={link.label}
                  onChange={(e) => updateSocialLink(index, 'label', e.target.value)}
                />
                <Input 
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                />
                <div className={styles.customIconWrap}>
                  <div className={styles.miniPreview}>
                    {link.iconUrl ? <img src={link.iconUrl} alt="Icon" /> : <div className={styles.placeholder} />}
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setActiveSocialIndex(index);
                      setIsMediaModalOpen(true);
                    }}
                  >
                    <Upload size={14} />
                  </Button>
                  {link.iconUrl && (
                    <button 
                      type="button" 
                      className={styles.clearBtn} 
                      onClick={() => updateSocialLink(index, 'iconUrl', '')}
                    >
                      ×
                    </button>
                  )}
                </div>
                <button type="button" className={styles.removeBtn} onClick={() => removeSocialLink(index)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <div className={styles.socialActions}>
              <Button type="button" variant="ghost" size="sm" onClick={addSocialLink}>
                <Plus size={16} />
                Add Social Channel
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="submit" isLoading={isSaving} size="lg">
            <Save size={18} />
            Update Site Identity
          </Button>
        </div>
      </form>
    </div>
  );
}
