# MVP Launch Checklist

**Archetect - Quick Launch to Production**

Use this checklist to deploy Archetect to production in under 1 hour.

---

## ✅ Pre-Launch (Development Complete)

- [x] Backend API complete (12 endpoints)
- [x] Frontend UI complete (8 pages)
- [x] Database schema ready
- [x] All TypeScript errors fixed (0 errors)
- [x] All Python linting passed (10/10)
- [x] Production builds successful
- [x] Code pushed to GitHub

---

## 🚀 Deployment Phase (30-60 minutes)

### Step 1: Choose Platform (5 min)

Select one deployment platform:
- [ ] **Railway** (Recommended - Easiest, $5/mo)
- [ ] **Render** (Free tier available)
- [ ] **Fly.io** (Global edge, free tier)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Step 2: Generate Secrets (2 min)

```bash
# Generate JWT secrets
openssl rand -hex 32  # Use for JWT_SECRET
openssl rand -hex 32  # Use for JWT_REFRESH_SECRET
```

- [ ] JWT_SECRET generated and saved securely
- [ ] JWT_REFRESH_SECRET generated and saved securely

### Step 3: Provision Database (5 min)

- [ ] PostgreSQL database created
- [ ] Database credentials saved
- [ ] DATABASE_URL or connection string copied

### Step 4: Deploy Backend (10-15 min)

- [ ] Backend service created
- [ ] Environment variables configured:
  - [ ] NODE_ENV=production
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET
  - [ ] JWT_REFRESH_SECRET
  - [ ] CORS_ORIGIN
- [ ] Build successful
- [ ] Service started
- [ ] Health check passing (`/health`)

### Step 5: Run Database Migrations (5 min)

**Option A: In deployment platform dashboard**
- [ ] Add to start command: `npm run migrate && npm start`

**Option B: Manual via CLI**
```bash
# Railway
railway run npm run migrate

# Render
# Use shell access in dashboard

# Fly.io
fly ssh console -a archetect-backend
npm run migrate
```

### Step 6: Deploy Frontend (10-15 min)

- [ ] Frontend service created
- [ ] Environment variable configured:
  - [ ] NEXT_PUBLIC_API_URL (backend URL)
- [ ] Build successful
- [ ] Service started
- [ ] Frontend accessible

### Step 7: Configure CORS (5 min)

Update backend environment:
- [ ] CORS_ORIGIN includes frontend URL
- [ ] Restart backend service

---

## 🧪 Testing Phase (10-15 minutes)

### Backend Tests

```bash
# 1. Health check
curl https://your-backend-url/health
```
- [ ] Returns `{"status":"ok"}`

```bash
# 2. Create test user
curl -X POST https://your-backend-url/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "fullName": "Test User"
  }'
```
- [ ] User created successfully
- [ ] Returns access token

```bash
# 3. Login test
curl -X POST https://your-backend-url/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!"
  }'
```
- [ ] Login successful
- [ ] Returns access token

### Frontend Tests

- [ ] Visit frontend URL
- [ ] Landing page loads correctly
- [ ] Can navigate to signup page
- [ ] Can create new account
- [ ] Redirected to questionnaire
- [ ] Can complete questionnaire (40 questions)
- [ ] Redirected to dashboard
- [ ] Profile displays correctly with:
  - [ ] Archetect Type
  - [ ] Energy Style
  - [ ] Flow Mode
  - [ ] Season
  - [ ] Strengths
  - [ ] Challenges
- [ ] Can view team compatibility page
- [ ] Can access settings page
- [ ] Can logout

### Full User Journey Test

- [ ] Create account from scratch
- [ ] Complete entire questionnaire
- [ ] View generated profile
- [ ] Navigate all pages
- [ ] Logout and login again
- [ ] Profile persists correctly

---

## 📊 Post-Launch Setup (Optional - 15 min)

### Monitoring

- [ ] Uptime monitoring configured (UptimeRobot/Pingdom)
- [ ] Error tracking set up (Sentry)
- [ ] Backend health endpoint monitored
- [ ] Frontend monitored

### Analytics (Optional)

- [ ] Analytics installed (PostHog/Plausible)
- [ ] Key events tracked:
  - [ ] Signups
  - [ ] Questionnaire completions
  - [ ] Profile views
  - [ ] Compatibility checks

### Documentation

- [ ] API endpoints documented
- [ ] Deployment URL documented
- [ ] Admin credentials saved securely
- [ ] Database backup procedure documented

---

## 🔒 Security Checklist

### Secrets Management

- [ ] All secrets stored in platform environment variables
- [ ] No secrets committed to git
- [ ] `.env.production.example` is template only
- [ ] Production secrets different from development

### Database Security

- [ ] SSL/TLS enabled for database connections
- [ ] Database not publicly accessible
- [ ] Strong database password used
- [ ] Regular backups enabled

### API Security

- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] JWT secrets are strong (256-bit)
- [ ] HTTPS enabled (automatic on most platforms)

---

## 🎯 Launch Readiness

Check all items before announcing launch:

### Technical

- [ ] Backend healthy and responding
- [ ] Frontend loading correctly
- [ ] Database migrations complete
- [ ] All API endpoints tested
- [ ] No console errors in browser
- [ ] Mobile responsive (test on phone)

### User Experience

- [ ] Signup flow works
- [ ] Login flow works
- [ ] Questionnaire completes
- [ ] Profile generates correctly
- [ ] Navigation works
- [ ] No broken links

### Business

- [ ] Terms of Service ready (if required)
- [ ] Privacy Policy ready (if required)
- [ ] Support email configured
- [ ] Monitoring alerts configured
- [ ] Team notified of launch

---

## 🚨 Rollback Plan

If critical issues occur:

### Quick Rollback

1. **Disable frontend temporarily**
   - Set maintenance mode or take offline

2. **Check backend logs**
   ```bash
   # Railway
   railway logs

   # Render
   # View in dashboard

   # Fly.io
   fly logs
   ```

3. **Identify issue**
   - Database migration failed?
   - Environment variable missing?
   - CORS issue?

4. **Fix and redeploy**
   - Update config
   - Rerun migrations if needed
   - Restart services

### Emergency Contacts

- Platform support:
  - Railway: https://railway.app/help
  - Render: https://render.com/docs
  - Fly.io: https://fly.io/docs

---

## 📈 Success Metrics

Track these metrics after launch:

### Day 1
- [ ] 0 critical errors
- [ ] 100% uptime
- [ ] First real user signup
- [ ] First questionnaire completion

### Week 1
- [ ] 10+ user signups
- [ ] 5+ questionnaires completed
- [ ] No database issues
- [ ] Average response time < 500ms

### Month 1
- [ ] 50+ users
- [ ] 25+ complete profiles
- [ ] User feedback collected
- [ ] Feature requests prioritized

---

## 🎉 Launch Complete!

Once all checkboxes are marked:

- [ ] Announce on social media
- [ ] Email early access list
- [ ] Post on Product Hunt (optional)
- [ ] Share with friends/network
- [ ] Monitor for 24 hours
- [ ] Celebrate! 🎊

---

## 📞 Need Help?

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
2. Review [DOCKER_QUICKSTART.md](./DOCKER_QUICKSTART.md) for local
   testing
3. Check platform documentation
4. Review application logs

---

**Total Estimated Time: 45-90 minutes**

**Difficulty**: ⭐⭐ Moderate (following guide)

**Cost**: $0-5/month (free tier available on most platforms)

---

**Last Updated**: November 19, 2025

Good luck with your launch! 🚀
