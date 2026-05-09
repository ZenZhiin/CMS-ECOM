'use client';

import React, { useEffect, useState } from 'react';
import { Database, ChevronRight, FileText } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';
import Link from 'next/link';

export default function ContentSelectionPage() {
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

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="brand-font">Content Manager</h1>
        <p>Select a content type to manage its entries.</p>
      </header>

      {isLoading ? (
        <div className={styles.loading}>Loading models...</div>
      ) : contentTypes.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No Content Models Defined</h3>
          <p>Go to the Content Builder to define your first model.</p>
          <Link href="/dashboard/content-types">
            <button className={styles.linkBtn}>Go to Content Builder</button>
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {contentTypes.map((ct) => (
            <Link key={ct.id} href={`/dashboard/content/${ct.id}`} className={styles.card}>
              <div className={styles.iconWrap}><FileText size={24} /></div>
              <div className={styles.info}>
                <h3>{ct.name}</h3>
                <p>Manage /{ct.slug} entries</p>
              </div>
              <ChevronRight size={20} className={styles.arrow} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
