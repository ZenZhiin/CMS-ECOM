# Zhiin CMS: Coding Standards & Patterns

This guide defines the architectural standards for the Zhiin CMS monorepo. We prioritize strict modularity, type safety, and the "Antigravity" principle: keeping the codebase weightless and easy to evolve.

---

## 1. Monorepo Architecture
We use **NPM Workspaces** to manage multiple applications and shared libraries.

- **`/apps/api`**: NestJS backend service.
- **`/apps/web`**: Next.js frontend application.
- **`/packages/shared`**: Shared TypeScript interfaces, DTOs, and utility functions used by both apps.

---

## 2. Frontend Standards (Next.js 15+ App Router)

### ⚛️ Atomic Design
Follow Atomic Design principles to ensure component reusability:
- **Atoms**: Smallest units (Buttons, Inputs, Badges).
- **Molecules**: Groups of atoms (FormField, SearchBar).
- **Organisms**: Complex UI sections (LoginForm, Sidebar, MediaGrid).
- **Templates/Pages**: Layouts and route entry points.

### 🎨 Styling
- **Vanilla CSS Modules**: Use `[name].module.css` for component-scoped styling.
- **Tokens**: Utilize CSS Variables defined in `globals.css` for theme consistency (colors, spacing, radius).
- **Glassmorphism**: Follow the established "Zenith" theme using semi-transparent backgrounds and subtle borders.

### 🚀 Data Fetching
- Use the custom `apiFetch` wrapper in `lib/api.ts` for all client-side requests.
- Handle loading and error states locally within "smart" components.

---

## 3. Backend Standards (NestJS)

### 🧠 Service Architecture
- **Controllers**: Handle routing, validation (DTOs), and response mapping. No business logic here.
- **Services**: The "brain" of the application. Business logic and database interactions (via Prisma) reside here.
- **DTOs**: Every request must have a dedicated Data Transfer Object using `class-validator` for runtime safety.

### 🔐 Security & RBAC
- **JwtAuthGuard**: Protects routes requiring authentication.
- **RolesGuard**: Implements Role-Based Access Control using the `@Roles()` decorator.
- **ValidationPipe**: Enabled globally to sanitize all incoming data.

---

## 4. Database Standards (Prisma & PostgreSQL)

- **Naming**: Use `PascalCase` for Prisma models and `snake_case` for database mappings if required.
- **Migrations**: Always use `npx prisma migrate dev` for schema changes. Never modify the database directly.
- **Singletons**: Use fixed IDs (e.g., `"global"`) for settings and configurations that only ever have one record.

---

## 5. Coding Principles

- **The 500-Line Rule**: No single source file should exceed 500 lines. If it does, decompose it into smaller hooks or services.
- **Absolute Imports**: Always use `@/` to refer to the `src` directory. Avoid relative path hell (`../../`).
- **Functional Components**: Use functional components with Hooks on the frontend.
- **Single Responsibility**: Each class, function, or component should do exactly one thing well.

---

## 6. Git Workflow
- **Feature Commits**: Commit changes feature-by-feature with clear prefixes (e.g., `feat:`, `fix:`, `chore:`).
- **API Parity**: When adding a field to the database, update the Prisma schema, the backend DTO, and the frontend types in the same commit cycle.
