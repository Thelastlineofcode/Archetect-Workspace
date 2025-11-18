# Archetect - Quick Start Guide

Get the Archetect backend API up and running in 5 minutes.

## Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/Thelastlineofcode/Archetect-Workspace.git
cd Archetect-Workspace

# Install root dependencies
npm install

# Install backend dependencies
cd src/backend
npm install
```

## Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# At minimum, update these:
# - Database credentials (DB_USER, DB_PASSWORD)
# - JWT secrets (JWT_SECRET, JWT_REFRESH_SECRET)

nano .env  # or use your preferred editor
```

**Example minimal .env:**
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=archetect
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your-secret-key-change-me
JWT_REFRESH_SECRET=your-refresh-secret-change-me
```

## Step 3: Set Up Database

```bash
# Create the database
createdb archetect

# Run migrations
npm run db:migrate

# (Optional) Seed with test data
npm run db:seed
```

## Step 4: Start the Server

```bash
# Start in development mode
npm run dev
```

You should see:
```
🚀 Archetect API server started
📡 Environment: development
🌐 Port: 3000
🔗 URL: http://localhost:3000
📊 Health check: http://localhost:3000/health
```

## Step 5: Test the API

Open a new terminal and run:

```bash
# Health check
curl http://localhost:3000/health

# View available endpoints
curl http://localhost:3000/api/v1

# Run full API test suite
npm run test:api
```

## What's Next?

### Try the API

**1. Create an account:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@example.com",
    "password": "YourPassword123!",
    "fullName": "Your Name"
  }'
```

**2. Get the questionnaire:**
```bash
# Save your access token from signup response
export TOKEN="your_access_token_here"

curl http://localhost:3000/api/v1/profiles/questionnaire \
  -H "Authorization: Bearer $TOKEN"
```

**3. Create your profile:**
```bash
# Answer the 40 questions with responses 1-5
curl -X POST http://localhost:3000/api/v1/profiles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [
      {"questionId": "O1", "response": 4},
      {"questionId": "O2", "response": 5},
      ...
    ]
  }'
```

### Explore the Documentation

- **Backend API**: `src/backend/README.md`
- **Architecture**: `ARCHITECTURE.md`
- **Project Status**: `PROJECT_STATUS.md`

### Development Workflow

```bash
# Watch for changes (auto-reload)
npm run dev

# Run tests
npm test
npm run test:api

# Check code quality
npm run lint
npm run type-check

# Database operations
npm run db:migrate  # Run migrations
npm run db:seed     # Seed test data
npm run db:reset    # Reset database (WARNING: deletes all data!)
```

## Common Issues

### Database Connection Failed

```bash
# Check PostgreSQL is running
pg_isready

# Check you can connect
psql -h localhost -U postgres -d archetect
```

### Port Already in Use

```bash
# Change port in .env
PORT=3001

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### JWT Errors

Make sure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set in your `.env` file and are different from each other.

## Architecture Overview

Archetect uses **NO DISC framework**. Instead, it maps Big Five (OCEAN) personality traits to:

- **Archetect Types**: Architect, Maverick, Sage
- **Energy Styles**: Energetic, Focused, Balanced
- **Flow Modes**: Structured, Deep Work, Exploration, Collaboration
- **Seasons**: Spring, Summer, Autumn, Winter

### How It Works

1. **User takes questionnaire** (40 Big Five items)
2. **System scores responses** → OCEAN trait scores
3. **Transformation engine** → Archetect Type + Energy + Flow + Season
4. **Compatibility engine** → Team dynamics and recommendations

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Create account
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Profiles
- `GET /api/v1/profiles/questionnaire` - Get 40-item questionnaire
- `POST /api/v1/profiles` - Create profile from responses
- `GET /api/v1/profiles/me` - Get my profile

### Compatibility
- `POST /api/v1/compatibility/pair` - Calculate pair compatibility
- `POST /api/v1/compatibility/team` - Calculate team compatibility

## Technology Stack

- **Backend**: Node.js 20, TypeScript, Express
- **Database**: PostgreSQL 15+
- **Auth**: JWT with refresh tokens, bcrypt
- **Validation**: Zod
- **Logging**: Winston
- **Testing**: Jest, custom API test suite

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/Thelastlineofcode/Archetect-Workspace/issues)
- **Documentation**: `src/backend/README.md`
- **Architecture**: `ARCHITECTURE.md`

## Next Steps

1. ✅ Backend API (You are here!)
2. 🔄 Frontend (Next.js app)
3. 🔄 Chrome Extension
4. 🔄 CRM Integrations (HubSpot, Salesforce)

Happy coding! 🚀
