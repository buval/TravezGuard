// Airline code to name mapping
export const AIRLINES: Record<string, { name: string; logo?: string }> = {
  AA: { name: "American Airlines" },
  DL: { name: "Delta Air Lines" },
  UA: { name: "United Airlines" },
  B6: { name: "JetBlue Airways" },
  WN: { name: "Southwest Airlines" },
  AS: { name: "Alaska Airlines" },
  NK: { name: "Spirit Airlines" },
  F9: { name: "Frontier Airlines" },
  G4: { name: "Allegiant Air" },
  SY: { name: "Sun Country Airlines" },
  BA: { name: "British Airways" },
  LH: { name: "Lufthansa" },
  AF: { name: "Air France" },
  KL: { name: "KLM Royal Dutch Airlines" },
  IB: { name: "Iberia" },
  AZ: { name: "ITA Airways" },
  LX: { name: "Swiss International Air Lines" },
  OS: { name: "Austrian Airlines" },
  SK: { name: "Scandinavian Airlines" },
  TP: { name: "TAP Air Portugal" },
  AC: { name: "Air Canada" },
  WS: { name: "WestJet" },
  PD: { name: "Porter Airlines" },
  TS: { name: "Air Transat" },
  EK: { name: "Emirates" },
  QR: { name: "Qatar Airways" },
  EY: { name: "Etihad Airways" },
  SV: { name: "Saudia" },
  TK: { name: "Turkish Airlines" },
  MS: { name: "EgyptAir" },
  CX: { name: "Cathay Pacific" },
  SQ: { name: "Singapore Airlines" },
  TG: { name: "Thai Airways" },
  NH: { name: "All Nippon Airways" },
  JL: { name: "Japan Airlines" },
  KE: { name: "Korean Air" },
  OZ: { name: "Asiana Airlines" },
  CI: { name: "China Airlines" },
  BR: { name: "EVA Air" },
  CZ: { name: "China Southern Airlines" },
  MU: { name: "China Eastern Airlines" },
  CA: { name: "Air China" },
  QF: { name: "Qantas" },
  VA: { name: "Virgin Australia" },
  NZ: { name: "Air New Zealand" },
  LA: { name: "LATAM Airlines" },
  AM: { name: "Aeroméxico" },
  AR: { name: "Aerolíneas Argentinas" },
  CM: { name: "Copa Airlines" },
  AV: { name: "Avianca" },
  SA: { name: "South African Airways" },
  ET: { name: "Ethiopian Airlines" },
  KQ: { name: "Kenya Airways" },
  AI: { name: "Air India" },
  SG: { name: "SpiceJet" },
  UK: { name: "Vistara" },
  "6E": { name: "IndiGo" },
};

export function getAirlineName(code: string): string {
  return AIRLINES[code]?.name || code;
}

// Aircraft type information
export const AIRCRAFT_TYPES: Record<string, { name: string; category: string }> = {
  // Boeing
  "737": { name: "Boeing 737", category: "Narrow-body" },
  "738": { name: "Boeing 737-800", category: "Narrow-body" },
  "73H": { name: "Boeing 737-800", category: "Narrow-body" },
  "73J": { name: "Boeing 737-900", category: "Narrow-body" },
  "73W": { name: "Boeing 737-700", category: "Narrow-body" },
  "73G": { name: "Boeing 737-700", category: "Narrow-body" },
  "7M8": { name: "Boeing 737 MAX 8", category: "Narrow-body" },
  "7M9": { name: "Boeing 737 MAX 9", category: "Narrow-body" },
  "757": { name: "Boeing 757", category: "Narrow-body" },
  "75W": { name: "Boeing 757-200", category: "Narrow-body" },
  "767": { name: "Boeing 767", category: "Wide-body" },
  "76W": { name: "Boeing 767-300", category: "Wide-body" },
  "777": { name: "Boeing 777", category: "Wide-body" },
  "77W": { name: "Boeing 777-300ER", category: "Wide-body" },
  "77L": { name: "Boeing 777-200LR", category: "Wide-body" },
  "787": { name: "Boeing 787 Dreamliner", category: "Wide-body" },
  "788": { name: "Boeing 787-8", category: "Wide-body" },
  "789": { name: "Boeing 787-9", category: "Wide-body" },
  "78J": { name: "Boeing 787-10", category: "Wide-body" },

  // Airbus
  "319": { name: "Airbus A319", category: "Narrow-body" },
  "320": { name: "Airbus A320", category: "Narrow-body" },
  "32A": { name: "Airbus A320", category: "Narrow-body" },
  "32B": { name: "Airbus A320neo", category: "Narrow-body" },
  "32N": { name: "Airbus A320neo", category: "Narrow-body" },
  "32Q": { name: "Airbus A321neo", category: "Narrow-body" },
  "321": { name: "Airbus A321", category: "Narrow-body" },
  "330": { name: "Airbus A330", category: "Wide-body" },
  "332": { name: "Airbus A330-200", category: "Wide-body" },
  "333": { name: "Airbus A330-300", category: "Wide-body" },
  "339": { name: "Airbus A330-900neo", category: "Wide-body" },
  "350": { name: "Airbus A350", category: "Wide-body" },
  "359": { name: "Airbus A350-900", category: "Wide-body" },
  "35K": { name: "Airbus A350-1000", category: "Wide-body" },
  "380": { name: "Airbus A380", category: "Wide-body" },
  "388": { name: "Airbus A380-800", category: "Wide-body" },

  // Regional Jets
  "E70": { name: "Embraer E170", category: "Regional" },
  "E75": { name: "Embraer E175", category: "Regional" },
  "E90": { name: "Embraer E190", category: "Regional" },
  "E95": { name: "Embraer E195", category: "Regional" },
  "CR7": { name: "Bombardier CRJ-700", category: "Regional" },
  "CR9": { name: "Bombardier CRJ-900", category: "Regional" },
  "CRJ": { name: "Bombardier CRJ", category: "Regional" },
};

export function getAircraftInfo(code: string): { name: string; category: string } {
  return AIRCRAFT_TYPES[code] || { name: code || "Aircraft", category: "Unknown" };
}

// Baggage information by airline (examples - can vary by route/fare)
export interface BaggageInfo {
  carryOn: {
    included: boolean;
    weight: string;
    dimensions: string;
  };
  checked: {
    included: number; // Number of free checked bags
    weight: string;
    fee?: string;
  };
  personal: {
    included: boolean;
    dimensions: string;
  };
}

export function getBaggageInfo(airlineCode: string, fareClass: string = "ECONOMY"): BaggageInfo {
  // Default baggage policy (varies by airline)
  const defaults: Record<string, BaggageInfo> = {
    AA: {
      carryOn: { included: true, weight: "10 kg", dimensions: "56 x 36 x 23 cm" },
      checked: { included: 0, weight: "23 kg", fee: "$35 for first bag" },
      personal: { included: true, dimensions: "45 x 35 x 20 cm" },
    },
    DL: {
      carryOn: { included: true, weight: "10 kg", dimensions: "56 x 35 x 23 cm" },
      checked: { included: 0, weight: "23 kg", fee: "$35 for first bag" },
      personal: { included: true, dimensions: "45 x 35 x 20 cm" },
    },
    UA: {
      carryOn: { included: true, weight: "10 kg", dimensions: "56 x 35 x 22 cm" },
      checked: { included: 0, weight: "23 kg", fee: "$35 for first bag" },
      personal: { included: true, dimensions: "43 x 25 x 22 cm" },
    },
    WN: {
      carryOn: { included: true, weight: "10 kg", dimensions: "61 x 41 x 28 cm" },
      checked: { included: 2, weight: "23 kg", fee: "Free (2 bags)" },
      personal: { included: true, dimensions: "46 x 30 x 20 cm" },
    },
    AC: {
      carryOn: { included: true, weight: "10 kg", dimensions: "55 x 40 x 23 cm" },
      checked: { included: 1, weight: "23 kg", fee: "1 bag included" },
      personal: { included: true, dimensions: "43 x 33 x 16 cm" },
    },
    EK: {
      carryOn: { included: true, weight: "7 kg", dimensions: "55 x 38 x 20 cm" },
      checked: { included: 2, weight: "30 kg", fee: "2 bags included" },
      personal: { included: true, dimensions: "40 x 30 x 15 cm" },
    },
  };

  return defaults[airlineCode] || {
    carryOn: { included: true, weight: "10 kg", dimensions: "55 x 40 x 23 cm" },
    checked: { included: 1, weight: "23 kg", fee: "1 bag included" },
    personal: { included: true, dimensions: "45 x 35 x 20 cm" },
  };
}

// Airport information database (subset - can be expanded)
export interface AirportInfo {
  code: string;
  name: string;
  city: string;
  country: string;
  website?: string;
  terminals?: number;
  facilities?: string[];
}

export const AIRPORT_INFO: Record<string, AirportInfo> = {
  JFK: {
    code: "JFK",
    name: "John F. Kennedy International Airport",
    city: "New York",
    country: "USA",
    website: "https://www.jfkairport.com",
    terminals: 8,
    facilities: ["Free WiFi", "Lounges", "Restaurants", "Shops", "Currency Exchange", "ATMs"],
  },
  LAX: {
    code: "LAX",
    name: "Los Angeles International Airport",
    city: "Los Angeles",
    country: "USA",
    website: "https://www.flylax.com",
    terminals: 9,
    facilities: ["Free WiFi", "Lounges", "Restaurants", "Shops", "Medical Services"],
  },
  LHR: {
    code: "LHR",
    name: "London Heathrow Airport",
    city: "London",
    country: "UK",
    website: "https://www.heathrow.com",
    terminals: 4,
    facilities: ["Free WiFi", "Premium Lounges", "Duty-Free Shopping", "Hotels", "Prayer Rooms"],
  },
  CDG: {
    code: "CDG",
    name: "Paris Charles de Gaulle Airport",
    city: "Paris",
    country: "France",
    website: "https://www.parisaeroport.fr",
    terminals: 3,
    facilities: ["Free WiFi", "Lounges", "Shopping", "Restaurants", "Museums"],
  },
  DXB: {
    code: "DXB",
    name: "Dubai International Airport",
    city: "Dubai",
    country: "UAE",
    website: "https://www.dubaiairports.ae",
    terminals: 3,
    facilities: ["Free WiFi", "Premium Lounges", "Duty-Free Shopping", "Hotels", "Spa Services"],
  },
  YYZ: {
    code: "YYZ",
    name: "Toronto Pearson International Airport",
    city: "Toronto",
    country: "Canada",
    website: "https://www.torontopearson.com",
    terminals: 2,
    facilities: ["Free WiFi", "Lounges", "Restaurants", "Shops", "Currency Exchange"],
  },
  YVR: {
    code: "YVR",
    name: "Vancouver International Airport",
    city: "Vancouver",
    country: "Canada",
    website: "https://www.yvr.ca",
    terminals: 3,
    facilities: ["Free WiFi", "Lounges", "Restaurants", "Shops", "Art Galleries"],
  },
  ORD: {
    code: "ORD",
    name: "O'Hare International Airport",
    city: "Chicago",
    country: "USA",
    website: "https://www.flychicago.com/ohare",
    terminals: 4,
    facilities: ["Free WiFi", "Lounges", "Restaurants", "Shops", "Kids Play Areas"],
  },
  SFO: {
    code: "SFO",
    name: "San Francisco International Airport",
    city: "San Francisco",
    country: "USA",
    website: "https://www.flysfo.com",
    terminals: 4,
    facilities: ["Free WiFi", "Lounges", "Restaurants", "Shops", "Museum", "Yoga Room"],
  },
  ATL: {
    code: "ATL",
    name: "Hartsfield-Jackson Atlanta International Airport",
    city: "Atlanta",
    country: "USA",
    website: "https://www.atl.com",
    terminals: 2,
    facilities: ["Free WiFi", "Lounges", "Restaurants", "Shops", "Art Program"],
  },
};

export function getAirportInfo(code: string): AirportInfo | null {
  return AIRPORT_INFO[code] || null;
}
