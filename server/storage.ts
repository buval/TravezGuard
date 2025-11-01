// Database storage implementation
import {
  users,
  destinations,
  trips,
  itineraryItems,
  expenses,
  type User,
  type InsertUser,
  type Destination,
  type InsertDestination,
  type Trip,
  type InsertTrip,
  type ItineraryItem,
  type InsertItineraryItem,
  type Expense,
  type InsertExpense,
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;
  
  // Destination operations
  getDestinations(): Promise<Destination[]>;
  getFeaturedDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  // Trip operations
  getUserTrips(userId: string): Promise<(Trip & { destination: Destination | null })[]>;
  getTrip(id: string): Promise<(Trip & { destination: Destination | null; itineraryItems: ItineraryItem[]; expenses: Expense[] }) | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: string, trip: Partial<InsertTrip>): Promise<Trip | undefined>;
  deleteTrip(id: string): Promise<void>;
  
  // Itinerary operations
  getTripItineraryItems(tripId: string): Promise<ItineraryItem[]>;
  createItineraryItem(item: InsertItineraryItem): Promise<ItineraryItem>;
  deleteItineraryItem(id: string): Promise<void>;
  
  // Expense operations
  getExpensesByTripId(tripId: string): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: string, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
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

  async getTrip(id: string): Promise<(Trip & { destination: Destination | null; itineraryItems: ItineraryItem[]; expenses: Expense[] }) | undefined> {
    const result = await db.query.trips.findFirst({
      where: eq(trips.id, id),
      with: {
        destination: true,
        itineraryItems: {
          orderBy: (items, { asc }) => [asc(items.day), asc(items.time)],
        },
        expenses: {
          orderBy: (expenses, { desc }) => [desc(expenses.date)],
        },
      },
    });
    return result as any;
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

  // Expense operations
  async getExpensesByTripId(tripId: string): Promise<Expense[]> {
    return await db.select().from(expenses).where(eq(expenses.tripId, tripId)).orderBy(desc(expenses.date));
  }

  async createExpense(expenseData: InsertExpense): Promise<Expense> {
    const [expense] = await db
      .insert(expenses)
      .values(expenseData)
      .returning();
    return expense;
  }

  async updateExpense(id: string, expenseData: Partial<InsertExpense>): Promise<Expense | undefined> {
    const [expense] = await db
      .update(expenses)
      .set(expenseData)
      .where(eq(expenses.id, id))
      .returning();
    return expense;
  }

  async deleteExpense(id: string): Promise<void> {
    await db.delete(expenses).where(eq(expenses.id, id));
  }
}

export const storage = new DatabaseStorage();
