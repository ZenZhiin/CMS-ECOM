import { apiFetch } from '@/lib/api';

const COMMERCE_API_URL = process.env.NEXT_PUBLIC_ECOM_URL || 'http://localhost:3002';

export const commerceService = {
  getProducts: async () => {
    // In a real scenario, apiFetch might need to be adjusted to handle absolute URLs 
    // or we use a different wrapper. For now, assuming apiFetch handles it or we use fetch.
    const response = await fetch(`${COMMERCE_API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },
  
  getProduct: async (id: string) => {
    const response = await fetch(`${COMMERCE_API_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  getProductBySlug: async (slug: string) => {
    const response = await fetch(`${COMMERCE_API_URL}/products/slug/${slug}`);
    if (!response.ok) throw new Error('Product not found');
    return response.json();
  },

  createProduct: async (data: any) => {
    const response = await fetch(`${COMMERCE_API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  updateProduct: async (id: string, data: any) => {
    const response = await fetch(`${COMMERCE_API_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  deleteProduct: async (id: string) => {
    const response = await fetch(`${COMMERCE_API_URL}/products/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },

  // Customer Auth
  registerCustomer: async (data: any) => {
    const response = await fetch(`${COMMERCE_API_URL}/customers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to register');
    return response.json();
  },

  loginCustomer: async (data: any) => {
    const response = await fetch(`${COMMERCE_API_URL}/customers/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json();
  },

  // Orders (Admin)
  getOrders: async () => {
    const response = await fetch(`${COMMERCE_API_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  updateOrder: async (id: string, data: any) => {
    const response = await fetch(`${COMMERCE_API_URL}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
  }
};
