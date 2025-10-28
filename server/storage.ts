// Database storage implementation
import {
  users,
  destinations,
  trips,
  itineraryItems,
  type User,
  type UpsertUser,
  type Destination,
  type InsertDestination,
  type Trip,
  type InsertTrip,
  type ItineraryItem,
  type InsertItineraryItem,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (Required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Destination operations
  getDestinations(): Promise<Destination[]>;
  getFeaturedDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  // Trip operations
  getUserTrips(userId: string): Promise<(Trip & { destination: Destination | null })[]>;
  getTrip(id: string): Promise<(Trip & { destination: Destination | null; itineraryItems: ItineraryItem[] }) | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: string, trip: Partial<InsertTrip>): Promise<Trip | undefined>;
  deleteTrip(id: string): Promise<void>;
  
  // Itinerary operations
  getTripItineraryItems(tripId: string): Promise<ItineraryItem[]>;
  createItineraryItem(item: InsertItineraryItem): Promise<ItineraryItem>;
  deleteItineraryItem(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (Required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Destination operations
  async getDestinations(): Promise<Destination[]> {
    return await db.select().from(destinations);
  }

  async getFeaturedDestinations(): Promise<Destination[]> {
    return await db.select().from(destinations).where(eq(destinations.featured, true));
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
    return destination;
  }

  async createDestination(destinationData: InsertDestination): Promise<Destination> {
    const [destination] = await db
      .insert(destinations)
      .values(destinationData)
      .returning();
    return destination;
  }

  // Trip operations
  async getUserTrips(userId: string): Promise<(Trip & { destination: Destination | null })[]> {
    const results = await db.query.trips.findMany({
      where: eq(trips.userId, userId),
      with: {
        destination: true,
      },
      orderBy: [desc(trips.createdAt)],
    });
    return results;
  }

  async getTrip(id: string): Promise<(Trip & { destination: Destination | null; itineraryItems: ItineraryItem[] }) | undefined> {
    const result = await db.query.trips.findFirst({
      where: eq(trips.id, id),
      with: {
        destination: true,
        itineraryItems: {
          orderBy: (items, { asc }) => [asc(items.day), asc(items.time)],
        },
      },
    });
    return result;
  }

  async createTrip(tripData: InsertTrip): Promise<Trip> {
    const [trip] = await db
      .insert(trips)
      .values(tripData)
      .returning();
    return trip;
  }

  async updateTrip(id: string, tripData: Partial<InsertTrip>): Promise<Trip | undefined> {
    const [trip] = await db
      .update(trips)
      .set({ ...tripData, updatedAt: new Date() })
      .where(eq(trips.id, id))
      .returning();
    return trip;
  }

  async deleteTrip(id: string): Promise<void> {
    await db.delete(trips).where(eq(trips.id, id));
  }

  // Itinerary operations
  async getTripItineraryItems(tripId: string): Promise<ItineraryItem[]> {
    return await db.select().from(itineraryItems).where(eq(itineraryItems.tripId, tripId));
  }

  async createItineraryItem(itemData: InsertItineraryItem): Promise<ItineraryItem> {
    const [item] = await db
      .insert(itineraryItems)
      .values(itemData)
      .returning();
    return item;
  }

  async deleteItineraryItem(id: string): Promise<void> {
    await db.delete(itineraryItems).where(eq(itineraryItems.id, id));
  }
}

export const storage = new DatabaseStorage();
