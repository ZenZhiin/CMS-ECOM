'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingBag, ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { commerceService } from '@/features/commerce/services/commerce.service';
import { useCommerce } from '@/context/CommerceContext';
import { useToast } from '@/context/ToastContext';
import styles from './page.module.css';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCommerce();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await commerceService.getProductBySlug(slug as string);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        console.error('Product not found', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addToCart({
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      variantName: selectedVariant.sku,
      price: parseFloat(selectedVariant.price),
      quantity: quantity
    });
    showToast(`${product.name} added to cart!`, 'success');
  };

  if (isLoading) return <div className={styles.loading}>Loading product details...</div>;
  if (!product) return <div className={styles.error}>Product not found.</div>;

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [null]; // Use null for placeholder

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Left: Image Gallery */}
        <div className={styles.gallerySection}>
          <div className={styles.mainImage}>
            {images[activeImage] ? (
              <img src={images[activeImage]} alt={product.name} />
            ) : (
              <div className={styles.placeholder}>
                <ShoppingBag size={80} />
              </div>
            )}
            
            {images.length > 1 && (
              <>
                <button 
                  className={`${styles.navBtn} ${styles.prev}`}
                  onClick={() => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                >
                  <ChevronLeft />
                </button>
                <button 
                  className={`${styles.navBtn} ${styles.next}`}
                  onClick={() => setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>
          
          <div className={styles.thumbnails}>
            {images.map((img: string, i: number) => (
              <div 
                key={i} 
                className={`${styles.thumb} ${activeImage === i ? styles.activeThumb : ''}`}
                onClick={() => setActiveImage(i)}
              >
                {img ? <img src={img} alt="" /> : <ShoppingBag size={20} />}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className={styles.infoSection}>
          <div className={styles.header}>
            <span className={styles.category}>{product.categories?.[0]?.name || 'Premium Product'}</span>
            <h1 className="brand-font">{product.name}</h1>
            <div className={styles.price}>
              ${selectedVariant ? parseFloat(selectedVariant.price).toFixed(2) : parseFloat(product.basePrice).toFixed(2)}
            </div>
          </div>

          <div className={styles.description}>
            <p>{product.description || 'No description available for this item.'}</p>
          </div>

          <div className={styles.options}>
            {product.variants.length > 1 && (
              <div className={styles.optionGroup}>
                <label>Select Variant</label>
                <div className={styles.variantGrid}>
                  {product.variants.map((v: any) => (
                    <button 
                      key={v.id}
                      className={`${styles.variantBtn} ${selectedVariant?.id === v.id ? styles.activeVariant : ''}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.sku}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.optionGroup}>
              <label>Quantity</label>
              <div className={styles.quantity}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}><Plus size={16} /></button>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <Button size="lg" className={styles.addBtn} onClick={handleAddToCart}>
              <ShoppingCart size={20} /> Add to Cart
            </Button>
          </div>

          <div className={styles.trustBadges}>
            <div className={styles.badge}>
              <Truck size={20} />
              <span>Free Shipping</span>
            </div>
            <div className={styles.badge}>
              <RotateCcw size={20} />
              <span>30-Day Returns</span>
            </div>
            <div className={styles.badge}>
              <ShieldCheck size={20} />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
