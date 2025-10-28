// Seed initial destination data
import { db } from "./db";
import { destinations } from "@shared/schema";

const seedDestinations = [
  {
    name: "Santorini",
    country: "Greece",
    description: "Experience the iconic white-washed buildings, blue-domed churches, and stunning sunsets over the Aegean Sea. Santorini offers world-class wine, volcanic beaches, and romantic villages perched on dramatic cliffs.",
    imageUrl: "/assets/generated_images/Santorini_Greece_destination_ed8bbac7.png",
    category: "beach",
    featured: true,
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    description: "Discover pristine alpine lakes, majestic snow-capped peaks, and charming mountain villages. Perfect for hiking, skiing, and experiencing breathtaking natural beauty in every season.",
    imageUrl: "/assets/generated_images/Mountain_lake_alpine_landscape_a7b30a6f.png",
    category: "mountain",
    featured: true,
  },
  {
    name: "Tokyo",
    country: "Japan",
    description: "Immerse yourself in a fascinating blend of ultra-modern technology and ancient traditions. Explore vibrant neighborhoods, savor incredible cuisine, and experience the unique Japanese culture in this dynamic metropolis.",
    imageUrl: "/assets/generated_images/Tokyo_Japan_city_nightscape_9823a378.png",
    category: "city",
    featured: true,
  },
  {
    name: "Machu Picchu",
    country: "Peru",
    description: "Journey to the legendary Lost City of the Incas, perched high in the Andes Mountains. This archaeological wonder offers stunning mountain vistas and a glimpse into ancient civilization.",
    imageUrl: "/assets/generated_images/Machu_Picchu_Peru_ruins_7f99dac1.png",
    category: "cultural",
    featured: true,
  },
  {
    name: "Cappadocia",
    country: "Turkey",
    description: "Float above fairy chimneys in a hot air balloon and explore underground cities carved into volcanic rock. This surreal landscape offers unique cave hotels and ancient history at every turn.",
    imageUrl: "/assets/generated_images/Cappadocia_Turkey_hot_air_balloons_52a3e247.png",
    category: "adventure",
    featured: true,
  },
  {
    name: "Maldives",
    country: "Maldives",
    description: "Escape to a tropical paradise with crystal-clear turquoise waters, pristine white sand beaches, and luxurious overwater villas. Perfect for diving, snorkeling, and ultimate relaxation.",
    imageUrl: "/assets/generated_images/Maldives_overwater_bungalows_paradise_b727e2cb.png",
    category: "beach",
    featured: true,
  },
  {
    name: "Paris",
    country: "France",
    description: "Fall in love with the City of Light, home to the Eiffel Tower, Louvre Museum, and charming cafes. Experience world-class art, cuisine, and romance in one of Europe's most iconic cities.",
    imageUrl: "/assets/generated_images/Paris_Eiffel_Tower_twilight_4567ec69.png",
    category: "city",
    featured: false,
  },
  {
    name: "Serengeti",
    country: "Tanzania",
    description: "Witness the Great Migration and encounter Africa's incredible wildlife in their natural habitat. Experience unforgettable safari adventures across vast golden savannas under endless African skies.",
    imageUrl: "/assets/generated_images/African_safari_sunset_landscape_b72df65e.png",
    category: "adventure",
    featured: false,
  },
];

export async function seedDatabase() {
  try {
    console.log("Seeding destinations...");
    
    // Check if destinations already exist
    const existing = await db.select().from(destinations).limit(1);
    if (existing.length > 0) {
      console.log("Destinations already seeded, skipping...");
      return;
    }

    // Insert all destinations
    await db.insert(destinations).values(seedDestinations);
    
    console.log(`Successfully seeded ${seedDestinations.length} destinations`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
