# 🚀 Zhiin CMS: Application Setup Guide

This guide provides step-by-step instructions for running the **Zhiin CMS** ecosystem locally.

## 📋 Prerequisites
- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **PostgreSQL**: A running instance (local or RDS)

---

## 🛠️ Step 1: Installation
From the root directory, install all workspace dependencies:
```bash
npm install
```

---

## 🏗️ Step 2: Database Setup (API)
The API requires a PostgreSQL database. 

1.  Navigate to `apps/api`.
2.  Create a `.env` file based on `.env.example`.
3.  Configure your `DATABASE_URL`:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/zhiin_cms?schema=public"
    ```
4.  Run the initialization sequence:
    ```bash
    npm run db:migrate    # Apply migrations
    npm run db:seed       # Create default ADMIN user
    npm run db:gen        # Generate Prisma Client
    ```

---

## 🖥️ Step 3: Web Portal Configuration
The frontend needs to know where the API is located.

1.  Navigate to `apps/web`.
2.  Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_API_URL="http://localhost:3001"
    ```

---

## 🚦 Step 4: Running the Applications

### Option A: Simultaneous Development (Recommended)
From the root directory, run both apps in parallel:
```bash
npm run dev
```

### Option B: Manual Start
**Run API:**
```bash
cd apps/api
npm run start:dev
```
*API will be available at `http://localhost:3001`*

**Run Web:**
```bash
cd apps/web
npm run dev
```
*Web Portal will be available at `http://localhost:3000`*

---

## 🔑 Default Credentials
Once seeded, you can log in with:
- **Email**: `admin@zhiin.com`
- **Password**: `admin123`

---

## 📚 Common Commands Reference
| Command | Location | Description |
| :--- | :--- | :--- |
| `npm run dev` | Root | Start all applications |
| `npm run build` | Root | Build all applications for production |
| `npm run db:push` | `apps/api` | Sync schema with DB without migrations |
| `npm run db:migrate` | `apps/api` | Create and apply a new migration |
| `npm run db:seed` | `apps/api` | Seed initial system data |

---

## 🌐 Content Delivery API
Zhiin CMS provides a dedicated public API for consuming content in your external applications.

### Authentication
All delivery requests require the `X-API-KEY` header. You can generate keys in **Settings > API Delivery Keys**.

### Endpoints
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/delivery/:slug` | GET | List all `PUBLISHED` entries for a content type slug. |
| `/delivery/:slug/:id` | GET | Fetch a specific `PUBLISHED` entry by ID. |

### Example Request
```bash
curl -H "X-API-KEY: your_api_key_here" \
     http://localhost:3001/delivery/home
```

*Note: The Delivery API only returns content with the `PUBLISHED` status.*
