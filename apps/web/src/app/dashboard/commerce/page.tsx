'use client';

import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, Plus, Search, Filter, Package, Edit2, Trash2, 
  Tag, List, CreditCard, Truck, ExternalLink, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { commerceService } from '@/features/commerce/services/commerce.service';
import { ProductModal } from '@/features/commerce/components/ProductModal';
import { CategoryModal } from '@/features/commerce/components/CategoryModal';
import { OrderDetailsModal } from '@/features/commerce/components/OrderDetailsModal';
import styles from './page.module.css';

export default function CommerceDashboardPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'products') {
        const data = await commerceService.getProducts();
        setProducts(data);
      } else if (activeTab === 'categories') {
        const data = await commerceService.getCategories();
        setCategories(data);
      } else if (activeTab === 'orders') {
        const data = await commerceService.getOrders();
        setOrders(data);
      }
    } catch (err) {
      console.error(`Failed to load ${activeTab}`, err);
    } finally {
      setIsLoading(false);
    }
  };

  // Product Actions
  const handleSaveProduct = async (data: any) => {
    if (editingProduct) {
      await commerceService.updateProduct(editingProduct.id, data);
    } else {
      await commerceService.createProduct(data);
    }
    await fetchData();
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await commerceService.deleteProduct(id);
      await fetchData();
    }
  };

  // Category Actions
  const handleSaveCategory = async (data: any) => {
    if (editingCategory) {
      await commerceService.updateCategory(editingCategory.id, data);
    } else {
      await commerceService.createCategory(data);
    }
    await fetchData();
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      await commerceService.deleteCategory(id);
      await fetchData();
    }
  };

  // Order Actions
  const handleUpdateOrder = async (id: string, data: any) => {
    await commerceService.updateOrder(id, data);
    await fetchData();
    setIsOrderModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="brand-font">Store Management</h1>
          <p>Control your catalog, categories, and fulfill orders.</p>
        </div>
        <div className={styles.headerActions}>
          {activeTab === 'products' && (
            <Button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}>
              <Plus size={18} /> Add Product
            </Button>
          )}
          {activeTab === 'categories' && (
            <Button onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}>
              <Plus size={18} /> Add Category
            </Button>
          )}
        </div>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'products' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <ShoppingBag size={18} /> Products
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'categories' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          <Tag size={18} /> Categories
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <List size={18} /> Orders
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Loading {activeTab}...</div>
      ) : (
        <div className={styles.content}>
          {activeTab === 'products' && (
            <div className={styles.grid}>
              {products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productInfo}>
                    <div className={styles.cardHeader}>
                      <h3>{product.name}</h3>
                      <div className={styles.actions}>
                        <button className={styles.iconBtn} onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}>
                          <Edit2 size={16} />
                        </button>
                        <button className={styles.iconBtnDelete} onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <span className={styles.slug}>{product.slug}</span>
                    <div className={styles.categoryTags}>
                      {product.categories?.map((cat: any) => (
                        <span key={cat.id} className={styles.categoryTag}>{cat.name}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.productFooter}>
                    <span className={styles.price}>${parseFloat(product.basePrice).toFixed(2)}</span>
                    <span className={styles.variantsCount}>{product.variants?.length || 0} Variants</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className={styles.categoriesTable}>
              <div className={styles.tableHeader}>
                <span>Name</span>
                <span>Slug</span>
                <span>Products</span>
                <span>Actions</span>
              </div>
              {categories.map((cat) => (
                <div key={cat.id} className={styles.tableRow}>
                  <span className={styles.catName}>{cat.name}</span>
                  <span className={styles.catSlug}>{cat.slug}</span>
                  <span className={styles.catCount}>{cat._count?.products || 0}</span>
                  <div className={styles.tableActions}>
                    <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }}>Edit</button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className={styles.deleteLink}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className={styles.ordersTable}>
              <div className={styles.tableHeader}>
                <span>Order #</span>
                <span>Customer</span>
                <span>Status</span>
                <span>Total</span>
                <span>Date</span>
                <span>Actions</span>
              </div>
              {orders.map((order) => (
                <div key={order.id} className={styles.tableRow} onClick={() => { setSelectedOrder(order); setIsOrderModalOpen(true); }}>
                  <span className={styles.orderNum}>#{order.orderNumber}</span>
                  <span className={styles.customerName}>{order.customer?.email}</span>
                  <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                  </span>
                  <span className={styles.orderTotal}>${parseFloat(order.totalAmount).toFixed(2)}</span>
                  <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <button className={styles.viewBtn}>View</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <ProductModal 
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={editingProduct}
      />
      <CategoryModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={editingCategory}
      />
      {selectedOrder && (
        <OrderDetailsModal 
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          order={selectedOrder}
          onUpdateStatus={handleUpdateOrder}
        />
      )}
    </div>
  );
}
