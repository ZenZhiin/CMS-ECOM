'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { apiFetch } from '@/lib/api';
import styles from '../new/page.module.css';
import Link from 'next/link';

export default function EditContentTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [fields, setFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) fetchContentType();
  }, [id]);

  const fetchContentType = async () => {
    try {
      const data = await apiFetch(`/content-types/${id}`);
      setName(data.name);
      setSlug(data.slug);
      setFields(data.fields || []);
    } catch (err) {
      console.error('Failed to fetch content type', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addField = () => {
    setFields([...fields, { name: '', type: 'text', required: false }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: string, value: any) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await apiFetch(`/content-types/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, slug, fields }),
      });
      router.push('/dashboard/content-types');
    } catch (err: any) {
      alert(err.message || 'Failed to update content type');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading model definition...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard/content-types" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Models
        </Link>
        <div className={styles.headerTitle}>
          <h1 className="brand-font">Edit Content Model: {name}</h1>
          <p>Update the structure and fields for your data type.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.settingsCard}>
          <h2>Basic Settings</h2>
          <div className={styles.settingsGrid}>
            <Input 
              label="Model Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input 
              label="Model Slug" 
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              disabled // Slug usually shouldn't change for existing models to avoid breaking URLs
            />
          </div>
        </div>

        <div className={styles.fieldsCard}>
          <div className={styles.fieldsHeader}>
            <h2>Fields Configuration</h2>
            <Button type="button" variant="ghost" size="sm" onClick={addField}>
              <Plus size={16} />
              Add Field
            </Button>
          </div>

          <div className={styles.fieldList}>
            {fields.map((field, index) => (
              <div key={index} className={styles.fieldItem}>
                <div className={styles.fieldInputs}>
                  <Input 
                    label="Field Name"
                    value={field.name}
                    placeholder="e.g. description"
                    onChange={(e) => updateField(index, 'name', e.target.value)}
                    required
                  />
                  <Select 
                    label="Type"
                    options={[
                      { label: 'Text', value: 'text' },
                      { label: 'Rich Text', value: 'rich-text' },
                      { label: 'Number', value: 'number' },
                      { label: 'Boolean', value: 'boolean' },
                      { label: 'Date', value: 'date' },
                      { label: 'Media Picker', value: 'media' }
                    ]}
                    value={field.type}
                    onChange={(e) => updateField(index, 'type', e.target.value)}
                  />
                  <div className={styles.checkboxWrap}>
                    <input 
                      type="checkbox" 
                      checked={field.required}
                      onChange={(e) => updateField(index, 'required', e.target.checked)}
                    />
                    <span>Required</span>
                  </div>
                </div>
                <button type="button" className={styles.removeBtn} onClick={() => removeField(index)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.formActions}>
          <Button type="submit" size="lg" isLoading={isSaving}>
            <Save size={18} />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
