'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, ShoppingBag, Search } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { commerceService } from '@/features/commerce/services/commerce.service';
import { useCommerce } from '@/context/CommerceContext';
import styles from './page.module.css';

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart, cartCount } = useCommerce();

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

  const handleAddToCart = (product: any) => {
    // Default to first variant for now
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
  };

  return (
    <div className={styles.shopContainer}>
      <header className={styles.shopHeader}>
        <div className={styles.brand}>
          <div className={styles.logo}>Z</div>
          <span className="brand-font">Zhiin Store</span>
        </div>
        <div className={styles.cartBtn}>
          <Link href="/cart">
            <Button variant="secondary">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </Button>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className="brand-font">Premium Collection</h1>
          <p>Carefully curated quality goods for the modern lifestyle.</p>
        </section>

        <div className={styles.grid}>
          {isLoading ? (
            <div className={styles.loading}>Loading shop...</div>
          ) : products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <div className={styles.imagePlaceholder}>
                <ShoppingBag size={48} className={styles.placeholderIcon} />
              </div>
              <div className={styles.productInfo}>
                <h3>{product.name}</h3>
                <p className={styles.description}>{product.description}</p>
                <div className={styles.priceRow}>
                  <span className={styles.price}>${parseFloat(product.basePrice).toFixed(2)}</span>
                  <Button size="sm" onClick={() => handleAddToCart(product)}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
