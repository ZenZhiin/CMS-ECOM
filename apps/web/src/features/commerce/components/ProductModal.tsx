'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/atoms/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { Plus, Trash2, Tag, Image as ImageIcon, X } from 'lucide-react';
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

  const [imageUrl, setImageUrl] = useState('');
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

  const addImage = () => {
    if (!imageUrl) return;
    if (formData.images.length >= 6) return;
    setFormData({ ...formData, images: [...formData.images, imageUrl] });
    setImageUrl('');
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

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

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { sku: '', price: formData.basePrice, inventory: 0, attributes: {} }]
    });
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) return;
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
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
          <h3>Product Images</h3>
          <div className={styles.imageSection}>
            <div className={styles.addImage}>
              <Input
                label="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
              <Button
                type="button"
                variant="secondary"
                onClick={addImage}
                disabled={formData.images.length >= 6}
              >
                Add Image
              </Button>
            </div>
            <p className={styles.hint}>Max 6 images. First image is the cover.</p>

            <div className={styles.imageGrid}>
              {formData.images.map((url, idx) => (
                <div key={idx} className={styles.imagePreview}>
                  <img src={url} alt={`Product ${idx}`} />
                  <button type="button" className={styles.removeImage} onClick={() => removeImage(idx)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              {formData.images.length === 0 && (
                <div className={styles.emptyImage}>
                  <ImageIcon size={32} />
                  <span>No images</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Basic Information</h3>
          <div className={styles.row}>
            <Input
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="URL Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
              required
            />
            <div className={styles.field}>
              <label>Product Type</label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={styles.textarea}
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Product Variants</h3>
            <Button type="button" size="sm" variant="secondary" onClick={addVariant}>
              <Plus size={16} /> Add Variant
            </Button>
          </div>
          <div className={styles.variantsList}>
            {formData.variants.map((variant, idx) => (
              <div key={idx} className={styles.variantItem}>
                <Input
                  label="SKU"
                  value={variant.sku}
                  onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                  required
                />
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                  required
                />
                <Input
                  label="Inventory"
                  type="number"
                  value={variant.inventory}
                  onChange={(e) => handleVariantChange(idx, 'inventory', e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => removeVariant(idx)}
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
