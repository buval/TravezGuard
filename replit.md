# Travez - Travel Planning Application

## Overview
Travez is a mobile-first travel planning application designed to inspire travel and simplify itinerary creation. It enables users to discover destinations, plan trips, and build detailed day-by-day itineraries with a rich, app-like interface. The platform focuses on visual appeal, effortless navigation, and comprehensive travel information, including visa requirements, climate data, and real-time flight searches. Travez aims to be a go-to platform for travelers, offering a seamless experience from destination discovery to detailed trip execution.

## Recent Changes (November 2025)

### Home and Explore Page Merge
- **Consolidated Functionality**: The Explore page has been merged into the Home page (`/`). All destination browsing features (search, category filters, destination cards) are now on the Home page.
- **Route Redirects**: Both `/explore` and `/home` routes now redirect to `/` to maintain backwards compatibility.
- **Improved UX**: Single unified experience for discovering destinations, available to both guest and authenticated users.

### Expanded Destination Database (12 New Destinations)
Added 12 stunning new destinations with beautiful AI-generated images:

**Featured Destinations (7 new):**
- **Bali, Indonesia** (Beach) - Lush rice terraces, ancient temples, and pristine beaches
- **Iceland** (Adventure) - Northern Lights, volcanoes, glaciers, and geysers
- **New York City, USA** (City) - Iconic skyline, world-class museums, and Broadway
- **Dubai, UAE** (City) - Futuristic skyscrapers, luxury shopping, and Arabian culture
- **Petra, Jordan** (Cultural) - Ancient rose-red city carved into sandstone cliffs
- **Banff, Canada** (Mountain) - Turquoise lakes, Rocky Mountains, and pristine wilderness

**Non-Featured Destinations (6 new):**
- **Bora Bora, French Polynesia** (Beach) - Overwater bungalows and crystal-clear lagoons
- **Venice, Italy** (City) - Romantic canals, gondolas, and Byzantine architecture
- **Norwegian Fjords, Norway** (Mountain) - Dramatic cliffs, waterfalls, and midnight sun
- **Barcelona, Spain** (City) - Gaudí masterpieces, beaches, and Catalan culture
- **Great Barrier Reef, Australia** (Beach) - World's largest coral reef system
- **Marrakech, Morocco** (Cultural) - Vibrant souks, palaces, and exotic gardens

**Total Destinations**: Now **20 destinations** (previously 8), each with comprehensive visa requirements, climate data, best months to visit, and geographic coordinates.

### Updated Navigation
- **Mobile Navigation**: Bottom nav bar now has **5 items** (previously 6):
  - Home, Borders, Flights, Trips, Profile
  - Removed separate "Explore" navigation item
- **Cleaner Interface**: Streamlined navigation reflects the merged Home/Explore experience

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript.
- **Build Tool**: Vite for fast development and optimized production builds.
- **Routing**: Wouter for lightweight client-side navigation.
- **UI Components**: shadcn/ui built on Radix UI for accessible and customizable components, styled with Tailwind CSS.
- **State Management**: TanStack Query for server state management, caching, and synchronization.
- **Design System**: Mobile-first responsive design, consistent typography (Inter font), and spacing using Tailwind units.
- **PWA**: Implemented with Web Manifest and Service Worker for offline support, installability, and a standalone app experience.

### Backend Architecture
- **Server**: Express.js with TypeScript for API routes and serving the React SPA.
- **API Structure**: RESTful API endpoints under `/api` for authentication, destinations, trips, itinerary, expenses, and integrations.
- **Business Logic**: Clear separation of concerns with a `DatabaseStorage` implementation for data operations.

### Data Storage
- **Database**: PostgreSQL hosted on Neon, accessed via Drizzle ORM for type-safe queries.
- **Schema**: `users`, `sessions`, `destinations`, `trips`, `itineraryItems`, and `expenses` tables.
- **Migrations**: Drizzle Kit manages schema changes, with Zod for runtime validation.

### Authentication & Authorization
- **Authentication**: Replit Auth (OpenID Connect) integrated via Passport.js, using `express-session` and a PostgreSQL session store.
- **Authorization**: Session-based, with `isAuthenticated` middleware protecting routes and user data scoped to the authenticated user.

### Application Features
- **Public Pages**:
    - **Home (`/`)**: Destination discovery with search, filters (Beach, Mountain, City, Cultural, Adventure), and detailed destination dialogs including real-time Tours & Activities (Amadeus API), climate, and visa info.
    - **Borders (`/borders`)**: Real-time visa and entry requirement checks based on passport nationality using the Passport Index API, with color-coded statuses.
    - **Flights (`/flights`)**: Real-time flight search (one-way/round-trip) powered by Amadeus API, including airport autocomplete.
- **Authenticated Pages**:
    - **My Trips (`/trips`)**: Manage created trips.
    - **Trip Details (`/trips/:id`)**: View trip details, itinerary, and expenses.
    - **New Trip (`/new-trip`)**: Create new trips.
- **Budget Tracking**: Add, edit, and delete expenses with categories, amounts, and dates, including total expense calculation per trip.
- **Mobile Navigation**: Bottom navigation bar with Home, Borders, Flights, Trips, and Profile/Menu items.

## External Dependencies

### Third-Party Services
-   **Replit Platform Services**:
    -   **Replit Auth**: OIDC identity provider.
    -   **Neon Database**: Serverless PostgreSQL hosting.
-   **External APIs**:
    -   **Passport Index API**: `https://rough-sun-2523.fly.dev` for real-time visa requirements (no API key).
    -   **Amadeus API**: `https://test.api.amadeus.com` for flight search, airport autocomplete, flight inspiration, and tours & activities (OAuth 2.0 client credentials).

### Key NPM Packages
-   **UI & Component Libraries**: `@radix-ui/*`, `tailwindcss`, `class-variance-authority`, `clsx`, `lucide-react`, `date-fns`.
-   **Form Handling & Validation**: `react-hook-form`, `@hookform/resolvers`, `zod`, `drizzle-zod`.
-   **Authentication**: `passport`, `openid-client`, `express-session`, `connect-pg-simple`.
-   **Database & ORM**: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `ws`.
-   **Build & Development**: `vite`, `@vitejs/plugin-react`, `esbuild`, `tsx`.