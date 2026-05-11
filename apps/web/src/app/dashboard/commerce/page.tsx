'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Plus, Search, Filter, Package } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { commerceService } from '@/features/commerce/services/commerce.service';
import styles from './page.module.css';

export default function CommerceDashboardPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
        <Button onClick={() => {}}>
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
                <h3>{product.name}</h3>
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
          <Button variant="secondary" onClick={() => {}}>Create Product</Button>
        </div>
      )}
    </div>
  );
}
