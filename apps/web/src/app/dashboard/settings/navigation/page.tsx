'use client';

import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, GripVertical, Link as LinkIcon, Layout, Columns, ChevronRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

export default function NavigationBuilderPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'header' | 'footer'>('header');
  const [headerLinks, setHeaderLinks] = useState<any[]>([]);
  const [footerLinks, setFooterLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await apiFetch('/settings');
      setHeaderLinks(Array.isArray(data.navigation) ? data.navigation : []);
      setFooterLinks(Array.isArray(data.footerNavigation) ? data.footerNavigation : []);
    } catch (err) {
      console.error('Failed to fetch navigation', err);
    } finally {
      setIsLoading(false);
    }
  };

  const links = activeTab === 'header' ? headerLinks : footerLinks;
  const setLinks = activeTab === 'header' ? setHeaderLinks : setFooterLinks;

  const addLink = () => {
    setLinks([...links, { label: '', url: '', children: [] }]);
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, key: string, value: any) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [key]: value };
    setLinks(newLinks);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await apiFetch('/settings', {
        method: 'PATCH',
        body: JSON.stringify({ 
          [activeTab === 'header' ? 'navigation' : 'footerNavigation']: links 
        })
      });
      showToast(`${activeTab === 'header' ? 'Header' : 'Footer'} menu updated`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update navigation', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const renderRecursiveItems = (items: any[], setParentItems: (items: any[]) => void, level = 0) => {
    return items.map((item, index) => (
      <div key={index} className={styles.itemWrapper}>
        <div className={styles.menuItem} style={{ marginLeft: level * 24 }}>
          <div className={styles.grip}><GripVertical size={18} /></div>
          <div className={styles.inputs}>
            <input 
              type="text" 
              placeholder="Label" 
              value={item.label}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].label = e.target.value;
                setParentItems(newItems);
              }}
            />
            <input 
              type="text" 
              placeholder="URL" 
              value={item.url}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].url = e.target.value;
                setParentItems(newItems);
              }}
            />
          </div>
          <div className={styles.itemActions}>
            {level < 2 && (
              <button 
                className={styles.addBtn} 
                title="Add Sub-menu"
                onClick={() => {
                  const newItems = [...items];
                  newItems[index].children = [...(newItems[index].children || []), { label: '', url: '', children: [] }];
                  setParentItems(newItems);
                }}
              >
                <Plus size={16} />
              </button>
            )}
            <button 
              className={styles.removeBtn} 
              onClick={() => {
                const newItems = items.filter((_, i) => i !== index);
                setParentItems(newItems);
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        {item.children && item.children.length > 0 && (
          <div className={styles.childrenList}>
            {renderRecursiveItems(item.children, (newChildren) => {
              const newItems = [...items];
              newItems[index].children = newChildren;
              setParentItems(newItems);
            }, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (isLoading) return <div className={styles.loading}>Loading menus...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className="brand-font">Navigation Builder</h1>
          <p>Design multi-level navigation structures (up to 3 layers).</p>
        </div>
        <Button onClick={addLink} variant="secondary">
          <Plus size={18} />
          Add Main Item
        </Button>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'header' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('header')}
        >
          <Layout size={18} />
          Header Menu
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'footer' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('footer')}
        >
          <Columns size={18} />
          Footer Menu
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.menuList}>
          {links.length === 0 ? (
            <div className={styles.empty}>
              <LinkIcon size={48} />
              <p>Your {activeTab} menu is empty. Add your first link to get started.</p>
            </div>
          ) : (
            renderRecursiveItems(links, setLinks)
          )}
        </div>

        <div className={styles.footer}>
          <Button onClick={handleSave} isLoading={isSaving}>
            <Save size={18} />
            Save {activeTab === 'header' ? 'Header' : 'Footer'} Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
