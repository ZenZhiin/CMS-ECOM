'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/atoms/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Plus, Trash2, Package } from 'lucide-react';
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
    basePrice: '',
    isActive: true,
    variants: [{ sku: '', price: '', inventory: 0, attributes: {} }]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        basePrice: initialData.basePrice.toString(),
        variants: initialData.variants.map((v: any) => ({
          ...v,
          price: v.price.toString()
        }))
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        basePrice: '',
        isActive: true,
        variants: [{ sku: '', price: '', inventory: 0, attributes: {} }]
      });
    }
  }, [initialData, isOpen]);

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { sku: '', price: prev.basePrice, inventory: 0, attributes: {} }]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
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
        <div className={styles.section}>
          <h3>Basic Information</h3>
          <div className={styles.row}>
            <Input 
              label="Product Name" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Premium T-Shirt"
              required
            />
            <Input 
              label="URL Slug" 
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              placeholder="premium-t-shirt"
              required
            />
          </div>
          <Input 
            label="Base Price ($)" 
            type="number"
            step="0.01"
            value={formData.basePrice}
            onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
            placeholder="0.00"
            required
          />
          <div className={styles.field}>
            <label>Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className={styles.textarea}
              placeholder="Tell customers about your product..."
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Variants</h3>
            <Button type="button" size="sm" variant="secondary" onClick={addVariant}>
              <Plus size={16} /> Add Variant
            </Button>
          </div>
          
          <div className={styles.variantsList}>
            {formData.variants.map((variant, index) => (
              <div key={index} className={styles.variantItem}>
                <Input 
                  label="SKU" 
                  value={variant.sku}
                  onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                  placeholder="SKU-123"
                  required
                />
                <Input 
                  label="Price ($)" 
                  type="number"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                  placeholder="0.00"
                  required
                />
                <Input 
                  label="Inventory" 
                  type="number"
                  value={variant.inventory}
                  onChange={(e) => handleVariantChange(index, 'inventory', e.target.value)}
                  placeholder="0"
                  required
                />
                <button 
                  type="button" 
                  className={styles.deleteBtn}
                  onClick={() => removeVariant(index)}
                  disabled={formData.variants.length === 1}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

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
