'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, ShoppingBag, Search, Filter, Tag, ChevronRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { commerceService } from '@/features/commerce/services/commerce.service';
import { useCommerce } from '@/context/CommerceContext';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCommerce();
  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        commerceService.getProducts(),
        commerceService.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load shop data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: any) => {
    const variant = product.variants[0];
    addToCart({
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      variantName: variant.sku,
      price: parseFloat(variant.price),
      quantity: 1
    });
    showToast(`${product.name} added to cart!`, 'success');
  };

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.categories?.some((c: any) => c.id === selectedCategory))
    : products;

  return (
    <div className={styles.shopWrapper}>
      <div className={styles.shopContainer}>
        <aside className={styles.filterSidebar}>
          <div className={styles.sidebarHeader}>
            <Filter size={18} />
            <h3>Filter Products</h3>
          </div>
          
          <div className={styles.filterSection}>
            <label>Categories</label>
            <nav className={styles.categoryNav}>
              <button 
                className={!selectedCategory ? styles.activeFilter : ''}
                onClick={() => setSelectedCategory(null)}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  className={selectedCategory === cat.id ? styles.activeFilter : ''}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                  <span className={styles.count}>{cat._count?.products || 0}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className={styles.main}>
          <header className={styles.hero}>
            <h1 className="brand-font">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name 
                : 'Premium Collection'}
            </h1>
            <p>Carefully curated quality goods for the modern lifestyle.</p>
          </header>

          <div className={styles.resultsInfo}>
            <p>Showing {filteredProducts.length} results</p>
          </div>

          <div className={styles.grid}>
            {isLoading ? (
              <div className={styles.loading}>Loading shop...</div>
            ) : filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.slug}`} className={styles.productCard}>
                <div className={styles.imagePlaceholder}>
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.name} className={styles.productImg} />
                  ) : (
                    <ShoppingBag size={48} className={styles.placeholderIcon} />
                  )}
                  <div className={styles.productBadges}>
                    {product.categories?.slice(0, 2).map((cat: any) => (
                      <span key={cat.id} className={styles.categoryBadge}>{cat.name}</span>
                    ))}
                  </div>
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <p className={styles.description}>{product.description}</p>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>${parseFloat(product.basePrice).toFixed(2)}</span>
                    <Button size="sm" onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {!isLoading && filteredProducts.length === 0 && (
            <div className={styles.noResults}>
              <ShoppingBag size={64} />
              <h3>No products found</h3>
              <p>Try adjusting your filters or search criteria.</p>
              <Button variant="secondary" onClick={() => setSelectedCategory(null)}>Clear All Filters</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
