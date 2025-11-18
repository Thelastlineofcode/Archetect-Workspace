# Archetect: Astrological Personality Intelligence Platform

## @ARCHITECT: Technical Architecture Documentation

**Version:** 1.0 | **Date:** November 2025 | **Status:** Pre-Development

---

## 1. EXECUTIVE SUMMARY

**Archetect** is an astrological-backed DISC personality intelligence platform disguised as a standard B2B communication tool. It uses sidereal birth charts as its hidden backend engine while presenting DISC-compatible outputs on the frontend, allowing corporate adoption without spiritual friction.

**Key Innovation:** Multi-layer personality mapping (Modalities → Elements → Nakshatras) providing deeper accuracy than competitors while maintaining DISC credibility.

---

## 2. SYSTEM ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                            │
│  (Corporate-facing: DISC results, team compatibility,       │
│   meeting prep, communication tips - NO astrology visible)  │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              API & INTEGRATION LAYER                         │
│  (CRM connectors, Chrome extension, Email integration,      │
│   REST/GraphQL endpoints for third-party apps)             │
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│           PERSONALITY TRANSFORMATION ENGINE                  │
│  (Astrological Data → DISC Conversion)                      │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Modality → DISC Primary Type                            ││
│  │ Element → Communication Refinement                      ││
│  │ Nakshatra → Discipline Type                             ││
│  │ Planetary → Communication Style Modifiers               ││
│  └─────────────────────────────────────────────────────────┘│
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│        ASTROLOGICAL COMPUTATION ENGINE                       │
│  (Birth Chart Calculation - HIDDEN FROM USERS)              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ Ephemeris Data → Sidereal Position Calculation          ││
│  │ House Calculation (Placidus/Equal Houses)               ││
│  │ Aspect Analysis                                          ││
│  │ Nakshatra Classification (27-fold division)             ││
│  │ Remedial Recommendations (Vedic/Multicultural)          ││
│  └─────────────────────────────────────────────────────────┘│
└──────────────────┬──────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────┐
│              DATA & PERSISTENCE LAYER                        │
│  (PostgreSQL for profiles, Redis for caching,               │
│   S3 for ephemeris/computation cache)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. CORE MODULES

### 3.1 Birth Chart Calculation Engine

**Language:** Python  
**Primary Library:** `ephem` or `pymeeus` (free alternatives to expensive commercial libraries)

**Responsibilities:**

- Parse birth Date (YYYY-MM-DD), Time (HH:MM:SS), Location (Latitude/Longitude or city)
- Calculate sidereal positions for:
  - Sun sign (core personality)
  - Moon sign (emotional needs)
  - Ascendant/Rising (external presentation)
  - Mercury (communication style)
  - Venus (values, relationship style) [Premium]
  - Mars (drive, conflict style) [Premium]
  - All outer planets [Enterprise]
- Calculate Nakshatras (27-fold lunar mansions)
- Compute houses and planetary aspects [Premium]
- Return raw astrological data in standardized JSON format

**Input:**

```json
{
  "birth_date": "1992-03-15",
  "birth_time": "14:30:00",
  "birth_location": {
    "latitude": 29.7604,
    "longitude": -95.3698,
    "city": "Houston",
    "timezone": "US/Central"
  }
}
```

**Output (Hidden):**

```json
{
  "sun_sign": {
    "sign": "Pisces",
    "sidereal_degree": 27.45,
    "nakshatra": "Revati",
    "nakshatra_ruler": "Mercury"
  },
  "moon_sign": {
    "sign": "Capricorn",
    "sidereal_degree": 12.3,
    "nakshatra": "Pushya",
    "nakshatra_ruler": "Jupiter"
  },
  "ascendant": {
    "sign": "Leo",
    "sidereal_degree": 8.15
  },
  "mercury_sign": {
    "sign": "Capricorn",
    "sidereal_degree": 20.5
  },
  "_computation_metadata": {
    "ephemeris_source": "pymeeus_v0.5",
    "ayanamsha": "lahiri",
    "house_system": "placidus",
    "computed_at": "2025-11-14T20:30:00Z"
  }
}
```

---

### 3.2 Personality Transformation Engine

**Language:** Node.js/TypeScript (API-friendly, performant)

**Responsibilities:**

- Map astrological data to DISC framework
- Layer analysis: Modality + Element + Nakshatra + Planetary
- Generate communication preferences and do's/don'ts
- Calculate team compatibility scores
- Produce corporate-friendly narrative output

**Key Algorithms:**

#### Algorithm 1: Modality → DISC Primary Type

```
Cardinal → D (Dominance) - Initiators, leaders
Fixed → C (Conscientiousness) - Direction-focused, stable
Mutable → I/S (Influence/Steadiness) - Adaptable, flexible
```

#### Algorithm 2: Element → Communication Refinement

```
Fire → Intensifies D, adds speed and passion to I
Earth → Enhances C, adds stability and detail to S
Air → Enhances I, adds logic and collaboration to C
Water → Enhances S, adds empathy and depth to I
```

#### Algorithm 3: Nakshatra → Discipline Type

- 27 Nakshatras → Unique "Work Archetype" labels
- Example: Pushya Nakshatra (Jupiter-ruled) → "Nurturing Builder"
- Example: Ashlesha Nakshatra (Mercury-ruled) → "Strategic Thinker"

#### Algorithm 4: Weighted DISC Calculation

```
Final DISC Score = (
  Modality_DISC * 0.40 +
  Element_DISC * 0.25 +
  Mercury_DISC * 0.20 +
  Ascendant_DISC * 0.15
)
```

**Input:** Raw astrological data (from Birth Chart Engine)

**Output (Corporate-Facing):**

```json
{
  "profile_id": "archetect_user_12345",
  "user_name": "Sample User",
  "disc_profile": {
    "primary_type": "D",
    "secondary_type": "C",
    "blend_description": "Strategic Leader",
    "percentile_scores": {
      "D": 72,
      "I": 35,
      "S": 28,
      "C": 65
    }
  },
  "communication_style": {
    "pace": "Methodical decision-maker",
    "preference": "Direct and detailed",
    "strengths": [
      "Strategic thinking",
      "Reliable execution",
      "Logical analysis"
    ],
    "challenges": [
      "Can be overly rigid",
      "Struggles to delegate",
      "Difficulty with ambiguity"
    ]
  },
  "discipline_type": "Nurturing Builder",
  "work_environment_fit": [
    "Structured organizations",
    "Results-oriented teams",
    "Leadership roles"
  ],
  "meeting_prep": {
    "with_D_types": "Get straight to ROI, respect their time",
    "with_I_types": "Lead with vision, include them in decisions",
    "with_S_types": "Show team harmony benefits, be patient",
    "with_C_types": "Provide comprehensive data, allow time to process"
  },
  "recommended_roles": ["Operations Manager", "Project Lead", "Strategist"],
  "_internal_metadata": {
    "astro_confidence_score": 0.87,
    "modality": "Cardinal",
    "element": "Earth",
    "primary_nakshatra": "Pushya",
    "generated_at": "2025-11-14T20:45:00Z"
  }
}
```

---

### 3.3 Data Enrichment Pipeline

**Purpose:** Populate user profiles from partial data (name, email, LinkedIn)

**Data Sources:**

1. **User Input:** Birth date/time (explicit data collection)
2. **LinkedIn Integration:** Extract professional history, location, role
3. **Email Integration:** Infer patterns from communication history
4. **CRM Data:** Existing contact information and interaction patterns

**Processing Flow:**

```
Input (name/email/LinkedIn URL)
  ↓
[LinkedIn Scraper/API]
  ↓
Extract: location, job title, company, connections
  ↓
[If birth date available] → Calculate chart
  ↓
[If birth date missing] → Prompt user or estimate from available signals
  ↓
Store enriched profile
```

---

### 3.4 Integration Connectors

#### 3.4.1 CRM Integrations (HubSpot, Salesforce)

- **Purpose:** Add personality insights to contact records
- **Implementation:**
  - HubSpot: Custom property sync via API, sidebar widget
  - Salesforce: Custom objects, lightning component
- **Data Flow:** Contact → Archetect API → DISC Profile → CRM Custom Field

#### 3.4.2 Chrome Extension

- **Purpose:** In-context personality lookup on any webpage
- **Implementation:**
  - Monitor DOM for email addresses, names, LinkedIn URLs
  - Query Archetect API on user interaction
  - Display personality card in popup/sidebar
- **Tech Stack:** React, Chrome Manifest V3, message passing

#### 3.4.3 Email Platform Integration

- **Purpose:** Show recipient personality in compose windows
- **Support:** Gmail, Outlook (via plugin/sidebar)
- **Tech Stack:** Email client APIs, popup window management

#### 3.4.4 Zoom/Meeting Integration

- **Purpose:** Display participant personalities during calls
- **Implementation:** Zoom App Marketplace integration
- **Tech Stack:** Zoom App SDK, real-time data sync

#### 3.4.5 REST/GraphQL API

- **Purpose:** Direct access for custom integrations
- **Endpoints:**
  - `POST /api/v1/profiles/create` - Generate profile from birth data
  - `GET /api/v1/profiles/:id` - Retrieve existing profile
  - `POST /api/v1/compatibility/calculate` - Team compatibility
  - `GET /api/v1/communication-tips/:disc_type` - Get tips for a type
  - `POST /api/v1/enrichment/enrich` - Enrich partial data

---

## 4. DATABASE SCHEMA

### 4.1 Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  subscription_tier ENUM('free', 'professional', 'enterprise'),
  oauth_provider VARCHAR(50),
  oauth_id VARCHAR(255)
);
```

### 4.2 Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  birth_date DATE,
  birth_time TIME,
  birth_location_lat DECIMAL(10, 8),
  birth_location_lon DECIMAL(11, 8),
  birth_location_name VARCHAR(255),
  sidereal_data JSONB, -- Raw astrological computation
  disc_profile JSONB, -- Transformed DISC output
  communication_tips JSONB,
  discipline_type VARCHAR(100),
  confidence_score DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_birth_date ON profiles(birth_date);
```

### 4.3 Team Compatibility Table

```sql
CREATE TABLE team_compatibility (
  id UUID PRIMARY KEY,
  user_1_id UUID REFERENCES users(id),
  user_2_id UUID REFERENCES users(id),
  compatibility_score DECIMAL(3, 2),
  disc_complementarity VARCHAR(100),
  recommendations JSONB,
  calculated_at TIMESTAMP,

  CONSTRAINT unique_team_pair UNIQUE (
    LEAST(user_1_id, user_2_id),
    GREATEST(user_1_id, user_2_id)
  )
);
```

### 4.4 CRM Integrations Table

```sql
CREATE TABLE crm_integrations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  crm_type ENUM('hubspot', 'salesforce', 'pipedrive'),
  access_token VARCHAR(1000),
  refresh_token VARCHAR(1000),
  sync_enabled BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. TECHNOLOGY STACK

### Backend

- **Language:** Node.js (TypeScript) + Python (for astrological calculations)
- **Web Framework:** Express.js or Fastify
- **Database:** PostgreSQL (relational data) + Redis (caching, real-time)
- **Astrological Libraries:**
  - `ephem` (Python) or `pymeeus` (Python) for ephemeris
  - `pytz` for timezone handling
- **Deployment:** Docker + Kubernetes (or Fly.io for simpler stack)
- **Caching:** Redis (for frequently accessed profiles, compatibility scores)
- **Message Queue:** Bull/BullMQ for async tasks (profile generation, enrichment)

### Frontend

- **Web App:** React + TypeScript, Next.js for SSR/static export
- **Dashboard:** TailwindCSS + Shadcn UI (component library)
- **Real-time:** Socket.io for live team compatibility updates
- **State Management:** TanStack Query (React Query) for server state, Zustand for client state
- **Deployment:** Vercel (Next.js native)

### Browser Extension

- **Manifest:** Chrome Manifest V3
- **Framework:** React + Vite
- **Storage:** Chrome Storage API + IndexedDB for offline capability

### Infrastructure

- **Cloud Provider:** AWS (or alternatives: GCP, Azure, Fly.io)
- **API Hosting:** EC2 + Load Balancer or Lambda + API Gateway
- **Database Hosting:** RDS PostgreSQL with read replicas for scaling
- **File Storage:** S3 for ephemeris cache, user data exports
- **CDN:** CloudFront for static assets, extension distribution
- **Monitoring:** CloudWatch, DataDog, or New Relic
- **Auth:** Auth0 or Supabase Auth for OAuth2 + email/password

---

## 6. SECURITY & COMPLIANCE

### Data Protection

- **Encryption at Rest:** AES-256 for sensitive fields (birth times, location data)
- **Encryption in Transit:** TLS 1.3 for all API communication
- **PII Handling:** GDPR-compliant data minimization—only collect essential birth data
- **Data Deletion:** 30-day grace period, then permanent deletion per GDPR right to be forgotten

### API Security

- **Rate Limiting:** 100 req/min per API key for free tier, unlimited for paid
- **Authentication:** JWT tokens with 1-hour expiry, refresh tokens with 7-day expiry
- **Authorization:** Role-based access control (RBAC) for team/org features

### Audit & Logging

- **Audit Trail:** Log all profile accesses, data exports, API calls
- **Anonymization:** Strip personally identifiable information from logs after 90 days

---

## 7. PERFORMANCE TARGETS

| Metric                   | Target      | Notes                                         |
| ------------------------ | ----------- | --------------------------------------------- |
| Profile Generation       | < 2 seconds | Birth chart calculation + DISC transformation |
| API Response Time (p95)  | < 500ms     | Standard profile lookup                       |
| Team Compatibility (p95) | < 1 second  | Calculating compatibility for team of 10      |
| Extension Popup Load     | < 1 second  | Chrome extension showing personality card     |
| Database Query           | < 100ms     | Standard indexed queries                      |
| Concurrent Users         | 50k         | With auto-scaling infrastructure              |

---

## 8. SCALABILITY ROADMAP

### Phase 1 (MVP - Months 1-3)

- Core birth chart engine
- Basic DISC transformation (Modality + Element)
- Web app (profile creation, team view)
- Chrome extension
- Free tier launch

### Phase 2 (Market Entry - Months 4-6)

- HubSpot integration (native)
- Email integration (Gmail, Outlook)
- Nakshatra layer (discipline typing)
- Premium tier ($39/mo)
- Marketing automation partnerships

### Phase 3 (Enterprise - Months 7-12)

- Salesforce integration (native)
- Zoom/Teams meeting integration
- Advanced analytics (team dynamics, predictive modeling)
- White-label API for consultants
- Enterprise tier ($500+/mo)

### Phase 4 (Scale - Year 2)

- Additional planetary layers (Venus, Mars, nodes)
- Predictive transit insights
- AI chat assistant (LLM-powered personalized guidance)
- Mobile app (iOS/Android)
- International expansion (language support, localization)

---

## 9. DEPLOYMENT & DEVOPS

### CI/CD Pipeline

- **Repository:** GitHub
- **Actions:** Automated tests, build, deploy on push to main
- **Environments:** Dev → Staging → Production
- **Database Migrations:** Automated via Flyway or similar

### Monitoring

- **Uptime:** Target 99.9% (3 nines)
- **Alerting:** PagerDuty for critical errors
- **Performance:** Real User Monitoring (RUM) via Datadog
- **Cost Tracking:** CloudWatch cost allocation tags

### Backup & Disaster Recovery

- **Database Backups:** Daily automated backups to S3, 30-day retention
- **RTO (Recovery Time Objective):** < 4 hours
- **RPO (Recovery Point Objective):** < 1 hour
- **Testing:** Monthly disaster recovery drills

---

## 10. API REFERENCE

### POST /api/v1/profiles/create

Create a new personality profile from birth data.

**Request:**

```json
{
  "birth_date": "1992-03-15",
  "birth_time": "14:30:00",
  "birth_location": {
    "latitude": 29.7604,
    "longitude": -95.3698,
    "city": "Houston",
    "timezone": "US/Central"
  },
  "user_info": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  }
}
```

**Response:**

```json
{
  "success": true,
  "profile_id": "prof_abc123",
  "disc_profile": {
    "primary_type": "D",
    "secondary_type": "C",
    "blend_description": "Strategic Leader"
  },
  "communication_style": {...},
  "discipline_type": "Nurturing Builder",
  "created_at": "2025-11-14T20:45:00Z"
}
```

---

## 11. TESTING STRATEGY

### Unit Tests

- Test DISC mapping algorithms in isolation
- Test Nakshatra classification logic
- Test API endpoint validation

### Integration Tests

- Test birth chart calculation end-to-end
- Test CRM API integrations
- Test Chrome extension communication with backend

### E2E Tests

- User signup → profile creation → team view
- CRM integration setup → data sync
- Chrome extension popup → profile display

### Performance Tests

- Load test with 1,000 concurrent profile creations
- Stress test database with 100k profiles
- Chrome extension response time benchmarks

---

## 12. KNOWN CONSTRAINTS & ASSUMPTIONS

1. **Ayanamsha:** Using Lahiri ayanamsha (standard for Vedic); users cannot change
2. **Timezone:** Accuracy depends on accurate birth time (to ±2 hours acceptable)
3. **Time Zones:** Must handle daylight saving time transitions correctly
4. **DISC Mapping:** Initial mapping based on research; will be refined with user feedback
5. **Privacy:** Birth data is sensitive; treated as PII per GDPR

---

## 13. FUTURE EXTENSIONS

1. **AI-Powered Communication Coach:** LLM generating personalized meeting scripts
2. **Predictive Analytics:** Transit predictions showing communication style changes
3. **Team Dynamics Dashboard:** Real-time team compatibility, conflict resolution suggestions
4. **Mobile App:** Native iOS/Android apps with offline profile caching
5. **White-Label Solution:** Agencies can rebrand Archetect for their clients
6. **Blockchain Verification:** Optional immutable profile verification

---

## APPENDICES

### A. Ephemeris Data Sources

- Libreoffice Calc ephemeris (free, public)
- NASA JPL Horizons System (free API)
- Astrolabe ephemeris (commercial, accurate)

### B. DISC Mapping Research Sources

- "DISC Personality Model and Tool" - Agile Coffee
- "Personality, Intelligence and Belief in Astrology" - ScienceDirect
- CrystalKnows case studies

### C. Nakshatra Resource Library

- 27 Nakshatras with ruling planets, traits, professions
- Personality archetypes for each (e.g., Pushya = "Nurturing Builder")
- Work environment preferences by Nakshatra
