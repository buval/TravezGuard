import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - Required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - Required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Destinations table - Predefined travel destinations
export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  country: text("country").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // e.g., "beach", "mountain", "city", "cultural", "adventure"
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
  createdAt: true,
});

export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

// Trips table - User-created trips
export const trips = pgTable("trips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  destinationId: varchar("destination_id").references(() => destinations.id),
  title: text("title").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTripSchema = createInsertSchema(trips).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;

// Itinerary items table - Day-by-day activities for trips
export const itineraryItems = pgTable("itinerary_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tripId: varchar("trip_id").notNull().references(() => trips.id, { onDelete: 'cascade' }),
  day: integer("day").notNull(), // Day number in the trip (1, 2, 3, etc.)
  time: text("time"), // e.g., "09:00 AM", "14:30"
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  type: text("type").notNull(), // e.g., "activity", "dining", "accommodation", "transport"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertItineraryItemSchema = createInsertSchema(itineraryItems).omit({
  id: true,
  createdAt: true,
});

export type InsertItineraryItem = z.infer<typeof insertItineraryItemSchema>;
export type ItineraryItem = typeof itineraryItems.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  trips: many(trips),
}));

export const destinationsRelations = relations(destinations, ({ many }) => ({
  trips: many(trips),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  user: one(users, {
    fields: [trips.userId],
    references: [users.id],
  }),
  destination: one(destinations, {
    fields: [trips.destinationId],
    references: [destinations.id],
  }),
  itineraryItems: many(itineraryItems),
}));

export const itineraryItemsRelations = relations(itineraryItems, ({ one }) => ({
  trip: one(trips, {
    fields: [itineraryItems.tripId],
    references: [trips.id],
  }),
}));
