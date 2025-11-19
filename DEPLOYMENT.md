# Archetect Deployment Guide

**Quick Launch MVP - Production Deployment**

This guide will help you deploy Archetect to production in under
1 hour using cloud platforms with managed PostgreSQL.

---

## 🚀 Option A: Railway Deployment (Recommended - Fastest)

Railway provides managed PostgreSQL, automatic deployments, and
generous free tier.

### Step 1: Prerequisites
- GitHub account (code already pushed)
- Railway account (sign up at railway.app)

### Step 2: Deploy to Railway

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub and select `Archetect-Workspace`

2. **Add PostgreSQL Database**
   - In your project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will provision a PostgreSQL instance

3. **Configure Backend Service**
   - Click "+ New" → "GitHub Repo"
   - Select your repo
   - Set Root Directory: `src/backend`
   - Railway will auto-detect package.json

4. **Set Environment Variables (Backend)**
   ```
   NODE_ENV=production
   PORT=${{PORT}}
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=<generate-random-256-bit-string>
   JWT_REFRESH_SECRET=<generate-random-256-bit-string>
   CORS_ORIGIN=<your-frontend-url>
   ```

5. **Configure Frontend Service**
   - Click "+ New" → "GitHub Repo"
   - Select your repo
   - Set Root Directory: `src/frontend`
   - Set Environment Variable:
     ```
     NEXT_PUBLIC_API_URL=<your-backend-url>
     ```

6. **Run Migrations**
   - In backend service settings
   - Add "Deploy Command": `npm run migrate && npm start`
   - Or run manually via Railway CLI

### Step 3: Access Your Application
- Backend: `https://archetect-backend.up.railway.app`
- Frontend: `https://archetect.up.railway.app`

**Total Time: 20-30 minutes**

---

## 🚀 Option B: Render Deployment

Render offers similar managed services with free tier.

### Step 1: Create Render Account
- Visit https://render.com
- Sign up and connect GitHub

### Step 2: Create PostgreSQL Database
1. Dashboard → "New" → "PostgreSQL"
2. Name: `archetect-db`
3. Plan: Free tier
4. Click "Create Database"
5. Copy the "Internal Database URL"

### Step 3: Deploy Backend
1. Dashboard → "New" → "Web Service"
2. Connect repository: `Archetect-Workspace`
3. Configure:
   - **Name**: archetect-backend
   - **Root Directory**: src/backend
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run migrate && npm start`
4. Add Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<internal-db-url>
   JWT_SECRET=<generate-random-string>
   JWT_REFRESH_SECRET=<generate-random-string>
   ```
5. Click "Create Web Service"

### Step 4: Deploy Frontend
1. Dashboard → "New" → "Static Site"
2. Connect repository: `Archetect-Workspace`
3. Configure:
   - **Name**: archetect-frontend
   - **Root Directory**: src/frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: .next
4. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://archetect-backend.onrender.com
   ```
5. Click "Create Static Site"

**Total Time: 30-40 minutes**

---

## 🚀 Option C: Fly.io Deployment

Fly.io offers global edge deployment with generous free tier.

### Step 1: Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

### Step 2: Create PostgreSQL
```bash
cd /path/to/Archetect-Workspace
fly postgres create --name archetect-db --region sjc
```

### Step 3: Deploy Backend
```bash
cd src/backend
fly launch --name archetect-backend --region sjc
fly postgres attach archetect-db

# Set secrets
fly secrets set \
  JWT_SECRET=$(openssl rand -hex 32) \
  JWT_REFRESH_SECRET=$(openssl rand -hex 32)

# Deploy
fly deploy
```

### Step 4: Deploy Frontend
```bash
cd ../frontend
fly launch --name archetect-frontend --region sjc

fly secrets set \
  NEXT_PUBLIC_API_URL=https://archetect-backend.fly.dev

fly deploy
```

**Total Time: 40-50 minutes**

---

## 🔒 Generate Secure Secrets

**For JWT Secrets (use one of these methods):**

```bash
# Method 1: OpenSSL
openssl rand -hex 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 3: Online (use with caution)
# Visit: https://www.random.org/strings/
```

---

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Secrets generated (JWT_SECRET, JWT_REFRESH_SECRET)
- [ ] PostgreSQL database provisioned
- [ ] Environment variables configured
- [ ] CORS origins set correctly
- [ ] Frontend API URL points to backend

---

## 🧪 Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-backend-url/health
# Should return: {"status":"ok"}
```

### 2. Create Test User
```bash
curl -X POST https://your-backend-url/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "fullName": "Test User"
  }'
```

### 3. Login Test
```bash
curl -X POST https://your-backend-url/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```

### 4. Frontend Test
- Visit your frontend URL
- Create account
- Take questionnaire
- View dashboard
- Check team compatibility

---

## 🐛 Troubleshooting

### Backend Won't Start
**Check logs:**
```bash
# Railway
railway logs

# Render
# View logs in dashboard

# Fly.io
fly logs
```

**Common Issues:**
1. Database not connected → Check DATABASE_URL
2. Migrations not run → Add to start command
3. Port binding → Use PORT environment variable

### Frontend Can't Connect to Backend
1. Check NEXT_PUBLIC_API_URL is correct
2. Verify CORS_ORIGIN in backend includes frontend URL
3. Check backend is actually running (visit /health)

### Database Connection Errors
1. Verify DATABASE_URL format
2. Check if PostgreSQL is accepting connections
3. Verify SSL settings (most managed DBs require SSL)

---

## 📊 Monitoring Setup (Post-Launch)

### Free Monitoring Tools

1. **Uptime Monitoring**
   - UptimeRobot: https://uptimerobot.com (free)
   - Pingdom: https://pingdom.com (free tier)

2. **Error Tracking**
   - Sentry: https://sentry.io (free tier)
   - Add to backend:
     ```bash
     npm install @sentry/node
     ```

3. **Analytics**
   - PostHog: https://posthog.com (free tier)
   - Add to frontend:
     ```bash
     npm install posthog-js
     ```

---

## 🔄 Continuous Deployment

### Railway
- Auto-deploys on git push to main branch
- Can configure deployment branch in settings

### Render
- Auto-deploys on git push
- Can set up preview environments for PRs

### Fly.io
- Manual deployment via `fly deploy`
- Can set up GitHub Actions for auto-deploy

---

## 💰 Cost Estimates (Free Tiers)

| Service | Railway | Render | Fly.io |
|---------|---------|--------|--------|
| PostgreSQL | ✅ Free | ✅ Free | ✅ Free |
| Backend | ✅ $5/mo | ✅ Free | ✅ Free |
| Frontend | ✅ Free | ✅ Free | ✅ Free |
| **Total** | **$5/mo** | **$0** | **$0** |

All platforms have generous free tiers sufficient for MVP launch
with 100-1000 users.

---

## 🎯 Next Steps After Deployment

1. [ ] Set up error monitoring (Sentry)
2. [ ] Configure uptime monitoring
3. [ ] Add custom domain
4. [ ] Set up SSL certificates (auto on all platforms)
5. [ ] Enable analytics
6. [ ] Create backup strategy
7. [ ] Document API endpoints (Swagger)
8. [ ] Set up staging environment

---

## 📞 Support

If you encounter issues during deployment:
1. Check platform status pages
2. Review application logs
3. Verify environment variables
4. Test database connectivity
5. Check CORS configuration

For Railway: https://railway.app/help
For Render: https://render.com/docs
For Fly.io: https://fly.io/docs

---

**Last Updated**: November 19, 2025
**Deployment Difficulty**: ⭐ Easy (MVP Quick Launch)
**Estimated Time**: 20-50 minutes depending on platform
