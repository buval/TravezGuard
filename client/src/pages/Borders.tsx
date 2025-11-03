import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "@/components/MobileNav";
import { Shield, MapPin, Clock, ExternalLink, Loader2, AlertCircle, Home } from "lucide-react";
import type { Destination } from "@shared/schema";
import logoUrl from "@assets/logo_1761679001485.png";

// ISO country codes for common passports
const PASSPORT_COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
];

// Map destination countries to ISO-2 codes (complete mapping for all destinations)
const DESTINATION_COUNTRY_CODES: Record<string, string> = {
  "Argentina": "AR",
  "Australia": "AU",
  "Canada": "CA",
  "France": "FR",
  "French Polynesia": "PF",
  "Greece": "GR",
  "Iceland": "IS",
  "Indonesia": "ID",
  "Italy": "IT",
  "Japan": "JP",
  "Jordan": "JO",
  "Maldives": "MV",
  "Morocco": "MA",
  "New Zealand": "NZ",
  "Norway": "NO",
  "Peru": "PE",
  "Spain": "ES",
  "Switzerland": "CH",
  "Tanzania": "TZ",
  "Turkey": "TR",
  "United Arab Emirates": "AE",
  "United States": "US",
};

interface VisaRequirement {
  id?: number;
  passport?: { name: string; code: string };
  destination?: { name: string; code: string };
  dur?: number | null;
  category?: { name: string; code: string };
  last_updated: string;
}

export default function Borders() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedPassport, setSelectedPassport] = useState<string>("US");
  const [visaRequirements, setVisaRequirements] = useState<Map<string, VisaRequirement>>(new Map());
  const [loadingDestinations, setLoadingDestinations] = useState<Set<string>>(new Set());
  const [failedDestinations, setFailedDestinations] = useState<Set<string>>(new Set());

  // Cache for visa requirements to avoid repeated API calls
  const visaCache = useMemo(() => new Map<string, VisaRequirement>(), []);

  const { data: destinations, isLoading: destinationsLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  // Fetch visa requirements for all destinations when passport changes
  useEffect(() => {
    if (!destinations || !selectedPassport) return;

    const fetchVisaRequirements = async () => {
      const newLoadingSet = new Set<string>();
      const newRequirements = new Map<string, VisaRequirement>();
      const newFailedSet = new Set<string>();
      let apiErrorCount = 0;

      for (const dest of destinations) {
        const destCode = DESTINATION_COUNTRY_CODES[dest.country];
        if (!destCode) {
          console.warn(`No ISO code mapping for country: ${dest.country}`);
          continue;
        }

        // Check cache first
        const cacheKey = `${selectedPassport}-${destCode}`;
        if (visaCache.has(cacheKey)) {
          newRequirements.set(dest.id, visaCache.get(cacheKey)!);
          continue;
        }

        newLoadingSet.add(dest.id);
        setLoadingDestinations(new Set(newLoadingSet));

        try {
          // Use backend proxy to avoid CORS issues on mobile devices
          const response = await fetch(`/api/visa/${selectedPassport}/${destCode}`);
          if (response.ok) {
            const data = await response.json();
            newRequirements.set(dest.id, data);
            visaCache.set(cacheKey, data); // Cache the result
          } else {
            newFailedSet.add(dest.id);
            apiErrorCount++;
            console.error(`API returned non-OK status for ${dest.name}: ${response.status}`);
          }
        } catch (error) {
          newFailedSet.add(dest.id);
          apiErrorCount++;
          console.error(`Failed to fetch visa requirement for ${dest.name}:`, error);
        } finally {
          newLoadingSet.delete(dest.id);
          setLoadingDestinations(new Set(newLoadingSet));
        }
      }

      setVisaRequirements(newRequirements);
      setFailedDestinations(newFailedSet);
    };

    fetchVisaRequirements();
  }, [destinations, selectedPassport, toast, visaCache]);

  const getVisaBadgeColor = (categoryCode: string) => {
    switch (categoryCode) {
      case "VF": // Visa Free
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800";
      case "VOA": // Visa on Arrival
      case "eVisa": // Electronic Visa
      case "eTA": // Electronic Travel Authorization
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800";
      case "VR": // Visa Required
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800";
      case "NA": // Not Admitted
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800";
    }
  };

  const selectedPassportInfo = PASSPORT_COUNTRIES.find((c) => c.code === selectedPassport);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center max-w-7xl">
          <div className="flex-1"></div>
          <img src={logoUrl} alt="Travez" className="h-8" data-testid="img-logo" />
          <div className="flex-1 flex justify-end">
            {!isAuthenticated && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.location.href = "/auth"}
                className="rounded-full"
                data-testid="button-signin"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Passport Selector */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Select Your Passport</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Choose your passport country to see visa requirements for destinations
              </p>
            </div>

            <Select value={selectedPassport} onValueChange={setSelectedPassport}>
              <SelectTrigger className="w-full" data-testid="select-passport">
                <SelectValue>
                  {selectedPassportInfo && (
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">{selectedPassportInfo.flag}</span>
                      {selectedPassportInfo.name}
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PASSPORT_COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span className="text-xl">{country.flag}</span>
                      {country.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Visa requirements are sourced from official government data via Passport Index. Always verify with the embassy before travel.
          </p>
        </div>

        {/* Visa Requirements List */}
        {destinationsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : destinations && destinations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => {
              const destCode = DESTINATION_COUNTRY_CODES[destination.country];
              const visaReq = visaRequirements.get(destination.id);
              const isLoading = loadingDestinations.has(destination.id);

              return (
                <Card key={destination.id} className="overflow-hidden hover-elevate" data-testid={`destination-card-${destination.id}`}>
                  <div className="relative h-32">
                    <img
                      src={destination.imageUrl}
                      alt={destination.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-semibold text-lg" data-testid={`text-destination-${destination.id}`}>
                        {destination.name}
                      </h3>
                      <p className="text-white/80 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {destination.country}
                      </p>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {isLoading ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Checking requirements...</span>
                      </div>
                    ) : failedDestinations.has(destination.id) ? (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium">Preparing results…</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Thanks for your patience
                          </p>
                        </div>
                      </div>
                    ) : visaReq && visaReq.category ? (
                      <div className="space-y-3">
                        <div>
                          <Badge
                            className={`${getVisaBadgeColor(visaReq.category.code)} border`}
                            data-testid={`badge-visa-${destination.id}`}
                          >
                            {visaReq.category.name}
                          </Badge>
                        </div>

                        {visaReq.dur && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>
                              Stay up to <strong>{visaReq.dur} days</strong>
                            </span>
                          </div>
                        )}

                        <div className="pt-2 border-t">
                          <a
                            href={`https://www.passportindex.org/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            View official source
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ) : visaReq && !visaReq.category ? (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Home className="w-4 h-4 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium">Home Country</p>
                          <p className="text-xs mt-1">
                            No visa required for your own country
                          </p>
                        </div>
                      </div>
                    ) : !destCode ? (
                      <div className="flex items-start gap-2 text-yellow-600 dark:text-yellow-400">
                        <AlertCircle className="w-4 h-4 mt-0.5" />
                        <p className="text-sm">Country mapping unavailable</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Preparing results…</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No destinations available</p>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
