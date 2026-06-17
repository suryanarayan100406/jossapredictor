# RankScope Deployment Guide (Render & Netlify)

This guide provides tailored instructions on how to deploy RankScope to production using your specific database settings and Render's latest interface.

---

## Render Configuration Settings

### 1. Database Connection URLs
For your PostgreSQL database on Render:
- **Internal Database URL** (use this inside your Render Web Service environment variables):
  `postgresql://surya:uFoTSjGnLVeMs9JQNjeWO3z37OzWSfSl@dpg-d8p5vn1o3t8c73ecoe7g-a/rankscope`
- **External Database URL** (use this when connecting from your local machine to migrate/seed):
  `postgresql://surya:uFoTSjGnLVeMs9JQNjeWO3z37OzWSfSl@dpg-d8p5vn1o3t8c73ecoe7g-a.singapore-postgres.render.com/rankscope`

### 2. Redis on Render
As seen in the Render Dashboard menu (Image 1), Render has renamed the Redis menu option to **Key Value**. 
- To create your Redis instance, click **New** -> **Key Value** in the dropdown.
- Copy the Redis Connection URL once created.

### 3. What is "Root Directory"?
The **Root Directory** setting on Render tells the server which folder contains your application files.
- Since your RankScope repository contains the application directly in the main folder (not inside a subfolder of a monorepo), you should leave the **Root Directory** field **blank** (or set it to `./`).

---

## Option 1: Unified Next.js Deployment on Render (Recommended)

Deploying the entire Next.js application (Frontend + Backend APIs) to a single Render Web Service is the easiest approach.

### Step 1: Create a Redis (Key Value) Instance
1. In your Render Dashboard, click **New** -> **Key Value**.
2. Name it `rankscope-redis` and click **Create Key Value**.
3. Once active, copy the **Internal Connection String** (e.g. `redis://...`).

### Step 2: Deploy the Next.js Web Service
1. In the Render Dashboard, click **New** -> **Web Service**.
2. Connect your Git repository.
3. Configure the Web Service:
   - **Name**: `rankscope`
   - **Runtime**: `Node`
   - **Root Directory**: *(Leave blank)*
   - **Build Command**: 
     ```bash
     npm install && sed -i 's/provider = "sqlite"/provider = "postgresql"/g' prisma/schema.prisma && npx prisma generate && npm run build
     ```
   - **Start Command**: `npm run start`
4. Add the following **Environment Variables**:
   - `DATABASE_URL`: `postgresql://surya:uFoTSjGnLVeMs9JQNjeWO3z37OzWSfSl@dpg-d8p5vn1o3t8c73ecoe7g-a/rankscope` (Internal connection string)
   - `REDIS_URL`: *(Your Render Key Value connection string)*
   - `ADMIN_EMAIL`: Set your admin email (e.g., `admin@yourdomain.com`).
   - `ADMIN_PASSWORD`: Set a secure admin password.
   - `JWT_SECRET`: A long random secret key for admin token signing.
5. Click **Create Web Service**.

### Step 3: Run Database Sync & Seed on Render
Once the Web Service deployment is successful, push your database schema and seed the initial profiles:
1. In the Web Service dashboard, click the **Shell** tab on the left menu.
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

### Step 1: Deploy Backend API on Render
Follow the steps in Option 1 to deploy the database, Redis (Key Value), and the Render Web Service. Copy your Render Web Service URL (e.g., `https://rankscope.onrender.com`).

### Step 2: Deploy Frontend on Netlify
1. Log in to [Netlify](https://www.netlify.com).
2. Click **Add new site** -> **Import an existing project** and connect your Git repo.
3. Configure:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`
4. Add the following **Environment Variables** in Netlify dashboard:
   - `NEXT_PUBLIC_APP_URL`: Your Netlify URL (e.g., `https://rankscope.netlify.app`).
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g., `https://rankscope.onrender.com`).
5. Click **Deploy**.
