# Feature Roadmap: CMS Portal

## 1. Core Architecture (Foundational)
**Goal:** Establish a secure, scalable monorepo setup with NestJS and Next.js.
- [x] Initialize NestJS Backend with PostgreSQL (Prisma) `✅ Complete`
- [x] Initialize Next.js Frontend with Atomic Design `✅ Complete`
- [x] Setup Docker environment for local development `✅ Complete`

## 2. Authentication & Security (Hardening)
**Goal:** Implement robust RBAC and secure session management.
- [x] JWT Authentication Flow `✅ Complete`
- [x] Role-Based Access Control (Admin, Editor, Viewer) `✅ Complete`
- [x] Input Validation & Sanitization Middleware `✅ Complete`

## 3. Content Management (The Core)
**Goal:** Flexible content modeling and CRUD.
- [x] Schema Builder (Dynamic Content Types) `✅ Complete`
- [ ] Content Entry Editor (Rich Text / Markdown) `⏳ Pending`
- [ ] Version Control & Draft System `⏳ Pending`

## 4. Media & Assets
**Goal:** Centralized asset management.
- [ ] File Upload Service `⏳ Pending`
- [ ] Image Optimization & Transformation `⏳ Pending`
- [ ] Media Library UI `⏳ Pending`

## 5. API Delivery (Headless)
**Goal:** Public consumption of content.
- [ ] RESTful Content Delivery API `⏳ Pending`
- [ ] GraphQL Integration (Optional) `⏳ Pending`
- [ ] API Key Management `⏳ Pending`

## 6. Global Site Settings
**Goal:** Empower users to customize site-wide elements without code.
- [ ] Site Identity (Logo, Title, Favicon) `⏳ Pending`
- [ ] Drag-and-Drop Navigation Menu Builder `⏳ Pending`
- [ ] Footer Content Management `⏳ Pending`

---
## Gaps to build (Current Focus)
1. **Dynamic Content Type Builder:** Create the UI and API for defining custom schemas.
2. **Global Site Settings:** Header, Footer, and Navigation customization.
3. **Media Library:** Centralized file management and uploading.
