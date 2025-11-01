import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTripSchema, insertItineraryItemSchema, insertExpenseSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { searchFlights, searchAirports, getFlightInspiration, getPointsOfInterest, getToursAndActivities, searchCities } from "./amadeus";

// Auth middleware
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup username/password authentication
  setupAuth(app);

  // Note: /api/register, /api/login, /api/logout, /api/user routes 
  // are handled in setupAuth (auth.ts)

  // Destination routes
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      res.status(500).json({ message: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/featured", async (req, res) => {
    try {
      const destinations = await storage.getFeaturedDestinations();
      res.json(destinations);
    } catch (error) {
      console.error("Error fetching featured destinations:", error);
      res.status(500).json({ message: "Failed to fetch featured destinations" });
    }
  });

  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const destination = await storage.getDestination(req.params.id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      console.error("Error fetching destination:", error);
      res.status(500).json({ message: "Failed to fetch destination" });
    }
  });

  // Combined destination search (local DB + Amadeus API)
  app.get("/api/destinations/search", async (req, res) => {
    try {
      const { query } = req.query;

      if (!query || typeof query !== "string" || query.trim().length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters" });
      }

      const searchTerm = query.trim().toLowerCase();
      
      // Search local database
      const allDestinations = await storage.getDestinations();
      const localResults = allDestinations.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm) ||
        dest.country.toLowerCase().includes(searchTerm) ||
        dest.description.toLowerCase().includes(searchTerm)
      ).map(dest => ({
        ...dest,
        source: "database" as const,
      }));

      // Search Amadeus API for cities (with error handling)
      let amadeusResults: any[] = [];
      try {
        const amadeusResponse = await searchCities(query);
        amadeusResults = (amadeusResponse.data || []).map((city: any) => ({
          id: city.iataCode || city.id,
          name: city.name,
          country: city.address?.countryName || "Unknown",
          iataCode: city.iataCode,
          geoCode: city.geoCode,
          source: "amadeus" as const,
          type: city.type,
        }));
      } catch (error) {
        console.error("Amadeus search error (non-blocking):", error);
        // Continue with just local results if Amadeus fails
      }

      // Combine results (prioritize local results)
      const combinedResults = [...localResults, ...amadeusResults];

      res.json({
        results: combinedResults,
        localCount: localResults.length,
        amadeusCount: amadeusResults.length,
      });
    } catch (error: any) {
      console.error("Destination search error:", error);
      res.status(500).json({ message: error.message || "Failed to search destinations" });
    }
  });

  // Flight routes (public - accessible to guests and authenticated users)
  app.get("/api/flights/search", async (req, res) => {
    try {
      const { origin, destination, departureDate, returnDate, adults } = req.query;

      if (!origin || !destination || !departureDate || !adults) {
        return res.status(400).json({ 
          message: "Missing required parameters: origin, destination, departureDate, adults" 
        });
      }

      const results = await searchFlights({
        originLocationCode: origin as string,
        destinationLocationCode: destination as string,
        departureDate: departureDate as string,
        returnDate: returnDate as string | undefined,
        adults: parseInt(adults as string),
        max: 20,
      });

      res.json(results);
    } catch (error: any) {
      console.error("Flight search error:", error);
      res.status(500).json({ message: error.message || "Failed to search flights" });
    }
  });

  app.get("/api/airports/search", async (req, res) => {
    try {
      const { keyword } = req.query;

      if (!keyword || typeof keyword !== "string") {
        return res.status(400).json({ message: "Missing required parameter: keyword" });
      }

      const results = await searchAirports(keyword);
      res.json(results);
    } catch (error: any) {
      console.error("Airport search error:", error);
      res.status(500).json({ message: error.message || "Failed to search airports" });
    }
  });

  app.get("/api/flights/inspiration", async (req, res) => {
    try {
      const { origin, maxPrice, departureDate } = req.query;

      if (!origin || typeof origin !== "string") {
        return res.status(400).json({ message: "Missing required parameter: origin" });
      }

      const results = await getFlightInspiration({
        origin,
        maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
        departureDate: departureDate as string | undefined,
      });

      res.json(results);
    } catch (error: any) {
      console.error("Flight inspiration error:", error);
      res.status(500).json({ message: error.message || "Failed to get flight inspiration" });
    }
  });

  // Destination Experiences routes (public - accessible to guests and authenticated users)
  app.get("/api/destinations/:id/pois", async (req, res) => {
    try {
      const destination = await storage.getDestination(req.params.id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }

      if (!destination.latitude || !destination.longitude) {
        return res.status(400).json({ 
          message: "Destination coordinates not available" 
        });
      }

      const results = await getPointsOfInterest({
        latitude: parseFloat(destination.latitude),
        longitude: parseFloat(destination.longitude),
        radius: 5,
      });

      res.json(results);
    } catch (error: any) {
      console.error("POI search error:", error);
      
      // Handle decommissioned API gracefully (410 Gone)
      if (error.status === 410 || error.message?.includes("decommissioned")) {
        return res.json({ data: [], meta: { count: 0 } });
      }
      
      // Return empty result for other errors to prevent UI from breaking
      res.json({ data: [], meta: { count: 0 } });
    }
  });

  app.get("/api/destinations/:id/activities", async (req, res) => {
    try {
      const destination = await storage.getDestination(req.params.id);
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }

      if (!destination.latitude || !destination.longitude) {
        return res.status(400).json({ 
          message: "Destination coordinates not available" 
        });
      }

      const results = await getToursAndActivities({
        latitude: parseFloat(destination.latitude),
        longitude: parseFloat(destination.longitude),
        radius: 5,
      });

      res.json(results);
    } catch (error: any) {
      console.error("Activities search error:", error);
      
      // Handle decommissioned API or other errors gracefully
      if (error.status === 410 || error.message?.includes("decommissioned")) {
        return res.json({ data: [], meta: { count: 0 } });
      }
      
      // Return empty result for other errors to prevent UI from breaking
      res.json({ data: [], meta: { count: 0 } });
    }
  });

  // Trip routes (protected)
  app.get("/api/trips", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user!.id;
      const trips = await storage.getUserTrips(userId);
      res.json(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });

  app.get("/api/trips/:id", isAuthenticated, async (req: any, res) => {
    try {
      const trip = await storage.getTrip(req.params.id);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      
      // Verify the trip belongs to the authenticated user
      if (trip.userId !== req.user!.id) {
        return res.status(403).json({ message: "Forbidden - You don't own this trip" });
      }
      
      res.json(trip);
    } catch (error) {
      console.error("Error fetching trip:", error);
      res.status(500).json({ message: "Failed to fetch trip" });
    }
  });

  app.post("/api/trips", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user!.id;
      
      const validation = insertTripSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: fromZodError(validation.error).toString(),
        });
      }

      const trip = await storage.createTrip({
        ...validation.data,
        userId,
      });
      
      res.status(201).json(trip);
    } catch (error) {
      console.error("Error creating trip:", error);
      res.status(500).json({ message: "Failed to create trip" });
    }
  });

  app.patch("/api/trips/:id", isAuthenticated, async (req, res) => {
    try {
      const trip = await storage.updateTrip(req.params.id, req.body);
      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      console.error("Error updating trip:", error);
      res.status(500).json({ message: "Failed to update trip" });
    }
  });

  app.delete("/api/trips/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteTrip(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting trip:", error);
      res.status(500).json({ message: "Failed to delete trip" });
    }
  });

  // Itinerary item routes (protected)
  app.get("/api/trips/:tripId/itinerary", async (req, res) => {
    try {
      const items = await storage.getTripItineraryItems(req.params.tripId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching itinerary items:", error);
      res.status(500).json({ message: "Failed to fetch itinerary items" });
    }
  });

  app.post("/api/itinerary-items", isAuthenticated, async (req, res) => {
    try {
      const validation = insertItineraryItemSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: fromZodError(validation.error).toString(),
        });
      }

      const item = await storage.createItineraryItem(validation.data);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating itinerary item:", error);
      res.status(500).json({ message: "Failed to create itinerary item" });
    }
  });

  app.delete("/api/itinerary-items/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteItineraryItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting itinerary item:", error);
      res.status(500).json({ message: "Failed to delete itinerary item" });
    }
  });

  // Expense routes (protected)
  app.get("/api/trips/:tripId/expenses", async (req, res) => {
    try {
      const expenses = await storage.getExpensesByTripId(req.params.tripId);
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", isAuthenticated, async (req, res) => {
    try {
      const validation = insertExpenseSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: fromZodError(validation.error).toString(),
        });
      }

      const expense = await storage.createExpense(validation.data);
      res.status(201).json(expense);
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({ message: "Failed to create expense" });
    }
  });

  app.patch("/api/expenses/:id", isAuthenticated, async (req, res) => {
    try {
      const expense = await storage.updateExpense(req.params.id, req.body);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      console.error("Error updating expense:", error);
      res.status(500).json({ message: "Failed to update expense" });
    }
  });

  app.delete("/api/expenses/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteExpense(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting expense:", error);
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
