'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';
import Link from 'next/link';

export default function NewContentTypePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [fields, setFields] = useState<any[]>([
    { name: 'title', type: 'text', required: true }
  ]);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    try {
      await apiFetch('/content-types', {
        method: 'POST',
        body: JSON.stringify({ name, slug, fields }),
      });
      router.push('/dashboard/content-types');
    } catch (err: any) {
      alert(err.message || 'Failed to create content type');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/dashboard/content-types" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Models
        </Link>
        <div className={styles.headerTitle}>
          <h1 className="brand-font">Create New Content Model</h1>
          <p>Define the structure and fields for your new data type.</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.settingsCard}>
          <h2>Basic Settings</h2>
          <div className={styles.settingsGrid}>
            <Input 
              label="Model Name" 
              placeholder="e.g. Blog Post" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input 
              label="Model Slug" 
              placeholder="e.g. blog-post" 
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
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
          <Button type="submit" size="lg" isLoading={isLoading}>
            <Save size={18} />
            Save Content Model
          </Button>
        </div>
      </form>
    </div>
  );
}
