# Archetect Architecture Overview

## Quick Start

This document provides a technical overview of the Archetect codebase architecture.

## Project Structure

```
/Archetect-Workspace
├── src/
│   ├── shared/                    # Shared TypeScript types and utilities
│   │   ├── types/                # TypeScript interfaces and types
│   │   ├── constants/            # Application constants
│   │   └── utils/                # Shared utility functions
│   │
│   ├── backend/                  # Node.js/TypeScript backend API
│   │   ├── src/
│   │   │   ├── controllers/     # Request handlers
│   │   │   ├── services/        # Business logic
│   │   │   ├── models/          # Database models
│   │   │   ├── middleware/      # Express middleware
│   │   │   ├── utils/           # Backend utilities
│   │   │   ├── config/          # Configuration
│   │   │   └── index.ts         # Main entry point
│   │   ├── migrations/          # Database migrations (SQL)
│   │   ├── tests/               # Backend tests
│   │   └── astrology_engine/    # Python astrology calculator
│   │       ├── src/             # Python source
│   │       └── tests/           # Python tests
│   │
│   ├── frontend/                 # Next.js frontend (planned)
│   │   ├── src/
│   │   │   ├── components/      # React components
│   │   │   ├── pages/           # Next.js pages
│   │   │   ├── hooks/           # Custom React hooks
│   │   │   └── utils/           # Frontend utilities
│   │   └── public/              # Static assets
│   │
│   └── chrome_extension/         # Chrome extension (planned)
│       ├── src/
│       │   ├── popup/           # Extension popup UI
│       │   ├── background/      # Background scripts
│       │   ├── content/         # Content scripts
│       │   └── utils/           # Extension utilities
│       └── public/              # Extension assets
│
├── infra/                        # Infrastructure as Code
│   ├── docker/                  # Dockerfiles
│   ├── kubernetes/              # K8s manifests (future)
│   └── terraform/               # Terraform configs (future)
│
├── docs/                         # Project documentation
│   ├── founder_proposal.md      # Business plan
│   ├── architect_doc.md         # Technical architecture
│   ├── pm_user_stories.md       # Product requirements
│   ├── qa_testing.md            # QA strategy
│   └── qa_checklist.md          # QA checklist
│
├── docker-compose.yml           # Local development stack
├── .env.example                 # Environment template
├── PROJECT_STATUS.md            # Current project status
└── README.md                    # Project overview
```

## Technology Stack

### Backend
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 15+ (primary data)
- **Cache**: Redis 7+ (caching, sessions)
- **Astrology Engine**: Python 3.10+ with PyMeeus

### Frontend (Planned)
- **Framework**: Next.js 14+ with React 18+
- **Styling**: TailwindCSS + Shadcn UI
- **State Management**: TanStack Query + Zustand
- **Deployment**: Vercel

### Chrome Extension (Planned)
- **Manifest**: V3
- **Framework**: React + Vite
- **Storage**: Chrome Storage API + IndexedDB

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes (future)
- **Cloud**: AWS / GCP / Fly.io (TBD)
- **CI/CD**: GitHub Actions

## Core Components

### 1. Shared Package (`src/shared/`)

Provides common types, constants, and utilities used across all services.

**Key Files:**
- `types/index.ts` - TypeScript interfaces for all data models
- `constants/index.ts` - Application-wide constants
- `utils/index.ts` - Shared utility functions

### 2. Backend API (`src/backend/`)

RESTful API providing personality profiling and team compatibility services.

**Key Components:**
- **Controllers**: HTTP request handling
- **Services**: Business logic layer
- **Models**: Database interaction layer
- **Middleware**: Request processing (auth, logging, rate limiting)
- **Astrology Engine**: Python-based sidereal calculations

**API Endpoints** (Planned):
```
POST   /api/v1/profiles/create       - Create profile
GET    /api/v1/profiles/:id          - Get profile
POST   /api/v1/compatibility/calculate - Calculate compatibility
GET    /api/v1/communication-tips/:type - Get communication tips
```

### 3. Database Schema

PostgreSQL schema with the following main tables:
- `users` - User accounts
- `profiles` - Personality profiles (both approaches)
- `teams` - Team groups
- `team_members` - Team membership
- `team_compatibility` - Pairwise compatibility scores
- `crm_integrations` - CRM platform connections
- `crm_contacts` - Synced CRM contacts
- `refresh_tokens` - JWT refresh tokens
- `api_keys` - Enterprise API keys
- `audit_log` - Security audit trail

### 4. Astrology Engine (`src/backend/astrology_engine/`)

Python module for calculating sidereal birth charts.

**Features:**
- Sidereal zodiac position calculation (Lahiri ayanamsha)
- Nakshatra (lunar mansion) determination
- Modality and element extraction
- Sun, Moon, Ascendant, Mercury positions

**Usage:**
```python
from birth_chart import BirthChartCalculator

calculator = BirthChartCalculator(
    birth_date="1992-03-15",
    birth_time="14:30:00",
    latitude=29.7604,
    longitude=-95.3698,
    timezone_str="America/Chicago"
)

chart = calculator.calculate_chart()
```

## Data Flow

### Profile Creation (Astrological Approach)

```
User Input (Birth Data)
  ↓
Backend API validates data
  ↓
Python Astrology Engine calculates sidereal chart
  ↓
Transformation Engine: Sidereal Data → DISC Profile
  ↓
Store in PostgreSQL (profiles table)
  ↓
Cache in Redis
  ↓
Return DISC profile to user
```

### Profile Creation (Big Five Approach)

```
User Input (Questionnaire Responses)
  ↓
Backend API validates responses
  ↓
Scoring Engine: Responses → Big Five Traits (OCEAN)
  ↓
Transformation Engine: OCEAN → Archetect Types + Energy/Flow/Season
  ↓
Store in PostgreSQL (profiles table)
  ↓
Cache in Redis
  ↓
Return Archetect Type profile to user
```

## Development Workflow

### Local Development Setup

1. **Clone repository:**
```bash
git clone https://github.com/Thelastlineofcode/Archetect-Workspace.git
cd Archetect-Workspace
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment:**
```bash
cp .env.example .env
# Edit .env with your local configuration
```

4. **Start services with Docker:**
```bash
docker-compose up -d postgres redis
```

5. **Run database migrations:**
```bash
npm run db:migrate
```

6. **Start backend:**
```bash
cd src/backend
npm run dev
```

### Running Tests

```bash
# Backend tests
npm run test:backend

# Python tests
cd src/backend/astrology_engine
pytest

# E2E tests (future)
npm run test:e2e
```

## Deployment

### Environment Variables

See `.env.example` for required environment variables.

**Critical for Production:**
- `JWT_SECRET` - Must be changed from default
- `JWT_REFRESH_SECRET` - Must be changed from default
- `DB_PASSWORD` - Strong database password
- `REDIS_PASSWORD` - Redis authentication

### Docker Deployment

```bash
# Build production image
docker build -f infra/docker/Dockerfile.backend -t archetect-backend:latest .

# Run production container
docker run -p 3000:3000 --env-file .env archetect-backend:latest
```

### Database Migrations

Migrations are located in `src/backend/migrations/` and executed via:

```bash
npm run db:migrate
```

## Security Considerations

1. **Authentication**: JWT-based with refresh tokens
2. **Rate Limiting**: Per-tier limits enforced
3. **Data Encryption**: AES-256 at rest, TLS 1.3 in transit
4. **Input Validation**: Zod schemas for all inputs
5. **GDPR Compliance**: Right to deletion, data minimization
6. **Audit Logging**: All profile accesses logged

## Performance Targets

| Metric                   | Target      |
| ------------------------ | ----------- |
| Profile Generation       | < 2 seconds |
| API Response (p95)       | < 500ms     |
| Team Compatibility (p95) | < 1 second  |
| Concurrent Users         | 50,000      |

## Next Steps

See [PROJECT_STATUS.md](./PROJECT_STATUS.md) for current development status and roadmap.

### Immediate Priorities

1. Complete backend API routes (auth, profiles, compatibility)
2. Implement transformation algorithms (Astro→DISC, OCEAN→Types)
3. Build frontend Next.js application
4. Develop Chrome extension
5. Set up CI/CD pipeline

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) (to be created) for development guidelines.

## Documentation

- [README.md](./README.md) - Project overview
- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Current status
- [docs/founder_proposal.md](./docs/founder_proposal.md) - Business plan
- [docs/architect_doc.md](./docs/architect_doc.md) - Detailed architecture
- [docs/pm_user_stories.md](./docs/pm_user_stories.md) - User stories

---

**Last Updated**: November 18, 2025
**Status**: Pre-Development / Foundation Complete
