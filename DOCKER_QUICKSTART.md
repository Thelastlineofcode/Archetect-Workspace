# Docker Quick Start Guide

**Run Archetect locally with Docker in 5 minutes**

This guide helps you run the complete Archetect stack locally using
Docker Compose.

---

## Prerequisites

- Docker installed (https://docs.docker.com/get-docker/)
- Docker Compose installed (usually comes with Docker Desktop)
- Git repository cloned

---

## Quick Start

### 1. Start All Services

```bash
cd /path/to/Archetect-Workspace

# Start PostgreSQL, Redis, and Backend
docker-compose up -d
```

This will start:
- **PostgreSQL** on port 5432
- **Redis** on port 6379
- **Backend API** on port 3000

### 2. Check Service Status

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f postgres
```

### 3. Run Database Migrations

```bash
# Option A: From host machine
cd src/backend
npm run migrate

# Option B: Inside container
docker-compose exec backend npm run migrate
```

### 4. Test the Backend

```bash
# Health check
curl http://localhost:3000/health

# Should return: {"status":"ok"}
```

### 5. Start Frontend (Separate Terminal)

```bash
cd src/frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:3001

---

## Common Commands

### Start Services
```bash
docker-compose up -d          # Start in background
docker-compose up             # Start with logs visible
```

### Stop Services
```bash
docker-compose down           # Stop all services
docker-compose down -v        # Stop and remove volumes (deletes data!)
```

### View Logs
```bash
docker-compose logs -f        # All services
docker-compose logs -f backend # Backend only
docker-compose logs -f postgres # Database only
```

### Restart Services
```bash
docker-compose restart backend  # Restart backend only
docker-compose restart          # Restart all
```

### Access Database
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d archetect

# List tables
\dt

# Exit
\q
```

### Clean Up Everything
```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all -v
```

---

## Environment Variables

Docker Compose uses `.env` file in root directory.

**Edit .env** to customize:
- Database credentials
- API ports
- Redis configuration

---

## Troubleshooting

### Port Already in Use

**Error**: `port is already allocated`

**Solution**: Change port mapping in docker-compose.yml or stop
conflicting service

```bash
# Check what's using port 5432
lsof -i :5432

# Or change port in docker-compose.yml
ports:
  - "5433:5432"  # Map to different host port
```

### Database Connection Refused

**Check if PostgreSQL is ready:**
```bash
docker-compose exec postgres pg_isready

# Should return: postgres:5432 - accepting connections
```

**Check logs:**
```bash
docker-compose logs postgres
```

### Backend Won't Start

**Check dependencies:**
```bash
# Ensure PostgreSQL is healthy
docker-compose ps

# Rebuild backend if needed
docker-compose build backend
docker-compose up -d backend
```

### Migrations Fail

**Reset database:**
```bash
# Stop services
docker-compose down

# Remove volumes (WARNING: deletes all data!)
docker volume rm archetect-workspace_postgres_data

# Restart
docker-compose up -d
```

---

## Development Workflow

### 1. Start Infrastructure
```bash
# Start only database and Redis
docker-compose up -d postgres redis
```

### 2. Run Backend Locally
```bash
cd src/backend
npm install
npm run dev
```

### 3. Run Frontend Locally
```bash
cd src/frontend
npm install
npm run dev
```

**Advantages:**
- Faster hot-reload
- Direct debugging
- Use local IDE/tools
- Still use containerized database

---

## Database Management

### Backup Database
```bash
docker-compose exec postgres pg_dump -U postgres archetect > backup.sql
```

### Restore Database
```bash
cat backup.sql | docker-compose exec -T postgres psql -U postgres archetect
```

### Reset Database
```bash
# Stop backend
docker-compose stop backend

# Drop and recreate
docker-compose exec postgres psql -U postgres -c "DROP DATABASE archetect;"
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE archetect;"

# Run migrations
cd src/backend && npm run migrate
```

---

## Production Build Testing

### Test Production Build Locally

```bash
# Build backend for production
cd src/backend
npm run build

# Run production build
NODE_ENV=production npm start

# Build frontend for production
cd ../frontend
npm run build

# Serve production build
npm start
```

---

## Docker Compose Services

### PostgreSQL
- **Image**: postgres:15-alpine
- **Port**: 5432
- **User**: postgres
- **Database**: archetect
- **Data**: Persisted in volume `postgres_data`

### Redis
- **Image**: redis:7-alpine
- **Port**: 6379
- **Data**: Persisted in volume `redis_data`

### Backend
- **Build**: From `./src/backend`
- **Port**: 3000
- **Depends on**: PostgreSQL, Redis
- **Hot Reload**: Enabled via volume mount

---

## Next Steps

Once Docker setup is working:

1. [ ] Test all API endpoints
2. [ ] Create test users
3. [ ] Run questionnaire
4. [ ] Test compatibility features
5. [ ] Review logs for errors
6. [ ] Prepare for cloud deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
guide.

---

## FAQ

**Q: Can I use a different PostgreSQL version?**
A: Yes, edit docker-compose.yml and change `postgres:15-alpine` to
desired version

**Q: How do I persist data between restarts?**
A: Docker volumes automatically persist data. Don't use `docker-compose
down -v`

**Q: Can I connect from a database GUI?**
A: Yes, use connection:
   - Host: localhost
   - Port: 5432
   - User: postgres
   - Password: postgres (from .env)
   - Database: archetect

**Q: How do I update Docker images?**
A: Run `docker-compose pull` then `docker-compose up -d`

---

**Last Updated**: November 19, 2025
**Difficulty**: ⭐ Easy
**Time Required**: 5-10 minutes
