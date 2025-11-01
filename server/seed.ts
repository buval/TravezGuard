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
    latitude: "36.3932",
    longitude: "25.4615",
    visaRequirements: "EU/Schengen visa required for most non-EU nationals. US, UK, Canada, Australia citizens can visit visa-free for up to 90 days within 180 days.",
    travelDocuments: "Valid passport (must be valid for at least 3 months beyond stay). Proof of accommodation and return ticket may be requested at border control.",
    climate: "Mediterranean climate with hot, dry summers and mild winters. Summer temperatures range from 25-30°C (77-86°F), perfect for beach activities. Winters are mild at 10-15°C (50-59°F) with occasional rain.",
    bestMonths: "April-May, September-October for pleasant weather and fewer crowds. July-August for beach season (hot and busy).",
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    description: "Discover pristine alpine lakes, majestic snow-capped peaks, and charming mountain villages. Perfect for hiking, skiing, and experiencing breathtaking natural beauty in every season.",
    imageUrl: "/assets/generated_images/Mountain_lake_alpine_landscape_a7b30a6f.png",
    category: "mountain",
    featured: true,
    latitude: "46.5197",
    longitude: "8.0551",
    visaRequirements: "Schengen visa required for most non-EU nationals. US, UK, Canada, Australia, New Zealand citizens can visit visa-free for up to 90 days within 180 days.",
    travelDocuments: "Valid passport (must be valid for at least 3 months beyond departure date). Travel insurance is highly recommended. Proof of sufficient funds may be required.",
    climate: "Alpine climate with four distinct seasons. Summers (June-August) are warm at 15-25°C (59-77°F), ideal for hiking. Winters (December-March) are cold and snowy at -2 to 7°C (28-45°F), perfect for skiing. Spring and fall are mild but unpredictable.",
    bestMonths: "June-September for hiking and summer activities. December-March for skiing and winter sports. May and October for quieter visits with mild weather.",
  },
  {
    name: "Tokyo",
    country: "Japan",
    description: "Immerse yourself in a fascinating blend of ultra-modern technology and ancient traditions. Explore vibrant neighborhoods, savor incredible cuisine, and experience the unique Japanese culture in this dynamic metropolis.",
    imageUrl: "/assets/generated_images/Tokyo_Japan_city_nightscape_9823a378.png",
    category: "city",
    featured: true,
    latitude: "35.6762",
    longitude: "139.6503",
    visaRequirements: "Visa-free entry for citizens of 68 countries including US, UK, Canada, Australia for stays up to 90 days. Other nationals require a tourist visa from Japanese embassy/consulate.",
    travelDocuments: "Valid passport for duration of stay. Return or onward ticket. Declaration of health and customs form completed on arrival. Some travelers may need to show proof of sufficient funds.",
    climate: "Humid subtropical climate with hot, humid summers and mild winters. Summer temperatures reach 25-32°C (77-90°F) with high humidity. Winters are cool at 5-12°C (41-54°F) with occasional snow. Spring and autumn are comfortable.",
    bestMonths: "March-May for cherry blossoms and pleasant weather. September-November for fall foliage and mild temperatures. Avoid July-August (hot and humid) and rainy season (June-early July).",
  },
  {
    name: "Machu Picchu",
    country: "Peru",
    description: "Journey to the legendary Lost City of the Incas, perched high in the Andes Mountains. This archaeological wonder offers stunning mountain vistas and a glimpse into ancient civilization.",
    imageUrl: "/assets/generated_images/Machu_Picchu_Peru_ruins_7f99dac1.png",
    category: "cultural",
    featured: true,
    latitude: "-13.1631",
    longitude: "-72.5450",
    visaRequirements: "No visa required for US, UK, Canada, Australia, EU citizens for stays up to 90 days (tourist). Citizens of some countries require a consular visa before travel.",
    travelDocuments: "Valid passport (minimum 6 months validity). Machu Picchu entrance tickets must be purchased in advance. Tourist card (Tarjeta Andina de Migración) provided on arrival. Yellow fever vaccination certificate required if arriving from endemic areas.",
    climate: "Tropical mountain climate with wet and dry seasons. Dry season (May-September) has clear days at 12-20°C (54-68°F) but cold nights. Wet season (November-March) brings afternoon rain and warmer days at 16-22°C (61-72°F). High altitude means cool temperatures year-round.",
    bestMonths: "April-May, September-October for fewer crowds and good weather. June-August for driest conditions (peak tourist season). Avoid January-February (heavy rain can close Inca Trail).",
  },
  {
    name: "Cappadocia",
    country: "Turkey",
    description: "Float above fairy chimneys in a hot air balloon and explore underground cities carved into volcanic rock. This surreal landscape offers unique cave hotels and ancient history at every turn.",
    imageUrl: "/assets/generated_images/Cappadocia_Turkey_hot_air_balloons_52a3e247.png",
    category: "adventure",
    featured: true,
    latitude: "38.6431",
    longitude: "34.8289",
    visaRequirements: "E-visa available online for US, UK, Australia, China citizens (valid 180 days, allows 90-day stay). EU citizens can enter visa-free for up to 90 days. Some nationalities require consular visa.",
    travelDocuments: "Valid passport (minimum 6 months validity beyond entry date). E-visa printout if applicable. Proof of accommodation and return ticket may be requested. Travel insurance recommended.",
    climate: "Continental climate with hot, dry summers and cold, snowy winters. Summers (June-September) reach 25-35°C (77-95°F) with very low humidity. Winters (December-March) are freezing at -10 to 5°C (14-41°F) with frequent snowfall. Spring and autumn are mild.",
    bestMonths: "April-May, September-October for hot air balloon flights and comfortable temperatures. June-August for warm weather (peak season). December-February for winter wonderland scenery but very cold.",
  },
  {
    name: "Maldives",
    country: "Maldives",
    description: "Escape to a tropical paradise with crystal-clear turquoise waters, pristine white sand beaches, and luxurious overwater villas. Perfect for diving, snorkeling, and ultimate relaxation.",
    imageUrl: "/assets/generated_images/Maldives_overwater_bungalows_paradise_b727e2cb.png",
    category: "beach",
    featured: true,
    latitude: "3.2028",
    longitude: "73.2207",
    visaRequirements: "Free 30-day tourist visa on arrival for all nationalities. Can be extended up to 90 days. No pre-arranged visa required.",
    travelDocuments: "Valid passport (minimum 6 months validity). Confirmed hotel booking or resort reservation. Return/onward ticket. Sufficient funds for stay (credit card statement or cash). Completed health declaration and immigration arrival card.",
    climate: "Tropical monsoon climate with year-round warm temperatures at 25-31°C (77-88°F). Dry season (November-April) has calm seas and sunny skies. Wet season (May-October) brings afternoon rain and rougher seas but still warm. High humidity year-round.",
    bestMonths: "November-April for best weather, calm seas, and diving conditions. December-March is peak season (most expensive). May-October offers lower prices but possible rain and wind.",
  },
  {
    name: "Paris",
    country: "France",
    description: "Fall in love with the City of Light, home to the Eiffel Tower, Louvre Museum, and charming cafes. Experience world-class art, cuisine, and romance in one of Europe's most iconic cities.",
    imageUrl: "/assets/generated_images/Paris_Eiffel_Tower_twilight_4567ec69.png",
    category: "city",
    featured: false,
    latitude: "48.8566",
    longitude: "2.3522",
    visaRequirements: "Schengen visa required for most non-EU nationals. US, UK, Canada, Australia, Japan citizens can visit visa-free for up to 90 days within 180 days for tourism or business.",
    travelDocuments: "Valid passport (must be valid for at least 3 months beyond departure). Proof of accommodation in France. Travel insurance covering minimum €30,000 medical expenses (recommended). Return ticket and proof of sufficient funds may be required.",
    climate: "Temperate oceanic climate with mild temperatures year-round. Summers (June-August) are warm at 20-25°C (68-77°F). Winters (December-February) are cool at 3-8°C (37-46°F) with occasional frost. Spring and autumn are pleasant but rainy. Year-round possibility of rain.",
    bestMonths: "April-June, September-October for pleasant weather and fewer tourists. July-August for warmest temperatures (crowded). Avoid November-March for gray skies and cold, though December has festive markets.",
  },
  {
    name: "Serengeti",
    country: "Tanzania",
    description: "Witness the Great Migration and encounter Africa's incredible wildlife in their natural habitat. Experience unforgettable safari adventures across vast golden savannas under endless African skies.",
    imageUrl: "/assets/generated_images/African_safari_sunset_landscape_b72df65e.png",
    category: "adventure",
    featured: false,
    latitude: "-2.3333",
    longitude: "34.8333",
    visaRequirements: "Visa required for most nationalities. Available as e-visa online (recommended, $50 USD) or on arrival ($50-100 USD). US, UK, EU, Canada, Australia citizens eligible for visa on arrival.",
    travelDocuments: "Valid passport (minimum 6 months validity). Yellow fever vaccination certificate (mandatory if arriving from yellow fever endemic country, recommended for all). Proof of accommodation/safari booking and return ticket may be requested.",
    climate: "Tropical savanna climate with wet and dry seasons. Dry season (June-October) has warm days at 20-27°C (68-81°F) and cool nights. Short rains (November-December) and long rains (March-May) bring afternoon showers. Year-round mild temperatures but variable rainfall.",
    bestMonths: "June-October for Great Migration river crossings and best game viewing. January-February for calving season in southern Serengeti. Avoid April-May (heavy rains make roads difficult).",
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
