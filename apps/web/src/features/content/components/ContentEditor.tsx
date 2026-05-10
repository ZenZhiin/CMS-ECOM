'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { apiFetch } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { MediaPickerModal } from '@/components/organisms/MediaPickerModal';
import Link from 'next/link';
import styles from './ContentEditor.module.css';

interface ContentEditorProps {
  typeId: string;
  entryId?: string;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ typeId, entryId }) => {
  const router = useRouter();
  const [contentType, setContentType] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [status, setStatus] = useState('DRAFT');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeId) fetchDataType();
  }, [typeId, entryId]);

  const fetchDataType = async () => {
    try {
      const ct = await apiFetch(`/content-types/${typeId}`);
      setContentType(ct);
      
      if (entryId) {
        const ent = await apiFetch(`/content-entries/${entryId}`);
        setFormData(ent.data);
        setStatus(ent.status);
      } else {
        const initialData: Record<string, any> = {};
        ct.fields.forEach((f: any) => {
          initialData[f.name] = f.type === 'number' ? 0 : f.type === 'boolean' ? false : '';
        });
        setFormData(initialData);
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = entryId ? `/content-entries/${entryId}` : '/content-entries';
      const method = entryId ? 'PATCH' : 'POST';
      const body = entryId 
        ? JSON.stringify({ data: formData, status })
        : JSON.stringify({ contentTypeId: typeId, data: formData });

      await apiFetch(url, { method, body });
      showToast(entryId ? 'Entry updated successfully' : 'Entry published successfully', 'success');
      router.push(`/dashboard/content/${typeId}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save entry', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const [activeMediaField, setActiveMediaField] = useState<string | null>(null);

  const handleMediaSelect = (url: string) => {
    if (activeMediaField) {
      handleChange(activeMediaField, url);
      setActiveMediaField(null);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading editor...</div>;
  if (!contentType) return <div>Content type not found</div>;

  return (
    <div className={styles.container}>
      {activeMediaField && (
        <MediaPickerModal 
          onSelect={handleMediaSelect} 
          onClose={() => setActiveMediaField(null)} 
        />
      )}
      <header className={styles.header}>
        <Link href={`/dashboard/content/${typeId}`} className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to List
        </Link>
        <div className={styles.headerTitleRow}>
          <h1 className="brand-font">{entryId ? 'Edit' : 'New'} {contentType.name}</h1>
          {entryId && (
            <span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}>{status}</span>
          )}
        </div>
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

                  {field.type === 'rich-text' && (
                    <textarea 
                      className={styles.textarea}
                      rows={8}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === 'media' && (
                    <div className={styles.mediaPicker}>
                      {formData[field.name] ? (
                        <div className={styles.mediaPreview}>
                          <img src={formData[field.name]} alt="Preview" />
                          <button type="button" onClick={() => handleChange(field.name, '')} className={styles.removeMediaBtn}>Remove</button>
                        </div>
                      ) : (
                        <Button type="button" variant="secondary" onClick={() => setActiveMediaField(field.name)}>
                          Select Media
                        </Button>
                      )}
                    </div>
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
                <Select 
                  label="Status"
                  options={[
                    { label: 'Draft', value: 'DRAFT' },
                    { label: 'Published', value: 'PUBLISHED' },
                    { label: 'Archived', value: 'ARCHIVED' }
                  ]}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <Button type="submit" fullWidth isLoading={isSaving}>
                  <Save size={18} />
                  {entryId ? 'Update Entry' : 'Publish Entry'}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
};
