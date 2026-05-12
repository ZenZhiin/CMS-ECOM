# 🏛️ Zhiin (Zenith Intelligent Integration) - CMS & E-Commerce Platform

**Zhiin** is a next-generation, high-performance **Headless Content Management System and E-commerce Platform** designed for speed, flexibility, and absolute visual elegance. 

Built with a "Weightless" architecture, it decouples content and commerce management from delivery, allowing you to power websites, mobile apps, and IoT devices from a single, centralized source of truth.

## ✨ Core Features

### 📝 Content Management (CMS)
*   **🧩 Dynamic Schema Builder:** Create custom content models (Blog, Product, Team) on the fly without writing a single line of database code.
*   **🖼️ Integrated Media Library:** Professional asset management with support for image optimization and instant URL delivery.
*   **🔑 Headless Delivery API:** High-speed RESTful endpoints protected by secure API Key management.

### 🛍️ E-Commerce
*   **📦 Product & Variant Management:** Support for Physical, Digital, Subscription, and Bundle/Package products with comprehensive variant control (SKU, Price, Inventory).
*   **🛒 Order & Fulfillment Tracking:** Full lifecycle management from pending to delivered, with carrier and tracking integration.
*   **🏷️ Campaign & Pricing:** Built-in support for sale prices, scheduled campaigns, and dynamic product grouping.

### 🛡️ Platform Infrastructure
*   **💎 Zenith Design System:** A premium, glassmorphic administrative portal built on **Atomic Design** principles.
*   **🔐 Enterprise RBAC:** Full Role-Based Access Control (Admin, Editor, Viewer) to secure your workflows.

## 🏗️ Architecture
The project is structured as a Monorepo for maximum developer efficiency:
*   **`/apps/api`**: NestJS backend for the CMS powered by Prisma ORM and PostgreSQL.
*   **`/apps/commerce-api`**: Independent NestJS backend for the E-commerce engine.
*   **`/apps/web`**: Next.js 15 administrative portal featuring the Zenith UI, combining both CMS and E-commerce management.
*   **`/packages/shared`**: Shared TypeScript types and utilities to ensure total cross-stack consistency.

## 🛠️ Technology Stack
- **Frontend**: Next.js 15 (App Router), CSS Modules, Lucide Icons.
- **Backend**: NestJS, Passport.js (JWT), Bcrypt.
- **Database**: PostgreSQL, Prisma ORM.
- **Design**: Atomic Design Methodology (Atoms, Molecules, Organisms).

## 🚀 Getting Started
To get the system running locally, please refer to our detailed **[Setup Guide](apps-guide.md)**.

## 📈 Roadmap
Track our progress and upcoming features:
- **[CMS Roadmap](local%20document/feature.md)**
- **[E-Commerce Roadmap](local%20document/e-commerce%20feature.md)**

---
Built with ❤️ by the ZenZhiin Team.
