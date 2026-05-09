'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';
import Link from 'next/link';

export default function NewEntryPage({ params }: { params: Promise<{ typeId: string }> }) {
  const { typeId } = use(params);
  const router = useRouter();
  const [contentType, setContentType] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeId) fetchContentType();
  }, [typeId]);

  const fetchContentType = async () => {
    try {
      const data = await apiFetch(`/content-types/${typeId}`);
      setContentType(data);
      const initialData: Record<string, any> = {};
      data.fields.forEach((f: any) => {
        initialData[f.name] = f.type === 'number' ? 0 : f.type === 'boolean' ? false : '';
      });
      setFormData(initialData);
    } catch (err) {
      console.error('Failed to fetch content type', err);
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
      await apiFetch('/content-entries', {
        method: 'POST',
        body: JSON.stringify({ contentTypeId: typeId, data: formData }),
      });
      router.push(`/dashboard/content/${typeId}`);
    } catch (err: any) {
      alert(err.message || 'Failed to save entry');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading form...</div>;
  if (!contentType) return <div>Content type not found</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href={`/dashboard/content/${typeId}`} className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to List
        </Link>
        <h1 className="brand-font">New {contentType.name}</h1>
        <p>Fill in the details to create a new {contentType.name.toLowerCase()} entry.</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formCard}>
          <div className={styles.fieldGrid}>
            {contentType.fields.map((field: any) => (
              <div key={field.name} className={styles.fieldItem}>
                <label className={styles.label}>
                  {field.name}
                  {field.required && <span className={styles.required}>*</span>}
                </label>
                {field.type === 'text' && (
                  <input type="text" className={styles.input} value={formData[field.name] || ''} onChange={(e) => handleChange(field.name, e.target.value)} required={field.required} />
                )}
                {field.type === 'number' && (
                  <input type="number" className={styles.input} value={formData[field.name] || 0} onChange={(e) => handleChange(field.name, Number(e.target.value))} required={field.required} />
                )}
                {field.type === 'boolean' && (
                  <div className={styles.checkboxWrapper}>
                    <input type="checkbox" checked={formData[field.name] || false} onChange={(e) => handleChange(field.name, e.target.checked)} />
                    <span>Active / Enabled</span>
                  </div>
                )}
                {field.type === 'date' && (
                  <input type="date" className={styles.input} value={formData[field.name] || ''} onChange={(e) => handleChange(field.name, e.target.value)} required={field.required} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.actions}>
          <Button type="submit" size="lg" isLoading={isSaving}>
            <Save size={18} />
            Publish Entry
          </Button>
        </div>
      </form>
    </div>
  );
}
