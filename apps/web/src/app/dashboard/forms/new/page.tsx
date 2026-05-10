'use client';

import React, { useState } from 'react';
import { Save, Plus, Trash2, GripVertical, Settings2, Code, FormInput } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

export default function NewFormPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [fields, setFields] = useState<any[]>([
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'Email', name: 'email', type: 'email', required: true },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const addField = () => {
    setFields([...fields, { label: 'New Field', name: 'new_field', type: 'text', required: false }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: string, value: any) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    
    // Auto-generate name from label
    if (key === 'label') {
      newFields[index].name = value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    }
    
    setFields(newFields);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSlug) {
      showToast('Please provide a form name and slug', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await apiFetch('/forms', {
        method: 'POST',
        body: JSON.stringify({
          name: formName,
          slug: formSlug,
          fields
        })
      });
      showToast('Form created successfully', 'success');
      router.push('/dashboard/forms');
    } catch (err: any) {
      showToast(err.message || 'Failed to create form', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className="brand-font">New Lead Form</h1>
          <p>Design a custom form to capture leads from your website.</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            <Save size={18} />
            Publish Form
          </Button>
        </div>
      </header>

      <form onSubmit={handleSave} className={styles.builderLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <h3>General Settings</h3>
            <div className={styles.sidebarGrid}>
              <Input 
                label="Form Name" 
                value={formName} 
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (!formSlug) setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }}
                placeholder="e.g. Contact Us"
                required
              />
              <Input 
                label="Form Slug" 
                value={formSlug} 
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="contact-us"
                required
              />
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.titleGroup}>
                <FormInput size={20} />
                <h2>Form Fields</h2>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={addField}>
                <Plus size={16} />
                Add Field
              </Button>
            </div>

            <div className={styles.fieldList}>
              {fields.map((field, index) => (
                <div key={index} className={styles.fieldItem}>
                  <div className={styles.fieldRow}>
                    <div className={styles.grip}><GripVertical size={18} /></div>
                    <div className={styles.fieldInputs}>
                      <Input 
                        placeholder="Label" 
                        value={field.label} 
                        onChange={(e) => updateField(index, 'label', e.target.value)}
                      />
                      <select 
                        className={styles.select}
                        value={field.type}
                        onChange={(e) => updateField(index, 'type', e.target.value)}
                      >
                        <option value="text">Short Text</option>
                        <option value="email">Email Address</option>
                        <option value="textarea">Long Text</option>
                        <option value="number">Number</option>
                      </select>
                      <label className={styles.checkbox}>
                        <input 
                          type="checkbox" 
                          checked={field.required}
                          onChange={(e) => updateField(index, 'required', e.target.checked)}
                        />
                        Required
                      </label>
                    </div>
                    <button type="button" className={styles.removeBtn} onClick={() => removeField(index)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </form>
    </div>
  );
}
