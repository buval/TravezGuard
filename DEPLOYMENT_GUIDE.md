# Travez Deployment Guide

This guide covers everything needed to deploy Travez on another hosting platform.

## Project Overview

Travez is a mobile-first travel planning PWA built with:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon-compatible)
- **ORM**: Drizzle ORM

## Required Environment Variables

Create a `.env` file or set these environment variables on your hosting platform:

### Database (Required)
```
DATABASE_URL=postgresql://username:password@host:port/database
PGHOST=your-postgres-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database-name
```

### Session (Required)
```
SESSION_SECRET=your-random-session-secret-at-least-32-characters
```

### Amadeus API (Required for Flights & Destinations)
Get credentials at: https://developers.amadeus.com/
```
AMADEUS_API_KEY=your-amadeus-api-key
AMADEUS_API_SECRET=your-amadeus-api-secret
```

### Unsplash API (Optional - for destination images)
Get credentials at: https://unsplash.com/developers
```
UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

## Database Setup

### Option 1: Import existing data
```bash
# Import the database export
psql $DATABASE_URL < database_export.sql
```

### Option 2: Fresh database with schema only
```bash
# Push the schema to create tables
npm run db:push
```

## Installation & Build

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

## Development

```bash
# Start development server
npm run dev
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
├── server/                 # Express backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── index.ts           # Server entry point
├── shared/                 # Shared types & schema
│   └── schema.ts          # Drizzle schema definitions
├── attached_assets/        # Generated images
└── database_export.sql    # Database dump
```

## API Endpoints

### Public Endpoints
- `GET /api/destinations` - List all destinations
- `GET /api/destinations/search?q=` - Search destinations
- `GET /api/airports/search?q=` - Search airports
- `GET /api/flights/search` - Search flights
- `GET /api/visa-requirements/:from/:to` - Visa requirements
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Protected Endpoints (require authentication)
- `GET /api/user` - Get current user
- `GET /api/trips` - List user's trips
- `POST /api/trips` - Create trip
- `GET /api/trips/:id` - Get trip details
- `POST /api/trips/:id/itinerary` - Add itinerary item
- `POST /api/trips/:id/expenses` - Add expense

## External APIs Used

1. **Amadeus API** - Flight search, airport autocomplete, tours & activities
2. **Passport Index API** - Visa requirements (no API key needed)
3. **Unsplash API** - Destination images (optional)

## Hosting Recommendations

### Recommended Platforms
- **Vercel** - Great for Node.js apps
- **Railway** - Easy PostgreSQL + Node.js
- **Render** - Free tier available
- **Fly.io** - Good for global deployment
- **DigitalOcean App Platform** - Simple deployment

### PostgreSQL Providers
- **Neon** - Serverless PostgreSQL (current)
- **Supabase** - PostgreSQL with extras
- **Railway** - Managed PostgreSQL
- **PlanetScale** - MySQL alternative

## Port Configuration

The app serves on port 5000 by default. Set the `PORT` environment variable to change this.

## Notes

- The app uses session-based authentication with cookies
- Passwords are hashed using scrypt
- The Amadeus API is in test mode (sandbox)
- For production, upgrade to Amadeus production credentials
