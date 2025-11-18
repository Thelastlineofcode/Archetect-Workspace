# Archetect: Product Management & User Stories

**@PM: Product Requirements & User Story Backlog**

**Version:** 1.0 | **Date:** November 2025 | **Status:** Pre-Development

---

## PRODUCT VISION STATEMENT

**Archetect** is the personality intelligence platform for spiritually-aligned businesses and modern teams. We combine the depth of sidereal astrology and Big Five psychology with the accessibility of modern personality frameworks, empowering teams to communicate authentically while maintaining corporate credibility. Our multi-layer intelligence delivers results that feel uncannily accurateso accurate that users wonder how our "proprietary algorithm" works.

**Market Position:** Professional-grade personality intelligence with depth that competitors lack.

---

## PRODUCT ROADMAP

### Phase 1: MVP (Months 1-3) - "The Foundation"

- Birth chart calculation engine
- Big Five questionnaire engine
- Basic transformation (Modality + Element + Energy Styles)
- Web app: Profile creation, dashboard, team view
- Chrome extension: LinkedIn profile lookup
- Free tier launch, targeting early adopters

### Phase 2: Market Entry (Months 4-6) - "The Integration"

- HubSpot native integration
- Email integration (Gmail, Outlook)
- Nakshatra/Season discipline typing (adds "magic")
- Premium tier ($39/mo) launch
- Marketing automation partnerships

### Phase 3: Enterprise (Months 7-12) - "The Differentiation"

- Salesforce native integration
- Zoom/Teams meeting integration
- Advanced analytics (team dynamics, communication heatmaps)
- White-label API for consultants
- Enterprise tier ($500+/mo) launch

### Phase 4: Scale (Year 2+) - "The Moat"

- Additional planetary layers (Venus, Mars, lunar nodes)
- Predictive transit/cycle insights ("Your communication style shifts next month")
- AI chat assistant (LLM-powered personalized guidance)
- Mobile app (iOS/Android)
- International expansion

---

## CORE USER PERSONAS

### Persona A: The Spiritual Entrepreneur (PRIMARY)

**Name:** Alex Chen, 34, Astrology Coach
**Goals:**

- Use professional-grade tools without compromising spiritual values
- Help clients understand communication preferences
- Scale coaching practice without losing personal touch

**Pain Points:**

- Corporate tools feel soulless
- Need for team management without losing spiritual grounding
- Wants to share wisdom with clients but fears "woo factor"

**Opportunity:** High willingness to pay for values-aligned tools. Likely to become advocates.

### Persona B: Remote Team Leader (SECONDARY)

**Name:** Marcus Johnson, 38, Tech Company Manager
**Goals:**

- Build cohesive remote teams
- Improve communication across time zones
- Understand team members' work styles

**Pain Points:**

- Team members feel disconnected
- Communication breakdowns in remote settings
- Existing personality tools feel generic

**Opportunity:** High LTV. Likely to expand usage across company (viral).

### Persona C: Sales Development Representative (TERTIARY)

**Name:** Jessica Martinez, 26, B2B Sales Rep
**Goals:**

- Understand prospects before meetings
- Improve meeting close rate
- Differentiate from competitors

**Pain Points:**

- Existing tools (CrystalKnows) are expensive
- Limited depthsurface-level insights
- No spiritual/holistic component for aligned prospects

**Opportunity:** Price-sensitive but converts well if differentiated.

### Persona D: Corporate Consultant (ENTERPRISE)

**Name:** Dr. Robert Williams, 55, Organizational Development Consultant
**Goals:**

- Offer clients cutting-edge personality tool
- White-label solution for proprietary brand
- Deep customization for corporate workshops

**Pain Points:**

- Tools are restrictive, can't customize
- Limited depth for multi-day workshops
- No multicultural/holistic framework

**Opportunity:** Highest revenue potential. Multi-year contracts.

---

## USER STORIES: MVP PHASE (MONTHS 1-3)

### EPIC 1: Core Profile Creation

**US-001: User signs up with email**

As a new user
I want to sign up using my email
So that I can create my profile

**Acceptance Criteria:**

- Sign up form accepts email and password
- Password validation (8+ chars, mixed case, number)
- Email verification link sent
- User cannot access app until email verified
- Error messages clear and helpful
- Sign up takes < 30 seconds

**Priority:** P0 (Critical)
**Estimate:** 3 story points

---

**US-002: User enters birth data**

As a signed-up user
I want to enter my birth date, time, and location
So that Archetect can calculate my personality profile

**Acceptance Criteria:**

- Birth date field accepts date picker
- Birth time accepts HH:MM:SS format
- Birth location accepts city name or coordinates
- Timezone auto-detected based on location
- Help text explains why birth time matters
- Previous entries pre-filled if user edits
- Optional: "I don't know my birth time" fallback

**Priority:** P0 (Critical)
**Estimate:** 5 story points

---

**US-003: User completes Big Five questionnaire**

As a signed-up user
I want to complete a personality questionnaire
So that I can get my profile without providing birth data

**Acceptance Criteria:**

- Questionnaire displays 40-60 items
- 5-point Likert scale for each item
- Progress bar shows completion percentage
- Can save and resume later
- Completion time: 5-8 minutes
- Clear instructions at start

**Priority:** P0 (Critical)
**Estimate:** 8 story points

---

**US-004: System generates profile from birth data**

As a user who entered birth data
I want my personality profile generated automatically
So that I see my DISC type instantly

**Acceptance Criteria:**

- Profile generated in < 2 seconds
- Confidence score displayed (0-100%)
- DISC primary and secondary types shown
- Communication style described in plain language
- No astrological terms visible to user
- Profile includes "strengths" and "development areas"

**Priority:** P0 (Critical)
**Estimate:** 13 story points
**Dependencies:** Birth chart calculation engine (Python)

---

**US-005: System generates profile from questionnaire**

As a user who completed the questionnaire
I want my Archetect Type profile generated
So that I understand my personality

**Acceptance Criteria:**

- Profile generated in < 2 seconds
- Shows Primary Type, Secondary Type
- Shows Energy Style, Flow Mode, Season
- Communication style described clearly
- Strengths and development areas listed
- Confidence score based on response consistency

**Priority:** P0 (Critical)
**Estimate:** 13 story points
**Dependencies:** Big Five scoring engine

---

### EPIC 2: Dashboard & Profile View

**US-006: User views personal profile card**

As a user with generated profile
I want to see my personality profile card
So that I understand my type and communication style

**Acceptance Criteria:**

- Profile card shows type, blend description, strengths, development areas
- Download profile as PDF
- Includes personalized communication tips
- Visual representation (radar chart or bars) of traits
- Shareable link option

**Priority:** P0 (Critical)
**Estimate:** 8 story points

---

**US-007: User edits profile information**

As a user
I want to edit my profile information
So that I can update my details or retake assessment

**Acceptance Criteria:**

- Edit birth data (recalculates profile)
- Retake questionnaire (overwrites previous)
- Update name, email, photo
- Change password
- Delete account option (with confirmation)

**Priority:** P1 (High)
**Estimate:** 5 story points

---

**US-008: User invites team members**

As a user
I want to invite team members to see their profiles
So that we can understand our team dynamics

**Acceptance Criteria:**

- Invite via email (multiple at once)
- Custom message option
- Team members appear in user's team list (pending acceptance)
- Inviter notified when team member joins
- Reminder sent after 3 days if not accepted

**Priority:** P0 (Critical)
**Estimate:** 8 story points

---

### EPIC 3: Team Compatibility Matrix

**US-009: System calculates team compatibility**

As a team lead
I want to see compatibility scores between team members
So that I understand who works well together

**Acceptance Criteria:**

- Compatibility calculated for all team pairs
- Scores displayed in matrix/heatmap
- Clicking pair shows detailed compatibility breakdown
- Recommendations for effective collaboration
- Can filter by high/low compatibility

**Priority:** P1 (High)
**Estimate:** 13 story points

---

**US-010: User sees meeting prep guide**

As a user in a team
I want meeting prep tips for each team member
So that I can communicate more effectively in meetings

**Acceptance Criteria:**

- Select meeting participants from team
- Shows each participant's personality type
- Lists communication do's and don'ts for each
- Suggests meeting format (structured vs. freeform)
- Exportable as meeting notes

**Priority:** P1 (High)
**Estimate:** 8 story points

---

### EPIC 4: Chrome Extension

**US-011: User installs Chrome extension**

As a user
I want to install a Chrome extension
So that I can see personality insights anywhere on the web

**Acceptance Criteria:**

- One-click install from Chrome Web Store
- Login with existing Archetect credentials
- Permissions explained clearly
- Works on LinkedIn, email platforms, CRM pages
- Offline mode shows cached profiles

**Priority:** P0 (Critical)
**Estimate:** 8 story points

---

**US-012: User looks up LinkedIn profile personality**

As a user with extension installed
I want to see a person's personality when visiting their LinkedIn profile
So that I understand them before connecting

**Acceptance Criteria:**

- Extension detects LinkedIn profile page
- Shows personality card in sidebar or popup
- Displays type, communication tips, strengths
- "Add to team" button if not already in team
- "Request profile" if person not in Archetect database

**Priority:** P0 (Critical)
**Estimate:** 13 story points
**Dependencies:** LinkedIn data enrichment pipeline

---

### EPIC 5: Authentication & Security

**US-013: User logs in with email/password**

As a returning user
I want to log in with email and password
So that I access my profile and team data

**Acceptance Criteria:**

- Login form with email and password
- "Remember me" option (30-day session)
- "Forgot password" flow
- Account lockout after 5 failed attempts
- 2FA option (optional for MVP)

**Priority:** P0 (Critical)
**Estimate:** 5 story points

---

**US-014: User logs in with Google/GitHub**

As a user
I want to sign up/log in with Google or GitHub
So that I don't need to remember another password

**Acceptance Criteria:**

- OAuth login buttons on signup/login pages
- One-click login for returning users
- Profile auto-populated from OAuth provider
- Can link multiple auth methods to one account

**Priority:** P1 (High)
**Estimate:** 8 story points

---

## USER STORIES: PHASE 2 (MONTHS 4-6)

### EPIC 6: HubSpot Integration

**US-015: User connects HubSpot account**

As a sales professional
I want to connect my HubSpot account
So that Archetect profiles sync with my CRM contacts

**Acceptance Criteria:**

- OAuth connection to HubSpot
- Select which contacts to sync
- Automatic profile generation for contacts with birth data
- Custom HubSpot property for personality type
- Sidebar widget in HubSpot contact view

**Priority:** P0 (Critical)
**Estimate:** 13 story points

---

**US-016: HubSpot contact personality auto-enrichment**

As a HubSpot user
I want contact personalities auto-enriched from LinkedIn
So that I don't manually enter birth data for hundreds of contacts

**Acceptance Criteria:**

- Detect LinkedIn URLs in HubSpot contacts
- Auto-enrich from Archetect database (if available)
- Request user permission for batch enrichment
- Show enrichment progress (contacts processed)
- Sync updates back to HubSpot

**Priority:** P1 (High)
**Estimate:** 13 story points

---

### EPIC 7: Email Integration

**US-017: User installs Gmail sidebar**

As a Gmail user
I want an Archetect sidebar in Gmail
So that I see recipient personality when composing emails

**Acceptance Criteria:**

- Gmail Add-on installation
- Detects email recipients automatically
- Shows personality card for each recipient
- Communication tips for email tone
- Works in compose and read views

**Priority:** P0 (Critical)
**Estimate:** 13 story points

---

**US-018: User installs Outlook plugin**

As an Outlook user
I want an Archetect plugin in Outlook
So that I see recipient personality when composing emails

**Acceptance Criteria:**

- Outlook Add-in installation
- Detects email recipients automatically
- Shows personality card in sidebar
- Communication tips for email tone
- Works in Outlook desktop and web

**Priority:** P1 (High)
**Estimate:** 13 story points

---

### EPIC 8: Premium Tier Features

**US-019: User upgrades to Premium**

As a free tier user
I want to upgrade to Premium
So that I get unlimited profiles and team features

**Acceptance Criteria:**

- Pricing page shows Free vs. Premium comparison
- Stripe checkout integration
- Email receipt sent
- Immediate access to Premium features
- Downgrade option (at end of billing period)

**Priority:** P0 (Critical)
**Estimate:** 8 story points

---

**US-020: Premium user accesses advanced analytics**

As a Premium user
I want to see advanced team analytics
So that I understand team dynamics deeply

**Acceptance Criteria:**

- Team dynamics dashboard
- Communication heatmap (who talks to whom)
- Conflict risk indicators
- Optimal team pairings suggestions
- Export analytics as report (PDF)

**Priority:** P1 (High)
**Estimate:** 13 story points

---

## USER STORIES: PHASE 3 (MONTHS 7-12)

### EPIC 9: Salesforce Integration

**US-021: User connects Salesforce account**

As an enterprise user
I want to connect my Salesforce account
So that Archetect profiles sync with Salesforce contacts

**Acceptance Criteria:**

- OAuth connection to Salesforce
- Custom Salesforce object for profiles
- Lightning component in contact view
- Batch sync for existing contacts
- Real-time sync for new contacts

**Priority:** P0 (Critical)
**Estimate:** 21 story points

---

### EPIC 10: Zoom/Teams Integration

**US-022: User installs Zoom app**

As a Zoom user
I want an Archetect app in Zoom
So that I see participant personalities during meetings

**Acceptance Criteria:**

- Zoom App Marketplace installation
- Shows participant personality cards during meeting
- Updated in real-time as people join
- Pin important participants
- Export meeting personality summary

**Priority:** P1 (High)
**Estimate:** 13 story points

---

### EPIC 11: White-Label API

**US-023: Consultant accesses white-label API**

As an organizational development consultant
I want access to white-label API
So that I can rebrand Archetect for my clients

**Acceptance Criteria:**

- API key generation
- Custom branding settings (logo, colors, name)
- REST/GraphQL endpoints for profiles, compatibility
- Webhook support for real-time updates
- API documentation (Swagger/OpenAPI)

**Priority:** P0 (Critical - Enterprise)
**Estimate:** 21 story points

---

## USER STORIES: PHASE 4 (YEAR 2+)

### EPIC 12: AI Chat Assistant

**US-024: User chats with AI personality coach**

As a user
I want to chat with an AI coach about communication challenges
So that I get personalized guidance

**Acceptance Criteria:**

- Chat interface in web app
- AI knows user's personality profile
- Provides personalized advice on conflicts, meetings, emails
- Can reference specific team member dynamics
- Chat history saved

**Priority:** P2 (Nice-to-have)
**Estimate:** 21 story points

---

### EPIC 13: Mobile App

**US-025: User accesses Archetect on iOS**

As a mobile user
I want an Archetect iOS app
So that I can access profiles on the go

**Acceptance Criteria:**

- Native iOS app (Swift/SwiftUI)
- Login syncs with web account
- View profile, team, compatibility
- Push notifications for team invites
- Offline mode with cached profiles

**Priority:** P2 (Nice-to-have)
**Estimate:** 34 story points

---

## SUCCESS METRICS

### North Star Metric

**Active Profiles Created per Month** (leading indicator of engagement and revenue)

### Key Performance Indicators (KPIs)

| Metric                     | MVP (Month 3) | Phase 2 (Month 6) | Phase 3 (Month 12) |
| -------------------------- | ------------- | ----------------- | ------------------ |
| Total Users                | 5,000         | 25,000            | 100,000            |
| Profiles Created/Month     | 2,000         | 10,000            | 40,000             |
| Free ’ Paid Conversion     | 3%            | 5%                | 7%                 |
| Monthly Active Users (MAU) | 2,500         | 15,000            | 70,000             |
| Chrome Ext. Installs       | 1,000         | 10,000            | 50,000             |
| NPS (Net Promoter Score)   | 40            | 50                | 60                 |

---

## PRIORITIZATION FRAMEWORK

### MoSCoW Method

- **Must Have (P0)**: Critical for launch, blocks release
- **Should Have (P1)**: Important, but workaround exists
- **Could Have (P2)**: Nice-to-have, adds value but not critical
- **Won't Have (P3)**: Deferred to later phases

### Story Point Scale (Fibonacci)

- **1-2**: Trivial, < 1 day
- **3-5**: Small, 1-3 days
- **8**: Medium, 3-5 days
- **13**: Large, 1-2 weeks
- **21+**: Extra large, requires breakdown

---

## RELEASE PLAN

### MVP Release (Month 3)

**Must Have Features:**

- User signup/login (US-001, US-013)
- Profile creation (birth data OR questionnaire) (US-002, US-003)
- Profile generation (both approaches) (US-004, US-005)
- Profile view (US-006)
- Team invites (US-008)
- Chrome extension (US-011, US-012)

**Sprint Breakdown:**

- Sprint 1-2: Auth, signup, database setup
- Sprint 3-4: Birth chart engine + Big Five engine
- Sprint 5-6: Profile generation + transformation
- Sprint 7-8: Dashboard, team features
- Sprint 9-10: Chrome extension
- Sprint 11-12: Testing, polish, launch

### Phase 2 Release (Month 6)

**Should Have Features:**

- HubSpot integration (US-015, US-016)
- Gmail integration (US-017)
- Premium tier (US-019, US-020)

### Phase 3 Release (Month 12)

**Could Have Features:**

- Salesforce integration (US-021)
- Zoom integration (US-022)
- White-label API (US-023)

---

## COMPETITIVE FEATURE COMPARISON

| Feature                   | Archetect | CrystalKnows | Predictive Index | 16Personalities |
| ------------------------- | --------- | ------------ | ---------------- | --------------- |
| Free Tier                 |          | L            | L                |                |
| Chrome Extension          |          |             | L                | L               |
| CRM Integration           |          |             | L                | L               |
| Team Compatibility        |          |             |                 | L               |
| Multi-Layer Profiling     |          | L            | L                | L               |
| Spiritual + Corporate     |          | L            | L                | L               |
| White-Label API           |          | L            | L                | L               |
| Mobile App                | =§         |             |                 |                |

**Legend:**  Available | L Not Available | =§ Planned

---

## APPENDICES

### Appendix A: Full User Story List

For complete user stories across all phases, see: [Stories_and_epics.md](../Stories_and_epics.md)

### Appendix B: Technical Requirements

See: [architect_doc.md](./architect_doc.md)

### Appendix C: Business Case

See: [founder_proposal.md](./founder_proposal.md)

---

**Document Owner**: Archetect Product Team
**Last Updated**: November 2025
**Next Review**: January 2026
