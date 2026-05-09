# 💎 Prisma Operations Guide

This guide outlines the standard procedures for managing the Zhiin CMS database using Prisma ORM.

## 🚀 Quick Commands

| Task | Command | Description |
| :--- | :--- | :--- |
| **Sync Schema** | `npm run db:push` | Fast-sync schema to DB (Development). |
| **New Migration** | `npm run db:migrate` | Create a new migration file and apply it. |
| **Seed Data** | `npm run db:seed` | Initialize DB with default admin and settings. |
| **Reset DB** | `npm run db:reset` | **CAUTION:** Wipes all data and re-seeds. |
| **Open Studio** | `npm run db:studio` | GUI for viewing/editing database records. |
| **Generate Client**| `npm run db:gen` | Regenerate Prisma Client types. |

---

## 🛠 Workflows

### 1. Modifying the Schema
Whenever you change `prisma/schema.prisma`:
1.  Run `npm run db:push` for immediate testing.
2.  When ready to commit, run `npm run db:migrate` to generate a migration file.
3.  Run `npm run db:gen` to update TypeScript types.

### 2. Initial Setup / Recovery
If your local database is out of sync or corrupted:
1.  Ensure Docker (PostgreSQL) is running.
2.  Run `npm run db:reset`. This will delete all data, apply all migrations, and run the `seed.ts` script.

### 3. Visualizing Data
To view your data in a browser-based UI, run `npm run db:studio`. It will be accessible at `http://localhost:5555`.

---

## ⚠️ Important Rules
## 🛑 Troubleshooting

### Schema Drift Detected
If you see an error about "Drift detected" when running `db:migrate`, it means your local DB is out of sync with your migration files.
**Solution:**
1.  Run `npm run db:reset` to wipe the DB and restart from migration history.
2.  Or, if you want to keep data, run `npx prisma migrate dev --name sync_schema` and follow the prompts.

### Types not updating
If TypeScript doesn't recognize a new table or column:
**Solution:** Run `npm run db:gen`.
