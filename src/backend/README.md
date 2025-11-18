# Archetect Backend API

The backend API for the Archetect personality intelligence platform. Built with Node.js, TypeScript, Express, and PostgreSQL.

## Architecture

**NO DISC Framework** - This system uses the original Archetect Types based on Big Five (OCEAN) personality traits.

### Personality Framework

- **Archetect Types**: Architect, Maverick, Sage
- **Energy Styles**: Energetic, Focused, Balanced
- **Flow Modes**: Structured, Deep Work, Exploration, Collaboration
- **Seasons**: Spring, Summer, Autumn, Winter

### Technology Stack

- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Authentication**: JWT with refresh tokens
- **Password Hashing**: bcrypt
- **Logging**: Winston
- **Rate Limiting**: express-rate-limit

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+ (optional, for caching)
- npm or yarn

### 1. Install Dependencies

```bash
cd src/backend
npm install
```

### 2. Set Up Environment

```bash
# Copy the example environment file
cp ../../.env.example ../../.env

# Edit the .env file with your configuration
# At minimum, update these values:
# - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
# - JWT_SECRET, JWT_REFRESH_SECRET
```

### 3. Set Up Database

```bash
# Create the database (if not exists)
createdb archetect

# Run migrations
npm run db:migrate

# (Optional) Seed with test data
npm run db:seed
```

### 4. Start the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:3000`

### 5. Test the API

```bash
# Run API tests (requires server to be running)
npm run test:api
```

## API Endpoints

### Health Check

```
GET /health
GET /api/health
```

### Authentication

```
POST   /api/v1/auth/signup          - Create new account
POST   /api/v1/auth/login           - Login with email/password
POST   /api/v1/auth/refresh         - Refresh access token
POST   /api/v1/auth/logout          - Logout (invalidate refresh token)
POST   /api/v1/auth/logout-all      - Logout from all devices
POST   /api/v1/auth/change-password - Change password
GET    /api/v1/auth/me              - Get current user info
```

### Profiles

```
GET    /api/v1/profiles/questionnaire - Get Big Five questionnaire (40 items)
POST   /api/v1/profiles               - Create profile from questionnaire
GET    /api/v1/profiles/me            - Get my profile
GET    /api/v1/profiles/:id           - Get profile by ID
PUT    /api/v1/profiles/:id           - Update profile
DELETE /api/v1/profiles/:id           - Delete profile
```

### Compatibility

```
POST   /api/v1/compatibility/pair - Calculate compatibility between two profiles
POST   /api/v1/compatibility/team - Calculate team compatibility
```

## Development

### Project Structure

```
src/backend/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── config/
│   │   └── index.ts            # Configuration management
│   ├── controllers/
│   │   ├── AuthController.ts   # Auth request handlers
│   │   ├── ProfileController.ts
│   │   └── CompatibilityController.ts
│   ├── services/
│   │   ├── AuthService.ts      # Business logic
│   │   ├── ProfileService.ts
│   │   ├── QuestionnaireService.ts
│   │   ├── TransformationService.ts
│   │   └── CompatibilityService.ts
│   ├── db/
│   │   ├── connection.ts       # Database connection
│   │   ├── BaseRepository.ts   # Base repository pattern
│   │   └── repositories/
│   │       ├── UserRepository.ts
│   │       ├── ProfileRepository.ts
│   │       └── RefreshTokenRepository.ts
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication
│   │   ├── errorHandler.ts    # Global error handling
│   │   ├── requestLogger.ts   # Request logging
│   │   └── rateLimiter.ts     # Rate limiting
│   ├── routes/
│   │   ├── index.ts            # Route aggregation
│   │   ├── auth.ts
│   │   ├── profiles.ts
│   │   └── compatibility.ts
│   └── utils/
│       ├── logger.ts           # Winston logger
│       └── jwt.ts              # JWT utilities
├── migrations/
│   └── 001_initial_schema.sql  # Database schema
├── scripts/
│   ├── migrate.ts              # Run migrations
│   ├── seed.ts                 # Seed test data
│   ├── reset.ts                # Reset database
│   └── test-api.ts             # API integration tests
└── package.json
```

### Available Scripts

```bash
# Development
npm run dev              # Start with hot reload
npm run build            # Build TypeScript
npm start                # Run production build

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed test data
npm run db:reset         # Reset database (WARNING: deletes all data!)

# Testing
npm test                 # Run unit tests (Jest)
npm run test:watch       # Run tests in watch mode
npm run test:api         # Run API integration tests

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
```

### Database Migrations

Migrations are SQL files in `migrations/` directory. They run sequentially and are tracked in the `migrations` table.

**To create a new migration:**

1. Create a new `.sql` file in `migrations/` with a sequential number:
   ```
   migrations/002_add_teams_table.sql
   ```

2. Write your SQL:
   ```sql
   -- Add your schema changes here
   CREATE TABLE teams (...);
   ```

3. Run migrations:
   ```bash
   npm run db:migrate
   ```

### Environment Variables

See `.env.example` for all available configuration options. Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | archetect |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `JWT_SECRET` | JWT signing secret | *CHANGE IN PRODUCTION* |
| `JWT_REFRESH_SECRET` | Refresh token secret | *CHANGE IN PRODUCTION* |

## Testing

### Manual Testing with curl

**Signup:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","fullName":"Test User"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Get Questionnaire:**
```bash
curl http://localhost:3000/api/v1/profiles/questionnaire \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Automated API Tests

```bash
# Make sure the server is running first
npm run dev

# In another terminal, run the tests
npm run test:api
```

The test script will:
1. Check health endpoint
2. Create test users
3. Get questionnaire
4. Create profiles
5. Calculate compatibility
6. Print detailed results

## Transformation Logic

### Big Five → Archetect Types

The system transforms OCEAN personality traits into Archetect Types:

**Input:** Big Five traits (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)

**Output:**
- **Archetect Type**: Based on trait combinations
  - High O + High C = Architect
  - High O + High E = Maverick
  - High A + Balanced E = Sage

- **Energy Style**: Based on energy patterns
  - High E + High O = Energetic
  - High C + Low N = Focused
  - Balanced = Balanced

- **Flow Mode**: Based on working preferences
  - High E + High C = Structured
  - High C + Low O = Deep Work
  - High O = Exploration
  - High E = Collaboration

- **Season**: Based on current focus
  - Spring = Build (structure, execution)
  - Summer = Explore (ideas, learning)
  - Autumn = Connect (relationships)
  - Winter = Reset (rest, recovery)

## Compatibility Algorithm

The compatibility engine analyzes three dimensions:

1. **Archetype Compatibility** (40% weight)
   - Architect + Maverick = 0.85 (highly complementary)
   - Architect + Sage = 0.90 (excellent balance)
   - Maverick + Sage = 0.75 (good balance)

2. **Energy Compatibility** (30% weight)
   - Same energy = 0.85
   - Energetic + Focused = 0.60 (challenging)
   - Balanced with any = 0.80

3. **Flow Compatibility** (30% weight)
   - Complementary modes score higher
   - Collaboration + Exploration = 0.90
   - Deep Work + Collaboration = 0.65

**Final Score** = (Archetype × 0.4) + (Energy × 0.3) + (Flow × 0.3)

## Security

### Authentication

- JWT-based authentication with refresh tokens
- Access tokens expire in 1 hour
- Refresh tokens expire in 7 days
- Password hashing with bcrypt (10 rounds)

### Rate Limiting

- Default: 100 requests per minute
- Auth endpoints: 5 requests per 15 minutes
- Configurable via environment variables

### Best Practices

1. **Always use HTTPS in production**
2. **Change JWT secrets from defaults**
3. **Use strong database passwords**
4. **Enable Redis for production caching**
5. **Set up proper CORS origins**
6. **Monitor logs for suspicious activity**

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Check connection details
psql -h localhost -U postgres -d archetect

# Reset database if needed
npm run db:reset
npm run db:migrate
```

### Port Already in Use

```bash
# Change PORT in .env file
PORT=3001

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### TypeScript Errors

```bash
# Clean build
rm -rf dist
npm run build

# Check types
npm run type-check
```

## Production Deployment

### Build for Production

```bash
npm run build
```

### Environment Configuration

1. Set `NODE_ENV=production`
2. Update all secrets (JWT_SECRET, etc.)
3. Configure database with SSL
4. Set up Redis for caching
5. Configure CORS for your domain
6. Set up proper logging

### Docker Deployment

```bash
# Build image
docker build -f ../../infra/docker/Dockerfile.backend -t archetect-backend .

# Run container
docker run -p 3000:3000 --env-file .env archetect-backend
```

### Health Checks

Monitor these endpoints:
- `GET /health` - Basic health check
- `GET /api/health` - API health check

Both should return `{"status": "healthy"}`

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Type check: `npm run type-check`
6. Submit pull request

## License

UNLICENSED - Private/Proprietary

## Support

For issues or questions, please file an issue on GitHub.
