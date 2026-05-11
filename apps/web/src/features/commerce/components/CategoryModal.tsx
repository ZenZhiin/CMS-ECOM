'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/atoms/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import styles from './CategoryModal.module.css';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        slug: initialData.slug
      });
    } else {
      setFormData({ name: '', slug: '' });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error('Failed to save category', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Category' : 'Add New Category'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input 
          label="Category Name" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="e.g. Electronics"
          required
        />
        <Input 
          label="URL Slug" 
          value={formData.slug}
          onChange={(e) => setFormData({...formData, slug: e.target.value})}
          placeholder="electronics"
          required
        />
        <div className={styles.footer}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
