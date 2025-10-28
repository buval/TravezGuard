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
- `destinations` table: Pre-seeded travel destinations with categories and featured flags
- `trips` table: User-created trips with references to destinations and date ranges
- `itineraryItems` table: Day-by-day activities linked to trips

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

## External Dependencies

### Third-Party Services

**Replit Platform Services**
- **Replit Auth**: OIDC identity provider (issuer URL: `https://replit.com/oidc`)
- **Neon Database**: Serverless PostgreSQL hosting via `@neondatabase/serverless`
- Environment variable `DATABASE_URL` required for connection

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