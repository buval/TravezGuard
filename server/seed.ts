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
    visaRequirements: "EU/Schengen visa required for most non-EU nationals. US, UK, Canada, Australia citizens can visit visa-free for up to 90 days within 180 days.",
    travelDocuments: "Valid passport (must be valid for at least 3 months beyond stay). Proof of accommodation and return ticket may be requested at border control.",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    description: "Discover pristine alpine lakes, majestic snow-capped peaks, and charming mountain villages. Perfect for hiking, skiing, and experiencing breathtaking natural beauty in every season.",
    imageUrl: "/assets/generated_images/Mountain_lake_alpine_landscape_a7b30a6f.png",
    category: "mountain",
    featured: true,
    visaRequirements: "Schengen visa required for most non-EU nationals. US, UK, Canada, Australia, New Zealand citizens can visit visa-free for up to 90 days within 180 days.",
    travelDocuments: "Valid passport (must be valid for at least 3 months beyond departure date). Travel insurance is highly recommended. Proof of sufficient funds may be required.",
  },
  {
    name: "Tokyo",
    country: "Japan",
    description: "Immerse yourself in a fascinating blend of ultra-modern technology and ancient traditions. Explore vibrant neighborhoods, savor incredible cuisine, and experience the unique Japanese culture in this dynamic metropolis.",
    imageUrl: "/assets/generated_images/Tokyo_Japan_city_nightscape_9823a378.png",
    category: "city",
    featured: true,
    visaRequirements: "Visa-free entry for citizens of 68 countries including US, UK, Canada, Australia for stays up to 90 days. Other nationals require a tourist visa from Japanese embassy/consulate.",
    travelDocuments: "Valid passport for duration of stay. Return or onward ticket. Declaration of health and customs form completed on arrival. Some travelers may need to show proof of sufficient funds.",
  },
  {
    name: "Machu Picchu",
    country: "Peru",
    description: "Journey to the legendary Lost City of the Incas, perched high in the Andes Mountains. This archaeological wonder offers stunning mountain vistas and a glimpse into ancient civilization.",
    imageUrl: "/assets/generated_images/Machu_Picchu_Peru_ruins_7f99dac1.png",
    category: "cultural",
    featured: true,
    visaRequirements: "No visa required for US, UK, Canada, Australia, EU citizens for stays up to 90 days (tourist). Citizens of some countries require a consular visa before travel.",
    travelDocuments: "Valid passport (minimum 6 months validity). Machu Picchu entrance tickets must be purchased in advance. Tourist card (Tarjeta Andina de Migración) provided on arrival. Yellow fever vaccination certificate required if arriving from endemic areas.",
  },
  {
    name: "Cappadocia",
    country: "Turkey",
    description: "Float above fairy chimneys in a hot air balloon and explore underground cities carved into volcanic rock. This surreal landscape offers unique cave hotels and ancient history at every turn.",
    imageUrl: "/assets/generated_images/Cappadocia_Turkey_hot_air_balloons_52a3e247.png",
    category: "adventure",
    featured: true,
    visaRequirements: "E-visa available online for US, UK, Australia, China citizens (valid 180 days, allows 90-day stay). EU citizens can enter visa-free for up to 90 days. Some nationalities require consular visa.",
    travelDocuments: "Valid passport (minimum 6 months validity beyond entry date). E-visa printout if applicable. Proof of accommodation and return ticket may be requested. Travel insurance recommended.",
  },
  {
    name: "Maldives",
    country: "Maldives",
    description: "Escape to a tropical paradise with crystal-clear turquoise waters, pristine white sand beaches, and luxurious overwater villas. Perfect for diving, snorkeling, and ultimate relaxation.",
    imageUrl: "/assets/generated_images/Maldives_overwater_bungalows_paradise_b727e2cb.png",
    category: "beach",
    featured: true,
    visaRequirements: "Free 30-day tourist visa on arrival for all nationalities. Can be extended up to 90 days. No pre-arranged visa required.",
    travelDocuments: "Valid passport (minimum 6 months validity). Confirmed hotel booking or resort reservation. Return/onward ticket. Sufficient funds for stay (credit card statement or cash). Completed health declaration and immigration arrival card.",
  },
  {
    name: "Paris",
    country: "France",
    description: "Fall in love with the City of Light, home to the Eiffel Tower, Louvre Museum, and charming cafes. Experience world-class art, cuisine, and romance in one of Europe's most iconic cities.",
    imageUrl: "/assets/generated_images/Paris_Eiffel_Tower_twilight_4567ec69.png",
    category: "city",
    featured: false,
    visaRequirements: "Schengen visa required for most non-EU nationals. US, UK, Canada, Australia, Japan citizens can visit visa-free for up to 90 days within 180 days for tourism or business.",
    travelDocuments: "Valid passport (must be valid for at least 3 months beyond departure). Proof of accommodation in France. Travel insurance covering minimum €30,000 medical expenses (recommended). Return ticket and proof of sufficient funds may be required.",
  },
  {
    name: "Serengeti",
    country: "Tanzania",
    description: "Witness the Great Migration and encounter Africa's incredible wildlife in their natural habitat. Experience unforgettable safari adventures across vast golden savannas under endless African skies.",
    imageUrl: "/assets/generated_images/African_safari_sunset_landscape_b72df65e.png",
    category: "adventure",
    featured: false,
    visaRequirements: "Visa required for most nationalities. Available as e-visa online (recommended, $50 USD) or on arrival ($50-100 USD). US, UK, EU, Canada, Australia citizens eligible for visa on arrival.",
    travelDocuments: "Valid passport (minimum 6 months validity). Yellow fever vaccination certificate (mandatory if arriving from yellow fever endemic country, recommended for all). Proof of accommodation/safari booking and return ticket may be requested.",
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
