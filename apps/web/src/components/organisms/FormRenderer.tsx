'use client';

import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useToast } from '@/context/ToastContext';
import styles from './FormRenderer.module.css';

interface FormField {
  label: string;
  name: string;
  type: string;
  required: boolean;
}

interface FormRendererProps {
  slug: string;
  name: string;
  fields: FormField[];
}

export const FormRenderer: React.FC<FormRendererProps> = ({ slug, name, fields }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/submissions/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Submission failed');

      setIsSuccess(true);
      showToast('Thank you! Your message has been sent.', 'success');
      setFormData({});
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSuccess) {
    return (
      <div className={styles.success}>
        <h3>Submission Received!</h3>
        <p>We'll get back to you shortly. Thank you for reaching out.</p>
        <Button variant="secondary" onClick={() => setIsSuccess(false)}>Send Another Message</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.formTitle}>{name}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {fields.map((field) => (
          <div key={field.name} className={styles.fieldGroup}>
            {field.type === 'textarea' ? (
              <div className={styles.textareaWrapper}>
                <label className={styles.label}>
                  {field.label} {field.required && '*'}
                </label>
                <textarea
                  className={styles.textarea}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={`Enter your ${field.label.toLowerCase()}...`}
                />
              </div>
            ) : (
              <Input
                label={field.label}
                type={field.type}
                required={field.required}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                placeholder={`Enter your ${field.label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}
        <div className={styles.actions}>
          <Button type="submit" isLoading={isSubmitting} size="lg">
            Send Message
          </Button>
        </div>
      </form>
    </div>
  );
};
