# Travez - Travel Planning Application

## Overview

Travez is a mobile-first travel planning application that allows users to discover destinations, create trips, and build detailed day-by-day itineraries. The app features a visually-rich, app-like interface inspired by premium travel platforms like Airbnb and Booking.com, with a focus on inspiring wanderlust through destination imagery and effortless navigation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, providing fast HMR and optimized production builds
- **Wouter** for lightweight client-side routing (instead of React Router)

**UI Component Library**
- **shadcn/ui** components built on Radix UI primitives for accessible, customizable UI components
- **Tailwind CSS** for utility-first styling with custom design tokens
- Component configuration in `components.json` follows the "new-york" style variant
- Custom CSS variables defined for theming (light/dark mode support)

**State Management & Data Fetching**
- **TanStack Query (React Query)** for server state management, caching, and synchronization
- Custom query client configuration with credentials included for authenticated requests
- Centralized API request handling in `lib/queryClient.ts` with error handling for 401 responses

**Design System**
- Mobile-first responsive design with breakpoints for tablet (md) and desktop (lg)
- Typography system using Inter font family with defined weight and size scales
- Consistent spacing primitives using Tailwind units (2, 4, 6, 8, 12, 16)
- Grid patterns: single column (mobile), 2 columns (tablet), 3 columns (desktop)

**Progressive Web App (PWA)**
- **Web Manifest** (`public/manifest.json`): App metadata, icons, theme colors, display settings
- **Service Worker** (`public/sw.js`): Network-first caching strategy for offline support
  - Caches GET requests only (skips mutations to prevent errors)
  - Skips cross-origin requests (external APIs)
  - Provides offline fallback for cached pages
- **Install Capability**: Users can install app on home screen (iOS/Android)
- **Standalone Mode**: Runs fullscreen without browser chrome
- **App Icons**: Multiple sizes (192x192, 512x512) for different devices
- **Theme Integration**: Blue theme color (#2563eb) in status bar
- **Apple-Specific Tags**: Enhanced iOS PWA support

### Backend Architecture

**Server Framework**
- **Express.js** as the web server handling API routes and serving the React SPA
- TypeScript throughout for type safety
- Modular route registration pattern in `server/routes.ts`

**API Structure**
- RESTful API endpoints under `/api` prefix
- Authentication-protected routes using middleware
- Route categories:
  - Auth routes: `/api/auth/user`
  - Destinations: `/api/destinations`, `/api/destinations/featured`, `/api/destinations/:id`
  - Trips: `/api/trips`, `/api/trips/:id` (CRUD operations)
  - Itinerary: `/api/itinerary-items` (create/delete)
  - Expenses: `/api/expenses` (POST), `/api/expenses/:id` (PATCH/DELETE), `/api/trips/:id/expenses` (GET)
  - Borders: Public page (no backend routes, uses external Passport Index API)

**Business Logic Layer**
- Storage abstraction interface (`IStorage`) defined in `server/storage.ts`
- `DatabaseStorage` implementation for all data operations
- Separation of concerns between routes (HTTP layer) and storage (data layer)

### Data Storage

**Database**
- **PostgreSQL** via Neon serverless platform
- **Drizzle ORM** for type-safe database queries and schema management
- WebSocket-based connection pooling for serverless environments

**Schema Design**
- `users` table: Stores user profile data from Replit Auth (email, name, profile image)
- `sessions` table: Server-side session storage for authentication
- `destinations` table: Pre-seeded travel destinations with categories, featured flags, climate data, and best months to visit
- `trips` table: User-created trips with references to destinations, date ranges, and optional budget field
- `itineraryItems` table: Day-by-day activities linked to trips
- `expenses` table: Trip expense tracking with category, amount (stored in cents for precision), date, and description fields

**Database Migrations**
- Drizzle Kit manages schema migrations
- Schema definitions in `shared/schema.ts` using Drizzle's PostgreSQL column types
- Zod schemas generated from Drizzle schemas for runtime validation

### Authentication & Authorization

**Replit Auth Integration**
- **OpenID Connect (OIDC)** authentication flow via Replit platform
- **Passport.js** strategy for OIDC integration
- Session-based authentication using `express-session`
- PostgreSQL session store (`connect-pg-simple`) for persistent sessions
- Session TTL: 7 days with secure HTTP-only cookies

**Auth Flow**
- Users redirected to `/api/login` to initiate OIDC flow
- Callback handler at `/api/auth/callback` processes tokens and creates session
- User profile data automatically synced to database on login
- Frontend checks auth status via `/api/auth/user` endpoint
- 401 responses trigger re-authentication in the UI

**Authorization Pattern**
- `isAuthenticated` middleware protects routes requiring login
- User ID extracted from session claims (`req.user.claims.sub`)
- Trips and itinerary items scoped to authenticated user

## Application Features

### Pages & Navigation

**Public Pages** (accessible to all users):
- **Home** (`/`): Welcome page with featured destinations, trip creation, and sign-in
- **Explore** (`/explore`): Browse and filter all destinations with search functionality
- **Borders** (`/borders`): Check visa and entry requirements based on passport nationality
  - 20 passport countries supported (US, UK, Canada, Australia, Germany, France, Italy, Spain, Japan, South Korea, China, India, Brazil, Mexico, Argentina, South Africa, UAE, Singapore, New Zealand, Switzerland)
  - Real-time visa requirement lookup for all destinations
  - Color-coded visa status badges (green=visa-free, blue=visa-on-arrival/eVisa/eTA, yellow=visa-required, red=not-admitted)
  - Stay duration information when applicable
  - Links to official Passport Index source

**Authenticated Pages** (require login):
- **My Trips** (`/trips`): View and manage created trips
- **Trip Details** (`/trips/:id`): View trip details, itinerary, and expenses
- **New Trip** (`/new-trip`): Create a new trip with destination selection
- **Profile/Menu**: User profile and settings

**Mobile Navigation**:
- Bottom navigation bar with 5 items: Home, Explore, Trips (auth required), Borders, Profile/Menu
- Icons: Home, Search, MapPin, Shield, User
- Highlights active page

### Borders & Visa Feature

**Visa Data Source**:
- Free community Passport Index API: `https://rough-sun-2523.fly.dev`
- Based on official government data from Passport Index
- No API key required
- Endpoint: `/visa/{passportCode}/{destinationCode}`

**Implementation Details**:
- Complete ISO-2 code mapping for all 8 destinations (France→FR, Greece→GR, Japan→JP, Maldives→MV, Peru→PE, Switzerland→CH, Tanzania→TZ, Turkey→TR)
- In-memory caching of API responses to reduce redundant calls
- Cache key format: `{passportCode}-{destinationCode}`
- Comprehensive error handling:
  - Toast notifications for multiple API failures
  - Per-card error states with retry guidance
  - Yellow warning for missing country mappings
  - Console warnings for debugging

**UI States**:
- Loading: Spinner with "Checking requirements..." message
- Success: Color-coded badge with category name, optional duration, and official source link
- Error: AlertCircle icon with "Failed to load" message and connection guidance
- Missing mapping: Yellow warning (should not occur for seeded destinations)

### Budget Tracking Feature

**Expense Management**:
- Add expenses to trips with category, amount, date, and description
- Categories: Accommodation, Transportation, Food, Activities, Shopping, Other
- Amount stored in cents for precision, displayed in dollars
- Edit and delete expenses
- Total expense calculation per trip
- Budget vs. actual spending comparison

## External Dependencies

### Third-Party Services

**Replit Platform Services**
- **Replit Auth**: OIDC identity provider (issuer URL: `https://replit.com/oidc`)
- **Neon Database**: Serverless PostgreSQL hosting via `@neondatabase/serverless`
- Environment variable `DATABASE_URL` required for connection

**External APIs**:
- **Passport Index API**: Community-maintained visa requirements API
  - Base URL: `https://rough-sun-2523.fly.dev`
  - Free, no authentication required
  - Sources official government data
  - Used by Borders page for real-time visa lookups

**Development Tools**
- **Replit Vite Plugins**: Runtime error overlay, cartographer (code navigation), and dev banner for Replit environment

### Key NPM Packages

**UI & Component Libraries**
- `@radix-ui/*`: Accessible component primitives (20+ components)
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority` & `clsx`: Conditional styling utilities
- `lucide-react`: Icon library
- `date-fns`: Date formatting and manipulation

**Form Handling & Validation**
- `react-hook-form`: Form state management
- `@hookform/resolvers`: Integration with validation libraries
- `zod`: Schema validation
- `drizzle-zod`: Generate Zod schemas from Drizzle ORM schemas

**Authentication**
- `passport`: Authentication middleware
- `openid-client`: OIDC client implementation
- `express-session`: Session management
- `connect-pg-simple`: PostgreSQL session store

**Database & ORM**
- `drizzle-orm`: TypeScript ORM
- `drizzle-kit`: Migration and introspection tool
- `@neondatabase/serverless`: Neon database driver with WebSocket support
- `ws`: WebSocket library for Neon connections

**Build & Development**
- `vite`: Build tool and dev server
- `@vitejs/plugin-react`: React support for Vite
- `esbuild`: Server bundling for production
- `tsx`: TypeScript execution for development

### Asset Management

**Images**
- Local asset storage in `/attached_assets/generated_images/`
- Destination images for featured locations (Santorini, Swiss Alps, Tokyo, etc.)
- Vite alias `@assets` for importing images in React components