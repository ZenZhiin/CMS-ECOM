'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/atoms/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { Plus, Trash2, Package, Globe, FileText, Repeat, Tag } from 'lucide-react';
import { commerceService } from '@/features/commerce/services/commerce.service';
import styles from './ProductModal.module.css';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    type: 'PHYSICAL',
    basePrice: '',
    isActive: true,
    variants: [{ sku: '', price: '', inventory: 0, attributes: {} }],
    digitalData: { fileUrl: '', expiry: '' },
    metadata: { weight: '', dimensions: '' },
    images: [] as string[],
    categoryIds: [] as string[]
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const data = await commerceService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        basePrice: initialData.basePrice.toString(),
        variants: initialData.variants.map((v: any) => ({
          ...v,
          price: v.price.toString()
        })),
        digitalData: initialData.digitalData || { fileUrl: '', expiry: '' },
        metadata: initialData.metadata || { weight: '', dimensions: '' },
        images: initialData.images || [],
        categoryIds: initialData.categories?.map((c: any) => c.id) || []
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        type: 'PHYSICAL',
        basePrice: '',
        isActive: true,
        variants: [{ sku: '', price: '', inventory: 0, attributes: {} }],
        digitalData: { fileUrl: '', expiry: '' },
        metadata: { weight: '', dimensions: '' },
        images: [],
        categoryIds: []
      });
    }
  }, [initialData, isOpen]);

  const toggleCategory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter(cid => cid !== id)
        : [...prev.categoryIds, id]
    }));
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        variants: formData.variants.map(v => ({
          ...v,
          price: parseFloat(v.price as string),
          inventory: parseInt(v.inventory as any)
        }))
      });
      onClose();
    } catch (err) {
      console.error('Failed to save product', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Product' : 'Add New Product'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Images section omitted for brevity but should be here */}
        
        <div className={styles.section}>
          <h3>Basic Information</h3>
          <div className={styles.row}>
            <Input 
              label="Product Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input 
              label="URL Slug" 
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              required
            />
          </div>
          
          <div className={styles.field}>
            <label>Categories</label>
            <div className={styles.categoryGrid}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.categoryChip} ${formData.categoryIds.includes(cat.id) ? styles.activeChip : ''}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <Tag size={12} /> {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.row}>
            <Input 
              label="Base Price ($)" 
              type="number"
              step="0.01"
              value={formData.basePrice}
              onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
              required
            />
            <div className={styles.field}>
              <label>Product Type</label>
              <Select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                options={[
                  { label: 'Physical', value: 'PHYSICAL' },
                  { label: 'Digital', value: 'DIGITAL' },
                  { label: 'Subscription', value: 'SUBSCRIPTION' }
                ]}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Variants section would follow... */}

        <div className={styles.footer}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
