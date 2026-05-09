'use client';

import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, GripVertical, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';

export default function NavigationBuilderPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await apiFetch('/settings');
      setLinks(Array.isArray(data.navigation) ? data.navigation : []);
    } catch (err) {
      console.error('Failed to fetch navigation', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addLink = () => {
    setLinks([...links, { label: '', url: '' }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, key: string, value: string) => {
    const newLinks = [...links];
    newLinks[index][key] = value;
    setLinks(newLinks);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiFetch('/settings', {
        method: 'PATCH',
        body: JSON.stringify({ navigation: links })
      });
      alert('Navigation menu updated');
    } catch (err) {
      alert('Failed to update navigation');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className="brand-font">Navigation Builder</h1>
          <p>Design your website's main navigation menu structure.</p>
        </div>
        <Button onClick={addLink} variant="secondary">
          <Plus size={18} />
          Add Menu Item
        </Button>
      </header>

      <div className={styles.content}>
        <div className={styles.menuList}>
          {links.length === 0 ? (
            <div className={styles.empty}>
              <LinkIcon size={48} />
              <p>Your navigation menu is empty. Add your first link to get started.</p>
            </div>
          ) : (
            links.map((link, index) => (
              <div key={index} className={styles.menuItem}>
                <div className={styles.grip}><GripVertical size={20} /></div>
                <div className={styles.inputs}>
                  <input 
                    type="text" 
                    placeholder="Label (e.g. Home)" 
                    value={link.label}
                    onChange={(e) => updateLink(index, 'label', e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="URL (e.g. /home)" 
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                  />
                </div>
                <button className={styles.removeBtn} onClick={() => removeLink(index)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <Button onClick={handleSave} isLoading={isSaving} disabled={links.length === 0}>
            <Save size={18} />
            Save Navigation Structure
          </Button>
        </div>
      </div>
    </div>
  );
}
