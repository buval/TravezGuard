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

// Helper function to diversify flight results
function diversifyFlightResults(flights: any[], maxResults: number = 15): any[] {
  if (!flights || flights.length === 0) return flights;

  // Group flights by number of stops
  const directFlights = flights.filter(f => {
    const segments = f.itineraries?.[0]?.segments || [];
    return segments.length === 1;
  });
  
  const oneStopFlights = flights.filter(f => {
    const segments = f.itineraries?.[0]?.segments || [];
    return segments.length === 2;
  });
  
  const twoStopFlights = flights.filter(f => {
    const segments = f.itineraries?.[0]?.segments || [];
    return segments.length >= 3;
  });

  console.log(`[Amadeus] Flight distribution - Direct: ${directFlights.length}, 1-Stop: ${oneStopFlights.length}, 2+ Stops: ${twoStopFlights.length}`);

  // Group by departure time (morning, afternoon, evening, night) with fallback bucket
  const groupByDepartureTime = (flightList: any[]) => {
    const groups: any = { morning: [], afternoon: [], evening: [], night: [], fallback: [] };
    
    flightList.forEach(flight => {
      const departureTime = flight.itineraries?.[0]?.segments?.[0]?.departure?.at;
      if (!departureTime) {
        groups.fallback.push(flight);
        return;
      }
      
      const hour = parseInt(departureTime.split('T')[1].substring(0, 2));
      let timeSlot: string;
      
      if (hour >= 6 && hour < 12) timeSlot = 'morning';
      else if (hour >= 12 && hour < 18) timeSlot = 'afternoon';
      else if (hour >= 18 && hour < 22) timeSlot = 'evening';
      else timeSlot = 'night';
      
      groups[timeSlot].push(flight);
    });
    
    return groups;
  };

  // Diversify each category by time
  const diversify = (flightList: any[], count: number) => {
    if (flightList.length === 0) return [];
    
    const byTime = groupByDepartureTime(flightList);
    const timeSlots = ['morning', 'afternoon', 'evening', 'night'];
    const result: any[] = [];
    
    // Round-robin selection from each time slot
    let slotIndex = 0;
    while (result.length < count && result.length < flightList.length) {
      const slot = timeSlots[slotIndex % timeSlots.length];
      if (byTime[slot] && byTime[slot].length > 0) {
        result.push(byTime[slot].shift());
      }
      slotIndex++;
      
      // Check if time slots are empty
      if (timeSlots.every(s => !byTime[s] || byTime[s].length === 0)) {
        // Add any remaining fallback flights
        while (result.length < count && byTime.fallback.length > 0) {
          result.push(byTime.fallback.shift());
        }
        break;
      }
    }
    
    return result;
  };

  // Initial allocation (aim for 40% direct, 40% one-stop, 20% two+ stops)
  const targetDirect = Math.ceil(maxResults * 0.4);
  const targetOneStop = Math.ceil(maxResults * 0.4);
  const targetTwoStop = Math.floor(maxResults * 0.2);

  // Allocate what's available
  const directCount = Math.min(targetDirect, directFlights.length);
  const oneStopCount = Math.min(targetOneStop, oneStopFlights.length);
  const twoStopCount = Math.min(targetTwoStop, twoStopFlights.length);

  // Select diverse flights from each category
  const selectedDirect = diversify(directFlights, directCount);
  const selectedOneStop = diversify(oneStopFlights, oneStopCount);
  const selectedTwoStop = diversify(twoStopFlights, twoStopCount);

  // Calculate remaining slots and backfill from available categories
  let currentTotal = selectedDirect.length + selectedOneStop.length + selectedTwoStop.length;
  const remainingSlots = maxResults - currentTotal;

  if (remainingSlots > 0) {
    // Create list of remaining flights from each category
    const remainingDirect = directFlights.filter(f => !selectedDirect.includes(f));
    const remainingOneStop = oneStopFlights.filter(f => !selectedOneStop.includes(f));
    const remainingTwoStop = twoStopFlights.filter(f => !selectedTwoStop.includes(f));
    
    // Sort categories by available count (richest first)
    const categories = [
      { flights: remainingDirect, selected: selectedDirect },
      { flights: remainingOneStop, selected: selectedOneStop },
      { flights: remainingTwoStop, selected: selectedTwoStop }
    ].sort((a, b) => b.flights.length - a.flights.length);

    // Backfill from richest categories
    let slotsToFill = remainingSlots;
    for (const category of categories) {
      if (slotsToFill === 0) break;
      const available = category.flights.length;
      const toTake = Math.min(slotsToFill, available);
      
      if (toTake > 0) {
        const additional = diversify(category.flights, toTake);
        category.selected.push(...additional);
        slotsToFill -= additional.length;
      }
    }
  }

  // Combine and sort by price
  const diverseResults = [...selectedDirect, ...selectedOneStop, ...selectedTwoStop]
    .sort((a, b) => {
      const priceA = parseFloat(a.price?.total || '0');
      const priceB = parseFloat(b.price?.total || '0');
      return priceA - priceB;
    });

  console.log(`[Amadeus] Diversified to ${diverseResults.length} flights (Direct: ${selectedDirect.length}, 1-Stop: ${selectedOneStop.length}, 2+ Stops: ${selectedTwoStop.length})`);
  
  return diverseResults.slice(0, maxResults);
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
      max: 100,
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

    console.log(`[Amadeus] Found ${response.data.data?.length || 0} flights from API`);
    
    // Diversify the results to ensure mix of direct, 1-stop, and 2-stop flights
    // with varied departure times
    if (response.data.data && response.data.data.length > 0) {
      const maxResults = params.max || 15;
      response.data.data = diversifyFlightResults(response.data.data, maxResults);
    }
    
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
