'use client';

import React, { useEffect, useState } from 'react';
import { Key, Plus, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const data = await apiFetch('/settings/keys');
      setKeys(data);
    } catch (err) {
      console.error('Failed to fetch keys', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    setIsCreating(true);
    try {
      const newKey = await apiFetch('/settings/keys', {
        method: 'POST',
        body: JSON.stringify({ name: newKeyName })
      });
      setKeys([newKey, ...keys]);
      setNewKeyName('');
    } catch (err) {
      alert('Failed to create key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Revoke this API Key? External applications using this key will lose access.')) return;
    try {
      await apiFetch(`/settings/keys/${id}`, { method: 'DELETE' });
      setKeys(keys.filter(k => k.id !== id));
    } catch (err) {
      alert('Failed to delete key');
    }
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="brand-font">API Delivery Keys</h1>
        <p>Manage access keys for headless content delivery to your external applications.</p>
      </header>

      <div className={styles.card}>
        <h2>Generate New Key</h2>
        <form onSubmit={handleCreate} className={styles.createForm}>
          <Input 
            placeholder="Key Name (e.g. Mobile App Production)" 
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <Button type="submit" isLoading={isCreating}>
            <Plus size={18} />
            Generate Key
          </Button>
        </form>
      </div>

      <div className={styles.keyList}>
        <h3>Active Keys</h3>
        {isLoading ? (
          <p>Loading keys...</p>
        ) : keys.length === 0 ? (
          <p className={styles.empty}>No active API keys found.</p>
        ) : (
          <div className={styles.grid}>
            {keys.map((k) => (
              <div key={k.id} className={styles.keyCard}>
                <div className={styles.keyHeader}>
                  <div className={styles.keyIcon}><Key size={20} /></div>
                  <div className={styles.keyName}>{k.name}</div>
                </div>
                <div className={styles.keyDisplay}>
                  <code>{k.key}</code>
                  <button onClick={() => copyToClipboard(k.key, k.id)} className={styles.copyBtn}>
                    {copiedId === k.id ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className={styles.keyFooter}>
                  <span>Created {new Date(k.createdAt).toLocaleDateString()}</span>
                  <button onClick={() => handleDelete(k.id)} className={styles.deleteBtn}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
