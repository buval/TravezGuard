import axios from "axios";

// Amadeus API configuration
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;
const AMADEUS_BASE_URL = "https://test.api.amadeus.com";

// Token cache
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// Get OAuth access token
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 5 min buffer)
  if (cachedToken && Date.now() < tokenExpiry - 5 * 60 * 1000) {
    console.log("[Amadeus] Using cached token");
    return cachedToken;
  }

  console.log("[Amadeus] Getting new access token...");
  
  if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
    console.error("[Amadeus] Missing API credentials");
    throw new Error("Amadeus API credentials not configured");
  }

  try {
    const response = await axios.post(
      `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: AMADEUS_API_KEY!,
        client_secret: AMADEUS_API_SECRET!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    cachedToken = response.data.access_token;
    // Token expires in 30 minutes (1800 seconds)
    tokenExpiry = Date.now() + response.data.expires_in * 1000;

    console.log("[Amadeus] Successfully obtained access token");
    return cachedToken!;
  } catch (error: any) {
    console.error("[Amadeus] Auth error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error("Failed to authenticate with Amadeus API");
  }
}

// Search for flight offers
export async function searchFlights(params: {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  max?: number;
}) {
  console.log("[Amadeus] Searching flights:", params);
  
  try {
    const token = await getAccessToken();

    const queryParams: any = {
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults,
      max: params.max || 10,
      currencyCode: "USD",
    };

    if (params.returnDate) {
      queryParams.returnDate = params.returnDate;
    }

    console.log("[Amadeus] Request params:", queryParams);

    const response = await axios.get(
      `${AMADEUS_BASE_URL}/v2/shopping/flight-offers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
      }
    );

    console.log(`[Amadeus] Found ${response.data.data?.length || 0} flights`);
    return response.data;
  } catch (error: any) {
    console.error("[Amadeus] Flight search error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(
      error.response?.data?.errors?.[0]?.detail || "Failed to search flights"
    );
  }
}

// Additional airports for testing (not available in Amadeus test environment)
// Includes: Canadian airports and Middle East airports
const TEST_AIRPORTS = [
  {
    type: "location",
    subType: "CITY",
    name: "TORONTO",
    iataCode: "YYZ",
    geoCode: { latitude: 43.6777, longitude: -79.6248 },
    address: {
      cityName: "TORONTO",
      cityCode: "YTO",
      countryName: "CANADA",
      countryCode: "CA",
      stateCode: "ON",
      regionCode: "NAMER",
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "PEARSON INTL",
    iataCode: "YYZ",
    geoCode: { latitude: 43.6777, longitude: -79.6248 },
    address: {
      cityName: "TORONTO",
      cityCode: "YTO",
      countryName: "CANADA",
      countryCode: "CA",
      stateCode: "ON",
      regionCode: "NAMER",
    },
  },
  {
    type: "location",
    subType: "CITY",
    name: "MONTREAL",
    iataCode: "YUL",
    geoCode: { latitude: 45.4706, longitude: -73.7408 },
    address: {
      cityName: "MONTREAL",
      cityCode: "YMQ",
      countryName: "CANADA",
      countryCode: "CA",
      stateCode: "QC",
      regionCode: "NAMER",
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "TRUDEAU INTL",
    iataCode: "YUL",
    geoCode: { latitude: 45.4706, longitude: -73.7408 },
    address: {
      cityName: "MONTREAL",
      cityCode: "YMQ",
      countryName: "CANADA",
      countryCode: "CA",
      stateCode: "QC",
      regionCode: "NAMER",
    },
  },
  {
    type: "location",
    subType: "CITY",
    name: "VANCOUVER",
    iataCode: "YVR",
    geoCode: { latitude: 49.1939, longitude: -123.1844 },
    address: {
      cityName: "VANCOUVER",
      cityCode: "YVR",
      countryName: "CANADA",
      countryCode: "CA",
      stateCode: "BC",
      regionCode: "NAMER",
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "VANCOUVER INTL",
    iataCode: "YVR",
    geoCode: { latitude: 49.1939, longitude: -123.1844 },
    address: {
      cityName: "VANCOUVER",
      cityCode: "YVR",
      countryName: "CANADA",
      countryCode: "CA",
      stateCode: "BC",
      regionCode: "NAMER",
    },
  },
  {
    type: "location",
    subType: "CITY",
    name: "CALGARY",
    iataCode: "YYC",
    geoCode: { latitude: 51.1225, longitude: -114.0131 },
    address: {
      cityName: "CALGARY",
      cityCode: "YYC",
      countryName: "CANADA",
      countryCode: "CA",
      stateCode: "AB",
      regionCode: "NAMER",
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "CALGARY INTL",
    iataCode: "YYC",
    geoCode: { latitude: 51.1225, longitude: -114.0131 },
    address: {
      cityName: "CALGARY",
      cityCode: "YYC",
      countryName: "CANADA",
      countryCode: "CA",
      stateCode: "AB",
      regionCode: "NAMER",
    },
  },
  {
    type: "location",
    subType: "CITY",
    name: "OTTAWA",
    iataCode: "YOW",
    geoCode: { latitude: 45.3192, longitude: -75.6692 },
    address: {
      cityName: "OTTAWA",
      cityCode: "YOW",
      countryName: "CANADA",
      countryCode: "CA",
      stateCode: "ON",
      regionCode: "NAMER",
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "MACDONALD-CARTIER INTL",
    iataCode: "YOW",
    geoCode: { latitude: 45.3192, longitude: -75.6692 },
    address: {
      cityName: "OTTAWA",
      cityCode: "YOW",
      countryName: "CANADA",
      countryCode: "CA",
      stateCode: "ON",
      regionCode: "NAMER",
    },
  },
  {
    type: "location",
    subType: "CITY",
    name: "EDMONTON",
    iataCode: "YEG",
    geoCode: { latitude: 53.3097, longitude: -113.5796 },
    address: {
      cityName: "EDMONTON",
      cityCode: "YEA",
      countryName: "CANADA",
      countryCode: "CA",
      stateCode: "AB",
      regionCode: "NAMER",
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "EDMONTON INTL",
    iataCode: "YEG",
    geoCode: { latitude: 53.3097, longitude: -113.5796 },
    address: {
      cityName: "EDMONTON",
      cityCode: "YEA",
      countryName: "CANADA",
      countryCode: "CA",
      stateCode: "AB",
      regionCode: "NAMER",
    },
  },
  // Dubai airports
  {
    type: "location",
    subType: "CITY",
    name: "DUBAI",
    iataCode: "DXB",
    geoCode: { latitude: 25.2532, longitude: 55.3657 },
    address: {
      cityName: "DUBAI",
      cityCode: "DXB",
      countryName: "UNITED ARAB EMIRATES",
      countryCode: "AE",
      regionCode: "MENA",
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "DUBAI INTL",
    iataCode: "DXB",
    geoCode: { latitude: 25.2532, longitude: 55.3657 },
    address: {
      cityName: "DUBAI",
      cityCode: "DXB",
      countryName: "UNITED ARAB EMIRATES",
      countryCode: "AE",
      regionCode: "MENA",
    },
  },
  {
    type: "location",
    subType: "AIRPORT",
    name: "AL MAKTOUM INTL",
    iataCode: "DWC",
    geoCode: { latitude: 24.8967, longitude: 55.1614 },
    address: {
      cityName: "DUBAI",
      cityCode: "DXB",
      countryName: "UNITED ARAB EMIRATES",
      countryCode: "AE",
      regionCode: "MENA",
    },
  },
];

// Search for airports by keyword
export async function searchAirports(keyword: string) {
  const lowerKeyword = keyword.toLowerCase();
  
  // Search test airports manually (not in test environment)
  const testAirportMatches = TEST_AIRPORTS.filter(
    (airport) =>
      airport.name.toLowerCase().includes(lowerKeyword) ||
      airport.iataCode.toLowerCase().includes(lowerKeyword) ||
      airport.address.cityName.toLowerCase().includes(lowerKeyword)
  );

  try {
    const token = await getAccessToken();

    const response = await axios.get(
      `${AMADEUS_BASE_URL}/v1/reference-data/locations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          keyword,
          subType: "AIRPORT,CITY",
          "page[limit]": 20,
        },
      }
    );

    const amadeusResults = response.data.data || [];
    
    // Combine test airports with Amadeus results
    const combinedResults = [...testAirportMatches, ...amadeusResults];

    console.log(
      `[Amadeus] Found ${amadeusResults.length} from API + ${testAirportMatches.length} test airports for "${keyword}"`
    );

    return {
      ...response.data,
      data: combinedResults,
      meta: {
        ...response.data.meta,
        count: combinedResults.length,
      },
    };
  } catch (error: any) {
    console.error("[Amadeus] Airport search error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    // If API fails, return just test airport results
    if (testAirportMatches.length > 0) {
      console.log(`[Amadeus] API failed, returning ${testAirportMatches.length} test airports`);
      return {
        data: testAirportMatches,
        meta: { count: testAirportMatches.length },
      };
    }
    
    throw new Error("Failed to search airports");
  }
}

// Get flight inspiration (cheapest destinations from origin)
export async function getFlightInspiration(params: {
  origin: string;
  maxPrice?: number;
  departureDate?: string;
}) {
  try {
    const token = await getAccessToken();

    const queryParams: any = {
      origin: params.origin,
    };

    if (params.maxPrice) queryParams.maxPrice = params.maxPrice;
    if (params.departureDate) queryParams.departureDate = params.departureDate;

    const response = await axios.get(
      `${AMADEUS_BASE_URL}/v1/shopping/flight-destinations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Flight inspiration error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to get flight inspiration");
  }
}

// Get Points of Interest for a destination
export async function getPointsOfInterest(params: {
  latitude: number;
  longitude: number;
  radius?: number;
}) {
  console.log("[Amadeus] Getting Points of Interest:", params);
  
  try {
    const token = await getAccessToken();

    const queryParams: any = {
      latitude: params.latitude,
      longitude: params.longitude,
      radius: params.radius || 5, // Default 5km radius
    };

    const response = await axios.get(
      `${AMADEUS_BASE_URL}/v1/reference-data/locations/pois`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
      }
    );

    console.log(`[Amadeus] Found ${response.data.data?.length || 0} POIs`);
    return response.data;
  } catch (error: any) {
    console.error("[Amadeus] POI search error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(
      error.response?.data?.errors?.[0]?.detail || "Failed to get points of interest"
    );
  }
}

// Get Tours and Activities for a destination
export async function getToursAndActivities(params: {
  latitude: number;
  longitude: number;
  radius?: number;
}) {
  console.log("[Amadeus] Getting Tours and Activities:", params);
  
  try {
    const token = await getAccessToken();

    const queryParams: any = {
      latitude: params.latitude,
      longitude: params.longitude,
      radius: params.radius || 5, // Default 5km radius
    };

    const response = await axios.get(
      `${AMADEUS_BASE_URL}/v1/shopping/activities`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: queryParams,
      }
    );

    console.log(`[Amadeus] Found ${response.data.data?.length || 0} activities`);
    return response.data;
  } catch (error: any) {
    console.error("[Amadeus] Activities search error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(
      error.response?.data?.errors?.[0]?.detail || "Failed to get tours and activities"
    );
  }
}

// Search for cities/destinations by keyword
export async function searchCities(keyword: string) {
  console.log("[Amadeus] Searching cities:", keyword);
  
  try {
    const token = await getAccessToken();

    const response = await axios.get(
      `${AMADEUS_BASE_URL}/v1/reference-data/locations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          keyword,
          subType: "CITY",
          page: { limit: 20 },
        },
      }
    );

    console.log(`[Amadeus] Found ${response.data.data?.length || 0} cities`);
    return response.data;
  } catch (error: any) {
    console.error("[Amadeus] City search error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(
      error.response?.data?.errors?.[0]?.detail || "Failed to search cities"
    );
  }
}
