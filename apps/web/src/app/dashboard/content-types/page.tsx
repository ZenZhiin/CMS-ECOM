'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Database, ChevronRight, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';
import Link from 'next/link';

export default function ContentTypesPage() {
  const [contentTypes, setContentTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContentTypes();
  }, []);

  const fetchContentTypes = async () => {
    try {
      const data = await apiFetch('/content-types');
      setContentTypes(data);
    } catch (err) {
      console.error('Failed to fetch content types', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content type? All entries will be lost.')) return;
    try {
      await apiFetch(`/content-types/${id}`, { method: 'DELETE' });
      setContentTypes(contentTypes.filter(ct => ct.id !== id));
    } catch (err) {
      alert('Failed to delete content type');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className="brand-font">Content Builder</h1>
          <p>Define the structure of your content models.</p>
        </div>
        <Link href="/dashboard/content-types/new">
          <Button>
            <Plus size={18} />
            Create Content Type
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Loading content models...</div>
      ) : contentTypes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><Database size={48} /></div>
          <h3>No Content Types Yet</h3>
          <p>Start by creating your first content model to begin managing data.</p>
          <Link href="/dashboard/content-types/new">
            <Button variant="secondary">Create My First Model</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {contentTypes.map((ct) => (
            <div key={ct.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconWrap}><Database size={20} /></div>
                <div className={styles.ctInfo}>
                  <h3>{ct.name}</h3>
                  <span>/{ct.slug}</span>
                </div>
              </div>
              <div className={styles.cardBody}>
                <p>{ct.fields.length} fields defined</p>
                <div className={styles.tagList}>
                  {ct.fields.slice(0, 3).map((f: any) => (
                    <span key={f.name} className={styles.tag}>{f.name}</span>
                  ))}
                  {ct.fields.length > 3 && <span className={styles.tag}>+{ct.fields.length - 3} more</span>}
                </div>
              </div>
              <div className={styles.cardActions}>
                <button className={styles.actionBtn} onClick={() => handleDelete(ct.id)}><Trash2 size={16} /></button>
                <Link href={`/dashboard/content-types/${ct.id}`} className={styles.editBtn}>
                  Edit Schema
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
