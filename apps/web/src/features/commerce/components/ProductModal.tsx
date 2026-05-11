'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/atoms/Modal';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { Plus, Trash2, Tag, Image as ImageIcon, X, Box, Layers, Calendar, DollarSign } from 'lucide-react';
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
    salePrice: '',
    saleStartDate: '',
    saleEndDate: '',
    isActive: true,
    variants: [{ sku: '', price: '', inventory: 0, attributes: {} }],
    digitalData: { fileUrl: '', expiry: '', videoUrl: '', apiKey: '', secretKey: '' },
    metadata: { weight: '', dimensions: '' },
    images: [] as string[],
    categoryIds: [] as string[],
    bundledItems: [] as any[]
  });

  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchProducts();
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

  const fetchProducts = async () => {
    try {
      const data = await commerceService.getProducts();
      setAllProducts(data.filter((p: any) => p.id !== initialData?.id));
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        basePrice: initialData.basePrice?.toString() || '',
        salePrice: initialData.salePrice?.toString() || '',
        saleStartDate: initialData.saleStartDate ? new Date(initialData.saleStartDate).toISOString().split('T')[0] : '',
        saleEndDate: initialData.saleEndDate ? new Date(initialData.saleEndDate).toISOString().split('T')[0] : '',
        variants: initialData.variants.map((v: any) => ({
          ...v,
          price: v.price.toString()
        })),
        digitalData: initialData.digitalData || { fileUrl: '', expiry: '', videoUrl: '', apiKey: '', secretKey: '' },
        metadata: initialData.metadata || { weight: '', dimensions: '' },
        images: initialData.images || [],
        categoryIds: initialData.categories?.map((c: any) => c.id) || [],
        bundledItems: initialData.bundledItems?.map((i: any) => ({
          productId: i.productId,
          quantity: i.quantity
        })) || []
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        type: 'PHYSICAL',
        basePrice: '',
        salePrice: '',
        saleStartDate: '',
        saleEndDate: '',
        isActive: true,
        variants: [{ sku: '', price: '', inventory: 0, attributes: {} }],
        digitalData: { fileUrl: '', expiry: '', videoUrl: '', apiKey: '', secretKey: '' },
        metadata: { weight: '', dimensions: '' },
        images: [],
        categoryIds: [],
        bundledItems: []
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

  // Bundle Logic
  const addBundleItem = (productId: string) => {
    if (formData.bundledItems.some(i => i.productId === productId)) return;
    setFormData({
      ...formData,
      bundledItems: [...formData.bundledItems, { productId, quantity: 1 }]
    });
  };

  const removeBundleItem = (productId: string) => {
    setFormData({
      ...formData,
      bundledItems: formData.bundledItems.filter(i => i.productId !== productId)
    });
  };

  const updateBundleQuantity = (productId: string, quantity: number) => {
    setFormData({
      ...formData,
      bundledItems: formData.bundledItems.map(i => 
        i.productId === productId ? { ...i, quantity } : i
      )
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
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
      size="xl"
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
                  { label: 'Subscription', value: 'SUBSCRIPTION' },
                  { label: 'Bundle/Package', value: 'BUNDLE' }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Campaign Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Campaign & Sale</h3>
            <span className={styles.campaignBadge}>
              <DollarSign size={14} /> Active Sale Support
            </span>
          </div>
          <div className={styles.row}>
            <Input 
              label="Sale Price ($)" 
              type="number"
              step="0.01"
              value={formData.salePrice}
              onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
              placeholder="Leave empty for no sale"
            />
            <div className={styles.row}>
              <Input 
                label="Start Date" 
                type="date"
                value={formData.saleStartDate}
                onChange={(e) => setFormData({...formData, saleStartDate: e.target.value})}
              />
              <Input 
                label="End Date" 
                type="date"
                value={formData.saleEndDate}
                onChange={(e) => setFormData({...formData, saleEndDate: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.field}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={styles.textarea}
            />
          </div>
        </div>

        {/* Digital Course Specific Fields */}
        {formData.type === 'DIGITAL' && (
          <div className={styles.section}>
            <h3>Digital Delivery Details</h3>
            <div className={styles.row}>
              <Input 
                label="File/Asset URL" 
                value={formData.digitalData.fileUrl}
                onChange={(e) => setFormData({...formData, digitalData: {...formData.digitalData, fileUrl: e.target.value}})}
                placeholder="Secure download link"
              />
              <Input 
                label="Video URL (Optional)" 
                value={formData.digitalData.videoUrl}
                onChange={(e) => setFormData({...formData, digitalData: {...formData.digitalData, videoUrl: e.target.value}})}
                placeholder="Vimeo/YouTube/Custom link"
              />
            </div>
            <div className={styles.row}>
              <Input 
                label="Video API Key" 
                value={formData.digitalData.apiKey}
                onChange={(e) => setFormData({...formData, digitalData: {...formData.digitalData, apiKey: e.target.value}})}
              />
              <Input 
                label="Video Secret Key" 
                type="password"
                value={formData.digitalData.secretKey}
                onChange={(e) => setFormData({...formData, digitalData: {...formData.digitalData, secretKey: e.target.value}})}
              />
            </div>
          </div>
        )}

        {/* Bundle Management */}
        {formData.type === 'BUNDLE' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Package Contents</h3>
              <div className={styles.productPicker}>
                <Select 
                  placeholder="Select product to add..."
                  onChange={(e) => addBundleItem(e.target.value)}
                  options={[
                    { label: 'Select product...', value: '' },
                    ...allProducts.map(p => ({ label: p.name, value: p.id }))
                  ]}
                />
              </div>
            </div>
            <div className={styles.bundleList}>
              {formData.bundledItems.map((item) => {
                const product = allProducts.find(p => p.id === item.productId);
                return (
                  <div key={item.productId} className={styles.bundleItem}>
                    <div className={styles.bundleInfo}>
                      <Box size={16} />
                      <span>{product?.name || 'Unknown Product'}</span>
                    </div>
                    <div className={styles.bundleActions}>
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => updateBundleQuantity(item.productId, parseInt(e.target.value))}
                        min="1"
                        className={styles.qtyInput}
                      />
                      <button type="button" className={styles.removeBundleBtn} onClick={() => removeBundleItem(item.productId)}>
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {formData.bundledItems.length === 0 && (
                <div className={styles.emptyBundle}>
                  <Layers size={32} />
                  <p>Add products to create a package.</p>
                </div>
              )}
            </div>
          </div>
        )}

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
