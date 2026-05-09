'use client';

import React, { useEffect, useState, use } from 'react';
import { Plus, Search, Filter, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';
import Link from 'next/link';

export default function EntryListPage({ params }: { params: Promise<{ typeId: string }> }) {
  const { typeId } = use(params);
  const [contentType, setContentType] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeId) fetchData();
  }, [typeId]);

  const fetchData = async () => {
    try {
      const [ct, ent] = await Promise.all([
        apiFetch(`/content-types/${typeId}`),
        apiFetch(`/content-entries?contentTypeId=${typeId}`)
      ]);
      setContentType(ct);
      setEntries(ent);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
      await apiFetch(`/content-entries/${id}`, { method: 'DELETE' });
      setEntries(entries.filter(e => e.id !== id));
    } catch (err) {
      alert('Failed to delete entry');
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading entries...</div>;
  if (!contentType) return <div>Content type not found</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <Link href="/dashboard/content" className={styles.backLink}>
            <ArrowLeft size={16} />
            Back
          </Link>
          <h1 className="brand-font">{contentType.name}</h1>
          <p>Manage entries for your {contentType.name.toLowerCase()} model.</p>
        </div>
        <Link href={`/dashboard/content/${typeId}/new`}>
          <Button>
            <Plus size={18} />
            Create New Entry
          </Button>
        </Link>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} />
          <input type="text" placeholder={`Search ${contentType.name.toLowerCase()}...`} />
        </div>
        <Button variant="secondary" size="sm">
          <Filter size={16} />
          Filter
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {contentType.fields.slice(0, 3).map((f: any) => (
                <th key={f.name}>{f.name}</th>
              ))}
              <th>Status</th>
              <th>Created At</th>
              <th className={styles.actionsHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={contentType.fields.length + 3} className={styles.emptyRow}>
                  No entries found. Create your first one!
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id}>
                  {contentType.fields.slice(0, 3).map((f: any) => (
                    <td key={f.name}>{entry.data[f.name]?.toString() || '-'}</td>
                  ))}
                  <td>
                    <span className={`${styles.badge} ${styles[entry.status.toLowerCase()]}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                  <td className={styles.actionsCell}>
                    <Link href={`/dashboard/content/${typeId}/${entry.id}`}>
                      <button className={styles.iconBtn}><Edit size={16} /></button>
                    </Link>
                    <button className={styles.iconBtn} onClick={() => handleDelete(entry.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
