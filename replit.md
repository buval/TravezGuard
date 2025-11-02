# Travez - Travel Planning Application

## Overview
Travez is a mobile-first travel planning application designed to inspire travel and simplify itinerary creation. It enables users to discover destinations, plan trips, and build detailed day-by-day itineraries with a rich, app-like interface. The platform focuses on visual appeal, effortless navigation, and comprehensive travel information, including visa requirements, climate data, and real-time flight searches. Travez aims to be a go-to platform for travelers, offering a seamless experience from destination discovery to detailed trip execution.

## Recent Changes (November 2025)

### Investor Pitch PDF Generation (November 2, 2025)
- **PDF Export**: Added comprehensive investor pitch PDF generation using pdf-lib library
- **Professional Document**: 4-page investor document including:
  - Executive summary and market opportunity
  - Core platform features and capabilities
  - Technology stack and API integrations
  - Competitive advantages and development roadmap
- **Easy Access**: Download button in Profile page (`/api/investor-pitch` endpoint)
- **Professional Layout**: Manual text positioning with proper spacing, headers, and formatting
- **Implementation**: Backend route generates PDF on-demand without external dependencies beyond pdf-lib

### Flight Search Diversification & Enhancement (November 2, 2025)
- **Intelligent Result Diversification**: Enhanced flight search algorithm to provide more realistic and varied results
  - Requests 100 flights from Amadeus API, then intelligently selects the most diverse 15-20
  - Balanced mix: ~40% direct flights, ~40% one-stop, ~20% two+ stops
  - Departure times spread across morning (6am-12pm), afternoon (12pm-6pm), evening (6pm-10pm), and night (10pm-6am)
  - Round-robin selection ensures flights span different times of day
  - Results sorted by price after diversification
- **Professional Flight Display**: Flight results now show airline names (e.g., "American Airlines") instead of codes (e.g., "AA"), aircraft types (e.g., "Boeing 737 • Narrow-body"), and baggage information with visual badges
- **Flight Details Dialog**: Comprehensive popup showing:
  - Fare class and ticket type (Basic/Standard based on price)
  - Baggage allowance (carry-on and checked bags)
  - Segment-by-segment breakdown with layover times
  - Aircraft type for each flight segment
  - Total duration calculation
  - In-flight amenities (WiFi, entertainment, meals)
- **Airport Information Dialog**: Clickable airport codes display airport details, website links, and facility information
- **Airline Database**: Created comprehensive airline code-to-name mapping utility with 50+ major airlines
- **Aircraft Database**: Added aircraft type information for common aircraft models (Boeing, Airbus, Embraer, etc.)
- **Type Safety**: Implemented proper TypeScript types for flight data (FlightOffer, FlightSegment, FlightItinerary) in shared schema
- **Deterministic Logic**: All flight information (fare class, layover times) calculated from actual data - no random values

### Destination Dialog Layout Improvements (November 2, 2025)
- **Image Layout Fix**: Changed destination dialog image from 16:9 aspect ratio to fixed 192px height to prevent content from being hidden when Amadeus activities load. This ensures activities are always visible without excessive scrolling.
- **POI Integration Removal**: Removed decommissioned Amadeus POI (Points of Interest) API that was returning HTTP 410 Gone errors. Frontend now focuses solely on Tours & Activities which continue to work properly.
- **Cleaner Dialog**: Streamlined destination details with better vertical space management for activity content.

### Production Database Seeding Fix (November 1, 2025)
- **Issue Fixed**: Production database only had 8 destinations while development had 20
- **Solution**: Updated `seedDatabase()` function to intelligently detect missing destinations
- **Behavior**: Now automatically adds missing destinations without duplicating existing ones
- **Impact**: After republishing, production will have all 20 destinations automatically

### Home and Explore Page Merge
- **Consolidated Functionality**: The Explore page has been merged into the Home page (`/`). All destination browsing features (search, category filters, destination cards) are now on the Home page.
- **Route Redirects**: Both `/explore` and `/home` routes now redirect to `/` to maintain backwards compatibility.
- **Improved UX**: Single unified experience for discovering destinations, available to both guest and authenticated users.

### Canadian Destinations Expansion (November 2, 2025)
Added 5 new Canadian destinations with beautiful AI-generated images:

**New Canadian Cities (Featured):**
- **Vancouver, Canada** (City) - Coastal city with mountains, ocean, and urban sophistication
- **Toronto, Canada** (City) - Iconic CN Tower, diverse neighborhoods, and cultural experiences

**New Canadian Destinations (Non-Featured):**
- **Quebec City, Canada** (Cultural) - European-style walled city with French heritage
- **Whistler, Canada** (Mountain) - Premier ski resort with world-class slopes
- **Niagara Falls, Canada** (Adventure) - Powerful waterfalls and natural wonder

**Total Canadian Destinations**: Now **6 destinations** including the original Banff.

### Expanded Destination Database (Previous Updates)
Added 12 stunning destinations with beautiful AI-generated images:

**Featured Destinations:**
- **Bali, Indonesia** (Beach) - Lush rice terraces, ancient temples, and pristine beaches
- **Iceland** (Adventure) - Northern Lights, volcanoes, glaciers, and geysers
- **New York City, USA** (City) - Iconic skyline, world-class museums, and Broadway
- **Dubai, UAE** (City) - Futuristic skyscrapers, luxury shopping, and Arabian culture
- **Petra, Jordan** (Cultural) - Ancient rose-red city carved into sandstone cliffs
- **Banff, Canada** (Mountain) - Turquoise lakes, Rocky Mountains, and pristine wilderness

**Non-Featured Destinations:**
- **Bora Bora, French Polynesia** (Beach) - Overwater bungalows and crystal-clear lagoons
- **Venice, Italy** (City) - Romantic canals, gondolas, and Byzantine architecture
- **Norwegian Fjords, Norway** (Mountain) - Dramatic cliffs, waterfalls, and midnight sun
- **Barcelona, Spain** (City) - Gaudí masterpieces, beaches, and Catalan culture
- **Great Barrier Reef, Australia** (Beach) - World's largest coral reef system
- **Marrakech, Morocco** (Cultural) - Vibrant souks, palaces, and exotic gardens

**Total Destinations**: Now **25 destinations** (previously 20), each with comprehensive visa requirements, climate data, best months to visit, and geographic coordinates.

### Updated Navigation
- **Mobile Navigation**: Bottom nav bar now has **5 items** (previously 6):
  - Home, Borders, Flights, Trips, Profile
  - Removed separate "Explore" navigation item
- **Cleaner Interface**: Streamlined navigation reflects the merged Home/Explore experience

### Combined Destination Search (Local Database + Amadeus API)
- **Intelligent Search**: When users search for destinations, the app now queries both:
  - Local database (25 curated destinations)
  - Amadeus API (thousands of cities worldwide)
- **Visual Distinction**: 
  - Database destinations: Show full details with images, descriptions, climate, and visa info
  - Amadeus destinations: Marked with "Explore" badge and gradient background
- **Debounced Search**: 300ms debounce prevents excessive API calls while typing
- **Dual Dialogs**:
  - Database destinations: Full destination details with climate, visa requirements, and tours & activities
  - Amadeus cities: Simplified dialog with city information, coordinates, IATA code, and tours & activities (if available)
- **Seamless Experience**: Users can discover destinations beyond the curated collection without needing to store them in the database
- **Smart Error Handling**: If Amadeus API fails, search continues with local results only

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
- **Authentication**: Custom username/password authentication integrated via Passport.js with LocalStrategy, using `express-session` and a PostgreSQL session store. Passwords are securely hashed using scrypt.
- **Authorization**: Session-based, with `isAuthenticated` middleware protecting routes and user data scoped to the authenticated user.

### Application Features
- **Public Pages**:
    - **Home (`/`)**: Destination discovery with combined search (local database + Amadeus API), filters (Beach, Mountain, City, Cultural, Adventure), and detailed destination dialogs including real-time Tours & Activities (Amadeus API), climate, and visa info. Search discovers thousands of cities worldwide beyond the 25 curated destinations.
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
    -   **Amadeus API**: `https://test.api.amadeus.com` for:
        -   Flight search and airport autocomplete
        -   Flight inspiration
        -   Tours & activities
        -   **City/destination search** (new: searches thousands of cities worldwide)
        -   Authentication via OAuth 2.0 client credentials with token caching

### Key NPM Packages
-   **UI & Component Libraries**: `@radix-ui/*`, `tailwindcss`, `class-variance-authority`, `clsx`, `lucide-react`, `date-fns`.
-   **Form Handling & Validation**: `react-hook-form`, `@hookform/resolvers`, `zod`, `drizzle-zod`.
-   **Authentication**: `passport`, `openid-client`, `express-session`, `connect-pg-simple`.
-   **Database & ORM**: `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `ws`.
-   **Build & Development**: `vite`, `@vitejs/plugin-react`, `esbuild`, `tsx`.