# Archetect Quick Start Guide

Get your Archetect personality intelligence platform running in under 10 minutes!

## 🚀 Quick Setup

### Step 1: Clone and Install (2 minutes)

```bash
# Navigate to project
cd Archetect-Workspace

# Install all dependencies (backend + frontend)
npm install

# Install backend dependencies
cd src/backend && npm install && cd ../..

# Install frontend dependencies
cd src/frontend && npm install && cd ../..
```

### Step 2: Database Setup (3 minutes)

```bash
# Install PostgreSQL (if not already installed)
# macOS:
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian:
sudo apt-get install postgresql-15
sudo systemctl start postgresql

# Create database and user
psql postgres
CREATE DATABASE archetect;
CREATE USER archetect_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE archetect TO archetect_user;
\q
```

### Step 3: Environment Configuration (2 minutes)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
# Update these lines:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=archetect
DB_USER=archetect_user
DB_PASSWORD=your_password_here

# Set JWT secrets (IMPORTANT: Change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-me
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-me
```

### Step 4: Run Migrations (1 minute)

```bash
cd src/backend

# Run database migrations
npm run migrate

# (Optional) Seed test data
npm run seed
# This creates 3 test users with profiles:
# - john@example.com / password123
# - jane@example.com / password123
# - alex@example.com / password123
```

### Step 5: Start Development Servers (1 minute)

```bash
# Terminal 1 - Backend
cd src/backend
npm run dev
# Backend runs on http://localhost:3000

# Terminal 2 - Frontend
cd src/frontend
npm run dev
# Frontend runs on http://localhost:3001
```

### Step 6: Test the Application (1 minute)

Visit http://localhost:3001 in your browser!

**Try the demo flow:**
1. Click "Get Started" on landing page
2. Create account with email/password
3. Complete 40-question Big Five questionnaire
4. View your Archetect Type on dashboard
5. Navigate to "Team" to test compatibility
6. Go to "Settings" to manage account

## 🧪 Testing the API

```bash
# Run comprehensive API tests
cd src/backend
npm run test:api

# You should see 8 tests pass:
# ✓ Health check
# ✓ User signup
# ✓ Get questionnaire (40 items)
# ✓ Create profile
# ✓ Get my profile
# ✓ Create second user
# ✓ Calculate pair compatibility
# ✓ Calculate team compatibility
```

## 🎯 Common Use Cases

### Use Case 1: New User Flow

```bash
# 1. Visit http://localhost:3001
# 2. Click "Get Started"
# 3. Fill in signup form:
Email: test@example.com
Password: password123
Full Name: Test User

# 4. Complete questionnaire (40 questions)
# 5. View your personality profile
# 6. Explore team compatibility
```

### Use Case 2: Testing with Seed Data

```bash
# Login with pre-seeded users
Email: john@example.com
Password: password123

# Or
Email: jane@example.com
Password: password123

# These users already have profiles:
# - John: Architect type
# - Jane: Maverick type
# - Alex: Sage type
```

### Use Case 3: Team Compatibility

```bash
# 1. Login to dashboard
# 2. Click "Team Compatibility"
# 3. Add team members by profile ID
#    (Use IDs from seed data or create new users)
# 4. View compatibility matrix
# 5. Read team dynamics and recommendations
```

## 📊 Understanding Your Results

### Archetect Types

**Architect** (Blue)
- Strategic planners and system designers
- High conscientiousness, moderate openness
- Thrive on structure and clear goals
- Strengths: Organized, reliable, detail-oriented

**Maverick** (Purple)
- Innovators and creative problem-solvers
- High openness, high extraversion
- Excel in dynamic, evolving environments
- Strengths: Innovative, adaptable, creative

**Sage** (Green)
- Mentors and thoughtful analysts
- High agreeableness, moderate openness
- Value depth, wisdom, and knowledge sharing
- Strengths: Wise, empathetic, insightful

### Energy Styles

- **Energetic** (Red): High energy, fast-paced
- **Focused** (Gray): Deep concentration, methodical
- **Balanced** (Cyan): Adaptable energy levels

### Flow Modes

- **Structured**: Thrives on organization and planning
- **Deep Work**: Prefers uninterrupted focus time
- **Exploration**: Enjoys discovery and experimentation
- **Collaboration**: Energized by teamwork

### Seasons (Current Life Phase)

- **Spring**: Growth and new beginnings
- **Summer**: Peak performance and productivity
- **Autumn**: Reflection and consolidation
- **Winter**: Rest and strategic planning

## 🔧 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# If not running, start it:
# macOS:
brew services start postgresql@15
# Linux:
sudo systemctl start postgresql
```

### Port Already in Use

```bash
# Backend (port 3000)
# Update PORT in .env to use different port

# Frontend (port 3001)
# Update package.json dev script: "next dev -p 3002"
```

### Migration Errors

```bash
# Reset database and re-run migrations
cd src/backend
npm run db:reset  # Drops all tables
npm run migrate   # Re-creates tables
npm run seed      # Re-adds seed data
```

### Token Refresh Issues

```bash
# Clear browser localStorage
# Open DevTools → Application → Local Storage
# Delete all items under http://localhost:3001
# Refresh page and login again
```

## 📝 Development Tips

### Hot Reload

Both backend and frontend support hot reload:
- **Backend**: Uses `tsx watch` - changes reload automatically
- **Frontend**: Uses Next.js Fast Refresh - instant updates

### Viewing Logs

```bash
# Backend logs (Winston)
cd src/backend
tail -f combined.log    # All logs
tail -f error.log       # Errors only

# Frontend logs
# Check browser DevTools → Console
```

### Database Inspection

```bash
# Connect to database
psql -h localhost -p 5432 -U archetect_user archetect

# View tables
\dt

# View users
SELECT * FROM users;

# View profiles
SELECT * FROM profiles;

# Exit
\q
```

### API Testing with curl

```bash
# Signup
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get questionnaire (requires auth token)
curl http://localhost:3000/api/v1/profiles/questionnaire \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🎓 Next Steps

Once you're comfortable with the basics:

1. **Read the Documentation**
   - `IMPLEMENTATION_STATUS.md` - Complete feature overview
   - `src/backend/README.md` - Backend architecture
   - `src/frontend/README.md` - Frontend patterns

2. **Explore the Code**
   - Start with `src/backend/src/index.ts` - Entry point
   - Check `src/frontend/src/app/dashboard/page.tsx` - Main UI
   - Review `src/backend/src/services/TransformationService.ts` - Core algorithm

3. **Customize the Platform**
   - Add new Archetect Types
   - Customize compatibility scoring
   - Extend questionnaire with more items
   - Build new features (password reset, team invites)

4. **Deploy to Production**
   - Set up production database
   - Configure environment variables
   - Build frontend: `npm run build`
   - Deploy to your hosting provider

## 🆘 Getting Help

**Common Questions:**
- What is the Big Five? → See `docs/Archetect Profiling System v0.1.md`
- How does transformation work? → Check `TransformationService.ts`
- Where are types defined? → See `shared/types/index.ts`

**Found a Bug?**
1. Check if database migrations are up to date
2. Verify environment variables are set correctly
3. Check browser console and server logs
4. Review IMPLEMENTATION_STATUS.md for known issues

## 🎉 Success Checklist

- [ ] Backend running on port 3000
- [ ] Frontend running on port 3001
- [ ] Database migrations completed
- [ ] Can create new user account
- [ ] Can complete questionnaire
- [ ] Can view personality profile
- [ ] Can test team compatibility
- [ ] Can change password in settings

If all boxes are checked, you're ready to go! 🚀

---

**Happy Personality Profiling!** 🧠✨
