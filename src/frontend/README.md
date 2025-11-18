# Archetect Frontend

Next.js 14 web application for the Archetect personality intelligence platform.

## Status

✨ **Feature Complete** - Modern React Architecture

### Completed
- ✅ Next.js 14 setup with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS styling
- ✅ API client with auto token refresh
- ✅ Auth state management (Zustand)
- ✅ React Query setup with custom hooks
- ✅ Error boundaries and loading states
- ✅ Landing page
- ✅ Authentication pages (signup/login)
- ✅ Protected route component
- ✅ Questionnaire interface (40 questions)
- ✅ Profile dashboard with React Query
- ✅ Team compatibility view with matrix
- ✅ Settings and account management
- ✅ Navigation component
- ✅ Modern UI/UX patterns

### Future Enhancements
- 🔄 Password reset flow
- 🔄 Profile editing/retake
- 🔄 Unit and E2E tests

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
│   ├── app/                         # Next.js App Router
│   │   ├── auth/
│   │   │   ├── login/              # Login page
│   │   │   └── signup/             # Signup page
│   │   ├── dashboard/              # User dashboard with React Query
│   │   ├── team/                   # Team compatibility with matrix
│   │   ├── settings/               # Account settings (tabbed)
│   │   ├── questionnaire/          # Big Five assessment
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Landing page
│   │   ├── providers.tsx           # React Query provider
│   │   └── globals.css             # Global styles
│   ├── lib/
│   │   ├── api-client.ts           # Axios with interceptors
│   │   ├── auth-store.ts           # Zustand auth state
│   │   └── api.ts                  # API functions
│   ├── components/
│   │   ├── ProtectedRoute.tsx      # Auth guard
│   │   ├── ErrorBoundary.tsx       # Error handling
│   │   ├── LoadingSpinner.tsx      # Loading states
│   │   ├── Navigation.tsx          # App navigation
│   │   └── CompatibilityMatrix.tsx # Team matrix viz
│   ├── hooks/
│   │   ├── useAuth.ts              # Auth operations
│   │   ├── useProfile.ts           # Profile queries
│   │   └── useCompatibility.ts     # Compatibility queries
│   └── types/                      # TypeScript types (to be added)
├── public/                          # Static assets
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
- [x] Landing page with gradient design
- [x] Signup form with React Hook Form + Zod validation
- [x] Login form with validation and error handling
- [x] Protected routes with ProtectedRoute component
- [x] Automatic token refresh on 401 errors
- [x] Logout with React Query cache clearing
- [ ] Password reset flow

### Profile
- [x] 40-question Big Five questionnaire (IPIP-based)
- [x] Real-time progress indicator
- [x] Profile results dashboard with React Query
- [x] Archetect Type display (Architect/Maverick/Sage)
- [x] Energy Style & Flow Mode visualization
- [x] Strengths & challenges with beautiful UI
- [x] Quick action cards for Team and Settings
- [x] Retake questionnaire option
- [ ] Profile editing/history

### Team Compatibility
- [x] Team member management (add/remove by profile ID)
- [x] Compatibility matrix with color-coded scores
- [x] Hover tooltips with detailed insights
- [x] Average team compatibility calculation
- [x] Communication tips generation
- [x] Team dynamics analysis
- [x] Pairwise compatibility scores
- [ ] Invite team members by email
- [ ] Team member profiles with avatars

### Settings
- [x] Tabbed interface (Account, Security, Profile)
- [x] Profile overview and management
- [x] Password change with validation
- [x] Account information display
- [x] Subscription tier display
- [x] Logout functionality
- [ ] Email notifications preferences
- [ ] Privacy settings

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

## Modern React Patterns

This application showcases modern React best practices:

### Custom Hooks with React Query
- `useAuth()` - Login, signup, logout with automatic cache management
- `useProfile()` - Profile queries with intelligent caching
- `useCompatibility()` - Team compatibility calculations
- All hooks include loading states, error handling, and optimistic updates

### Error Handling
- `ErrorBoundary` component catches React errors gracefully
- Fallback UI with reload functionality
- Per-page error boundaries for isolation
- API error handling with user-friendly messages

### Loading States
- `LoadingSpinner` component with multiple sizes
- Skeleton screens for better UX
- React Query manages loading states automatically
- Suspense-ready architecture

### Navigation
- Active state highlighting
- Consistent navigation across all pages
- Mobile-responsive design
- Gradient logo with brand identity

## Next Steps

### High Priority
1. Create password reset flow with email verification
2. Add unit tests with Jest and React Testing Library
3. Implement E2E tests with Playwright
4. Add profile editing history and version control

### Medium Priority
5. Build team member invite system (email-based)
6. Add profile avatars and customization
7. Implement email notification preferences
8. Create privacy settings page
9. Add data export functionality

### Low Priority
10. Implement real-time collaboration features
11. Add advanced analytics dashboard
12. Create mobile app with React Native
13. Build Chrome extension for profile insights

## Contributing

See main project README for contribution guidelines.

## License

UNLICENSED - Private/Proprietary
