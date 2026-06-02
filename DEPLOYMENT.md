# Deployment Guide

This guide provides step-by-step instructions for deploying the Inventory & Order Management System to production using free hosting platforms.

## Table of Contents

1. [Backend Deployment (Render)](#backend-deployment-render)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
5. [Docker Hub Setup](#docker-hub-setup)
6. [Post-Deployment Verification](#post-deployment-verification)

## Prerequisites

- GitHub account and repository
- Docker account (for Docker Hub)
- Render/Railway account (for backend)
- Vercel/Netlify account (for frontend)
- Git CLI installed locally

## Backend Deployment (Render)

### Step 1: Prepare Repository

```bash
# Ensure all code is committed and pushed to GitHub
git add .
git commit -m "Final production setup"
git push origin main
```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Click "New +" button and select "Web Service"
4. Connect your GitHub repository

### Step 3: Configure Render Service

1. **Name**: `inventory-backend`
2. **Environment**: `Docker`
3. **Region**: Select closest to your users
4. **Plan**: Free (with limitations)

### Step 4: Set Environment Variables

In Render dashboard, go to "Environment":

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
DEBUG=False
```

For Render PostgreSQL:
1. Create a new "PostgreSQL" service
2. Use the connection string provided

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Get your backend URL: `https://inventory-backend-xxx.onrender.com`

### Step 6: Update Frontend

In `frontend/.env.production`:
```
REACT_APP_API_URL=https://inventory-backend-xxx.onrender.com
```

## Backend Deployment (Railway)

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your repository

### Step 3: Add PostgreSQL Database

1. Click "Add"
2. Search for "PostgreSQL"
3. Click "Add PostgreSQL"

### Step 4: Configure Environment Variables

1. Go to your backend service "Variables"
2. Add:
```
DATABASE_URL=postgresql://${{Postgres.PGUSER}}:${{Postgres.PGPASSWORD}}@${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/railway
DEBUG=False
```

### Step 5: Deploy

1. Railway automatically deploys on git push
2. Get your backend URL from the deployment tab

## Frontend Deployment (Vercel)

### Step 1: Push Code to GitHub

```bash
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub account

### Step 3: Import Project

1. Click "Add New" → "Project"
2. Import your GitHub repository
3. Select the `frontend` directory

### Step 4: Set Environment Variables

In "Environment Variables":
```
REACT_APP_API_URL=https://inventory-backend-xxx.onrender.com
```

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build completion
3. Get your frontend URL: `https://inventory-frontend-xxx.vercel.app`

## Frontend Deployment (Netlify)

### Step 1: Create Netlify Account

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub account

### Step 2: Connect Repository

1. Click "Add new site" → "Import an existing project"
2. Select GitHub provider
3. Choose your repository

### Step 3: Configure Build Settings

1. **Base directory**: `frontend`
2. **Build command**: `npm run build`
3. **Publish directory**: `frontend/build`

### Step 4: Set Environment Variables

1. Go to "Site settings" → "Build & deploy" → "Environment"
2. Add:
```
REACT_APP_API_URL=https://inventory-backend-xxx.onrender.com
```

### Step 5: Deploy

1. Click "Deploy"
2. Get your frontend URL: `https://inventory-frontend-xxx.netlify.app`

## Docker Hub Setup

### Step 1: Build Backend Image

```bash
cd backend
docker build -t your-username/inventory-backend:latest .
```

### Step 2: Login to Docker Hub

```bash
docker login
```

### Step 3: Push Image

```bash
docker push your-username/inventory-backend:latest
```

### Dockerfile Verification

Ensure these files exist in backend/:
- `Dockerfile` - Production image definition
- `requirements.txt` - Python dependencies
- `.dockerignore` - Files to exclude

## Post-Deployment Verification

### 1. Test Backend Health

```bash
curl https://inventory-backend-xxx.onrender.com/health
```

Expected response:
```json
{"status": "healthy"}
```

### 2. Test API Documentation

Visit: `https://inventory-backend-xxx.onrender.com/docs`

You should see SwaggerUI with all endpoints

### 3. Test Statistics Endpoint

```bash
curl https://inventory-backend-xxx.onrender.com/stats
```

### 4. Test Frontend

1. Open frontend URL in browser
2. Navigate through all pages
3. Test product creation
4. Test customer creation
5. Test order creation

### 5. CORS Configuration

If frontend shows CORS errors, ensure backend has proper CORS settings.

In `backend/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["your-frontend-url.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Database Backups

### Render PostgreSQL

1. Go to "Data" → "Backup"
2. Enable automatic backups
3. Download backups manually as needed

### Railway PostgreSQL

1. In PostgreSQL service settings
2. Enable backups in Railway dashboard

## Monitoring & Logs

### Render

- Backend logs: Dashboard → "Logs" tab
- Monitor resource usage in dashboard

### Railway

- Backend logs: Service detail page
- Real-time metrics available

### Vercel

- Frontend logs: Deployments → View logs
- Performance monitoring available

## Troubleshooting

### Backend Issues

**Port Binding Error:**
```bash
# Render uses PORT environment variable
# Ensure main.py uses os.getenv("PORT", 8000)
```

**Database Connection:**
- Verify DATABASE_URL format
- Check PostgreSQL service is running
- Test connection with psql client

### Frontend Issues

**CORS Errors:**
- Check API_URL in .env matches backend URL
- Verify backend CORS configuration

**API Not Reachable:**
- Check backend deployment status
- Verify network connectivity
- Check firewall rules

### Database Issues

**Connection Timeout:**
- Verify database is running
- Check credentials are correct
- Ensure IP whitelist includes deployment services

## Production Checklist

- [ ] Backend deployed and healthy
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] Database backups enabled
- [ ] API documentation working
- [ ] CORS properly configured
- [ ] Logging enabled
- [ ] Error monitoring setup (optional)
- [ ] Custom domain configured (optional)
- [ ] SSL/TLS enabled (automatic)

## Scaling Considerations

### For Higher Traffic

**Backend:**
- Upgrade from Render/Railway free tier
- Implement caching (Redis)
- Add load balancing

**Database:**
- Upgrade PostgreSQL plan
- Implement read replicas
- Add connection pooling

**Frontend:**
- Enable CDN caching
- Optimize bundle size
- Implement lazy loading

## Support & Maintenance

- Monitor error logs regularly
- Update dependencies monthly
- Backup database weekly
- Test disaster recovery procedures
- Document any custom configurations

---

**Last Updated:** 2026-06-02
