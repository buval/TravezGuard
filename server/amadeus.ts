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
    return cachedToken;
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

// Search for airports by keyword
export async function searchAirports(keyword: string) {
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
          page: { limit: 10 },
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Airport search error:", error.response?.data || error.message);
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
