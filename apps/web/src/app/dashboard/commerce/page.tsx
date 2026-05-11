'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Plus, Search, Filter, Package, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { commerceService } from '@/features/commerce/services/commerce.service';
import { ProductModal } from '@/features/commerce/components/ProductModal';
import styles from './page.module.css';

export default function CommerceDashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await commerceService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProduct = async (data: any) => {
    if (editingProduct) {
      await commerceService.updateProduct(editingProduct.id, data);
    } else {
      await commerceService.createProduct(data);
    }
    await fetchProducts();
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await commerceService.deleteProduct(id);
        await fetchProducts();
      } catch (err) {
        console.error('Failed to delete product', err);
      }
    }
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="brand-font">Product Catalog</h1>
          <p>Manage your store's products, inventory, and pricing.</p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}>
          <Plus size={18} />
          Add New Product
        </Button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <Button variant="secondary" size="sm">
          <Filter size={16} />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading catalog...</div>
      ) : filteredProducts.length > 0 ? (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.productInfo}>
                <div className={styles.cardHeader}>
                  <h3>{product.name}</h3>
                  <div className={styles.actions}>
                    <button className={styles.iconBtn} onClick={() => openEditModal(product)}>
                      <Edit2 size={16} />
                    </button>
                    <button className={styles.iconBtnDelete} onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <span className={styles.slug}>{product.slug}</span>
                <div className={styles.priceRow}>
                  <span className={styles.label}>Base Price</span>
                  <span className={styles.price}>${parseFloat(product.basePrice).toFixed(2)}</span>
                </div>
              </div>
              <div className={styles.productFooter}>
                <span className={`${styles.status} ${product.isActive ? styles.active : styles.inactive}`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className={styles.variantsCount}>
                  <Package size={14} />
                  {product.variants?.length || 0} Variants
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <ShoppingBag size={48} />
          <h3>No products found</h3>
          <p>Start by adding your first product to the catalog.</p>
          <Button variant="secondary" onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}>Create Product</Button>
        </div>
      )}

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={editingProduct}
      />
    </div>
  );
}
