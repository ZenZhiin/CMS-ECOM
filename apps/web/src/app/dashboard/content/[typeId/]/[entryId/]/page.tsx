'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Globe, Eye } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { apiFetch } from '@/lib/api';
import styles from '../new/page.module.css'; // Reuse new entry styles
import Link from 'next/link';

export default function EditEntryPage({ params }: { params: Promise<{ typeId: string, entryId: string }> }) {
  const { typeId, entryId } = use(params);
  const router = useRouter();
  const [contentType, setContentType] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [status, setStatus] = useState('DRAFT');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeId && entryId) {
      fetchData();
    }
  }, [typeId, entryId]);

  const fetchData = async () => {
    try {
      const [ct, ent] = await Promise.all([
        apiFetch(`/content-types/${typeId}`),
        apiFetch(`/content-entries/${entryId}`)
      ]);
      setContentType(ct);
      setFormData(ent.data);
      setStatus(ent.status);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await apiFetch(`/content-entries/${entryId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          data: formData,
          status: status
        }),
      });
      router.push(`/dashboard/content/${typeId}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update entry');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading entry...</div>;
  if (!contentType) return <div>Content type not found</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href={`/dashboard/content/${typeId}`} className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to List
        </Link>
        <div className={styles.headerTitleRow}>
          <h1 className="brand-font">Edit {contentType.name}</h1>
          <div className={styles.headerActions}>
             <span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}>{status}</span>
          </div>
        </div>
        <p>Modify the fields and update the publication status.</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.mainGrid}>
          <div className={styles.formCard}>
            <div className={styles.fieldGrid}>
              {contentType.fields.map((field: any) => (
                <div key={field.name} className={styles.fieldItem}>
                  <label className={styles.label}>
                    {field.name}
                    {field.required && <span className={styles.required}>*</span>}
                  </label>
                  
                  {field.type === 'text' && (
                    <input 
                      type="text" 
                      className={styles.input}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === 'number' && (
                    <input 
                      type="number" 
                      className={styles.input}
                      value={formData[field.name] || 0}
                      onChange={(e) => handleChange(field.name, Number(e.target.value))}
                      required={field.required}
                    />
                  )}

                  {field.type === 'boolean' && (
                    <div className={styles.checkboxWrapper}>
                      <input 
                        type="checkbox" 
                        checked={formData[field.name] || false}
                        onChange={(e) => handleChange(field.name, e.target.checked)}
                      />
                      <span>Active / Enabled</span>
                    </div>
                  )}

                  {field.type === 'date' && (
                    <input 
                      type="date" 
                      className={styles.input}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.sideCard}>
              <h3>Publication</h3>
              <div className={styles.sideContent}>
                <div className={styles.statusSelect}>
                  <label>Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <Button type="submit" fullWidth isLoading={isSaving}>
                  <Save size={18} />
                  Update Entry
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
