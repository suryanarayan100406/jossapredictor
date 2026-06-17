# RankScope Deployment Guide (Netlify & Render)

This guide provides instructions on how to deploy RankScope to production.

---

## Architecture Overview

RankScope is a Next.js App Router application that contains:
1. **Frontend UI**: Responsive pages for user interaction, recommendations, comparisons, and trends.
2. **Backend API Routes** (`/api/*`): Logic for predictions, preference-based sorting, counselling advisor rules, comparison records, and cutoff trends.
3. **PostgreSQL Database**: Persistent storage for cutoff records (65,000+ entries) and college profiles (ratings, average packages, NIRF rankings).
4. **Redis Cache**: Optional in-memory caching to optimize API response times for predictions and recommendations.

---

## Option 1: Unified Next.js Deployment on Render (Recommended)

Deploying the entire Next.js application (Frontend + Backend APIs) to a single Render Web Service is the **easiest and most robust** approach. It prevents CORS issues, avoids serverless cold starts, and simplifies environment configuration.

### Step 1: Create a PostgreSQL Database on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New** -> **PostgreSQL**.
3. Configure the database:
   - **Name**: `rankscope-db`
   - **Database**: `rankscope`
   - **User**: `postgres`
4. Click **Create Database**.
5. Once active, copy the **Internal Database URL** (e.g., `postgresql://...`).

### Step 2: Create a Redis Instance on Render (Optional but Recommended)
1. In the Render Dashboard, click **New** -> **Redis**.
2. Configure:
   - **Name**: `rankscope-redis`
3. Click **Create Redis**.
4. Once active, copy the **Internal Redis URL** (e.g., `redis://...`).

### Step 3: Deploy the Next.js Web Service
1. In the Render Dashboard, click **New** -> **Web Service**.
2. Connect your Git repository.
3. Configure the Web Service:
   - **Name**: `rankscope`
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma && npm run build
     ```
     *(This command automatically updates the Prisma schema database provider to PostgreSQL for the production environment before compilation).*
   - **Start Command**: `npm run start`
4. Add the following **Environment Variables**:
   - `DATABASE_URL`: Set to your Render **External Database URL**.
   - `REDIS_URL`: Set to your Render **External Redis URL**.
   - `ADMIN_EMAIL`: Set your admin dashboard email (e.g., `admin@yourdomain.com`).
   - `ADMIN_PASSWORD`: Set a secure admin password.
   - `JWT_SECRET`: A long random secret key for admin authentication.
   - `PORT`: `10000` (Render's default port).
5. Click **Create Web Service**.

### Step 4: Run Database Sync & Seed on Render
Once the Web Service deployment is successful, you need to push the database schema and populate it:
1. In the Web Service dashboard, open the **Shell** tab.
2. Run database push to sync the schema to PostgreSQL:
   ```bash
   npx prisma db push
   ```
3. Run the import script to parse all 2024–2025 rounds from the dataset folder and merge AWS API historical records:
   ```bash
   npx tsx prisma/import-all-data.ts
   ```
4. Run the seed profiles script to scrape placements metadata and NIRF rankings:
   ```bash
   npx tsx prisma/seed-profiles.ts
   ```

---

## Option 2: Split Deployment (Netlify Frontend + Render Backend)

If you prefer hosting the static frontend assets on Netlify and the API endpoints on Render:

### Step 1: Deploy Backend API on Render
Follow the **Option 1** steps to set up PostgreSQL, Redis, and a Web Service on Render.
- Note: Since this will only serve API requests, the Next.js frontend pages on Render will be unused, but the API endpoints (`/api/*`) will be fully functional.
- Copy your Render Web Service URL (e.g., `https://rankscope-backend.onrender.com`).

### Step 2: Configure and Deploy Frontend on Netlify
1. Log in to [Netlify](https://www.netlify.com).
2. Click **Add new site** -> **Import an existing project** and connect your Git repo.
3. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next` or `out` (if using static export).
4. Add the following **Environment Variables** in Netlify dashboard:
   - `NEXT_PUBLIC_APP_URL`: Your Netlify URL (e.g., `https://rankscope.netlify.app`).
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://rankscope-backend.onrender.com`).
5. Click **Deploy**.

---

## Local Development Troubleshooting

### Connecting to local SQLite
RankScope's `src/lib/db.ts` dynamically handles the connection:
- If `DATABASE_URL` starts with `file:`, it automatically loads the `@prisma/adapter-better-sqlite3` driver adapter.
- Keep your `.env` configured with:
  ```env
  DATABASE_URL="file:./dev.db"
  ```
