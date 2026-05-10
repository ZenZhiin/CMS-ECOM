# E-commerce Implementation Plan

This document outlines the tactical roadmap for integrating a high-performance, secure e-commerce engine into the Zhiin CMS.

## 🏛️ 1. Architecture: The Decoupled Model

We will adopt a headless commerce approach to ensure the storefront remains "weightless" and highly performant.

### Data Modeling (Prisma)
- **Product:** Stores core metadata (Name, Description, Brand, Categories, Slug).
- **ProductVariant:** Stores sellable units (SKU, Price, Inventory, Attributes like Size/Color).
- **Cart:** Persistent server-side cart for authenticated users.
- **Order:** Historical record of transactions.
- **OrderItem:** Immutable snapshots of products at the time of purchase (Price, Quantity).

## 🛒 2. Cart Management Strategy

### Hybrid State Persistence
- **Guest Users:** Cart data is stored in `localStorage` for zero-latency interactions.
- **Logged-in Users:** Cart is synchronized with the PostgreSQL database to enable cross-device persistence.
- **Merge Logic:** Implement a seamless "Merge on Login" flow to combine guest items with existing database carts.

## 💳 3. Secure Checkout Flow (Stripe)

We will leverage **Stripe Checkout Sessions** to maintain maximum security and minimize PCI compliance overhead.

### The Flow:
1.  **Initiation:** A Next.js Server Action calculates the total and creates a Stripe Checkout Session.
2.  **Metadata:** We attach the `userId` and `cartId` to the Stripe session for tracking.
3.  **Webhooks (Mandatory):** Listen for `checkout.session.completed`. This is the **Source of Truth** for finalizing orders and decrementing inventory.
4.  **Atomic Transactions:** Use Prisma `$transaction` to ensure Order creation and Inventory updates happen as a single, unbreakable unit.

## 🛠️ 4. Inventory & Order Lifecycle

### Inventory Control
- **Real-time Checks:** Verify stock levels during "Add to Cart" and "Initiate Checkout".
- **Atomic Decrement:** Use PostgreSQL atomic operations to prevent overselling during high-traffic events.

### Order Workflow
- `PENDING`: Checkout initiated but payment not confirmed.
- `PAID`: Payment confirmed via Stripe Webhook.
- `PROCESSING`: Order being prepared.
- `SHIPPED`: Tracking number added.
- `COMPLETED`: Order delivered.

## 🚀 5. Implementation Phases

1.  **Phase 1: Catalog:** Build the Product and Variant management UI in the Admin Dashboard.
2.  **Phase 2: Storefront:** Implement dynamic product pages and the client-side cart UI.
3.  **Phase 3: Payments:** Integrate Stripe Checkout and secure webhook handlers.
4.  **Phase 4: Order Manager:** Build the administrative order tracking and fulfillment dashboard.

---
**Status:** Architecture Finalized. Transitioning to Phase 1 (Product Catalog Schema).
