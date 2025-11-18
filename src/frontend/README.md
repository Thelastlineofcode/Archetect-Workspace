# Archetect Frontend

Next.js 14 web application for the Archetect personality intelligence platform.

## Status

🚧 **In Development** - Authentication Complete

### Completed
- ✅ Next.js 14 setup with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS styling
- ✅ API client with auto token refresh
- ✅ Auth state management (Zustand)
- ✅ React Query setup
- ✅ Landing page
- ✅ Authentication pages (signup/login)
- ✅ Protected route component
- ✅ Questionnaire interface
- ✅ Profile dashboard

### In Progress
- 🔄 Team compatibility view
- 🔄 Settings and account management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (auth), React Query (server state)
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts

## Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

The app will be available at `http://localhost:3001`

## Project Structure

```
src/frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/
│   │   │   ├── login/         # Login page
│   │   │   └── signup/        # Signup page
│   │   ├── dashboard/         # User dashboard
│   │   ├── questionnaire/     # Big Five assessment
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   ├── providers.tsx      # React Query provider
│   │   └── globals.css        # Global styles
│   ├── lib/
│   │   ├── api-client.ts      # Axios instance with interceptors
│   │   ├── auth-store.ts      # Zustand auth state
│   │   └── api.ts             # API functions
│   ├── components/
│   │   └── ProtectedRoute.tsx # Auth guard component
│   ├── hooks/                 # Custom React hooks (to be added)
│   └── types/                 # TypeScript types (to be added)
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## API Integration

The frontend connects to the backend API at `http://localhost:3000/api/v1` (configurable via `NEXT_PUBLIC_API_URL`).

### API Client Features

- Automatic token refresh on 401 errors
- Request/response interceptors
- Type-safe API functions
- Persistent auth state

### Available API Functions

```typescript
// Auth
authApi.signup({ email, password, fullName })
authApi.login({ email, password })
authApi.logout(refreshToken)
authApi.getMe()

// Profiles
profileApi.getQuestionnaire()
profileApi.createProfile(responses)
profileApi.getMyProfile()

// Compatibility
compatibilityApi.calculatePair(profile1Id, profile2Id)
compatibilityApi.calculateTeam(profileIds)
```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_APP_NAME=Archetect
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Features

### Authentication
- [x] Landing page
- [x] Signup form with validation
- [x] Login form with validation
- [x] Protected routes (ProtectedRoute component)
- [ ] Password reset flow

### Profile
- [x] 40-question Big Five questionnaire
- [x] Progress indicator
- [x] Profile results dashboard
- [x] Archetect Type display
- [x] Energy Style & Flow Mode
- [x] Strengths & challenges
- [ ] Profile editing/retake questionnaire

### Team
- [ ] Team member list
- [ ] Compatibility matrix
- [ ] Communication tips
- [ ] Team dynamics insights

### Settings
- [ ] Profile management
- [ ] Password change
- [ ] Account settings

## Styling

Using Tailwind CSS with custom Archetect brand colors:

```js
// Archetect Types
architect: '#0369a1'   // Blue
maverick:  '#7c3aed'   // Purple
sage:      '#059669'   // Green

// Energy Styles
energetic: '#dc2626'   // Red
focused:   '#78716c'   // Stone gray
balanced:  '#0891b2'   // Cyan
```

## Next Steps

1. Implement team compatibility view with matrix visualization
2. Add settings and account management pages
3. Create password reset flow
4. Build profile editing and retake questionnaire feature
5. Add loading states and optimistic updates
6. Implement error boundaries and better error handling
7. Add unit and integration tests

## Contributing

See main project README for contribution guidelines.

## License

UNLICENSED - Private/Proprietary
