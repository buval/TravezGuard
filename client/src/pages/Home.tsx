import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "@/components/MobileNav";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Shield, Search, X, Sun, Calendar, Activity, ExternalLink, Star, Globe } from "lucide-react";
import type { Destination } from "@shared/schema";
import logoUrl from "@assets/logo_1761679001485.png";

// Extended type for search results
type DestinationSearchResult = (Destination & { source: "database" }) | {
  id: string;
  name: string;
  country: string;
  iataCode?: string;
  geoCode?: { latitude: number; longitude: number };
  imageUrl?: string | null;
  source: "amadeus";
  type?: string;
};

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "city", label: "City" },
  { value: "cultural", label: "Cultural" },
  { value: "adventure", label: "Adventure" },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [selectedDestination, setSelectedDestination] = useState<Destination | DestinationSearchResult | null>(null);
  const [selectedAmadeusCity, setSelectedAmadeusCity] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load all destinations from database
  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  // Search destinations (DB + Amadeus) when user types
  const searchUrl = debouncedSearchQuery.trim().length >= 2 
    ? `/api/destinations/search?query=${encodeURIComponent(debouncedSearchQuery)}`
    : null;
    
  const { data: searchResults, isLoading: searchLoading } = useQuery<{
    results: DestinationSearchResult[];
    localCount: number;
    amadeusCount: number;
  }>({
    queryKey: [searchUrl],
    enabled: !!searchUrl,
  });

  // Only fetch activities if it's a database destination
  const isDatabaseDestination = selectedDestination && 'source' in selectedDestination && selectedDestination.source === "database";
  
  const { data: activities, isLoading: activitiesLoading } = useQuery<any>({
    queryKey: [`/api/destinations/${selectedDestination?.id}/activities`],
    enabled: !!isDatabaseDestination,
  });

  // Fetch Activities for selected Amadeus city (if it has coordinates)
  const amadeusCity = selectedAmadeusCity as any;
  const amadeusActivitiesUrl = amadeusCity?.geoCode 
    ? `/api/destinations/amadeus/activities?latitude=${amadeusCity.geoCode.latitude}&longitude=${amadeusCity.geoCode.longitude}`
    : null;
  
  const { data: amadeusActivities, isLoading: amadeusActivitiesLoading } = useQuery<any>({
    queryKey: [amadeusActivitiesUrl],
    enabled: !!selectedAmadeusCity && !!amadeusCity?.geoCode && !!amadeusActivitiesUrl,
  });

  // Filter and search destinations
  const filteredDestinations = useMemo(() => {
    // If user is searching and we have search results, use those
    if (debouncedSearchQuery.trim().length >= 2 && searchResults) {
      const results = searchResults.results;
      
      // Apply category filter only to database results
      if (selectedCategory !== "all") {
        return results.filter((dest) => 
          dest.source === "amadeus" || 
          (dest.source === "database" && (dest as Destination).category === selectedCategory)
        );
      }
      
      return results;
    }

    // Otherwise, filter from all destinations
    if (!destinations) return [];

    let filtered = destinations;

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((dest) => dest.category === selectedCategory);
    }

    // Map to include source
    return filtered.map(dest => ({ ...dest, source: "database" as const }));
  }, [destinations, selectedCategory, debouncedSearchQuery, searchResults]);

  const hasActiveFilters = selectedCategory !== "all" || searchQuery.trim() !== "";

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

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
                variant="default"
                onClick={() => window.location.href = "/auth"}
                className="rounded-full"
                data-testid="button-login"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2" data-testid="text-explore-title">
            Discover Your Next Adventure
          </h2>
          <p className="text-muted-foreground">
            Browse our curated collection of amazing destinations around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search destinations or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
              data-testid="input-search-destinations"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                data-testid="button-clear-search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="rounded-full whitespace-nowrap"
                data-testid={`button-category-${category.value}`}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {hasActiveFilters && (
            <div className="flex items-center justify-between py-2">
              <p className="text-sm text-muted-foreground">
                {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'} found
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8"
                data-testid="button-clear-filters"
              >
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </Button>
            </div>
          )}
        </div>

        {/* Destinations Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-80 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-2">No destinations found</p>
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters ? "Try adjusting your filters" : "Check back soon for more destinations"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination) => {
              const isAmadeus = destination.source === "amadeus";
              const dbDest = destination.source === "database" ? destination : null;
              
              return (
                <Card
                  key={destination.id}
                  className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 group flex flex-col"
                  onClick={() => {
                    if (isAmadeus) {
                      setSelectedAmadeusCity(destination);
                    } else {
                      setSelectedDestination(destination);
                    }
                  }}
                  data-testid={`card-destination-${destination.id}`}
                >
                  <div className="aspect-[16/10] overflow-hidden relative flex-shrink-0">
                    {destination.imageUrl ? (
                      <img
                        src={destination.imageUrl}
                        alt={destination.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <div className="text-center p-6">
                          <Globe className="w-16 h-16 mx-auto mb-3 text-primary/40" />
                          <Badge variant="secondary" className="text-xs">
                            <Globe className="w-3 h-3 mr-1" />
                            {isAmadeus ? "Discover Worldwide" : "No Image"}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1 flex-1" data-testid={`text-destination-name-${destination.id}`}>
                        {destination.name}
                      </h3>
                      {isAmadeus && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          <Globe className="w-3 h-3 mr-1" />
                          Explore
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{destination.country}</span>
                    </div>
                    {isAmadeus ? (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Click to explore this destination and discover tours, activities, and travel information.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {dbDest?.description}
                      </p>
                    )}
                    {!isAmadeus && (
                      <div className="mt-4 flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full capitalize">
                          {dbDest?.category}
                        </span>
                        {dbDest?.visaRequirements && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Shield className="w-3 h-3" />
                            <span>Visa info</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!isAuthenticated && filteredDestinations.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-3">Ready to Plan Your Trip?</h3>
              <p className="text-muted-foreground mb-6">
                Sign in to create personalized itineraries and save your favorite destinations
              </p>
              <Button
                size="lg"
                onClick={() => window.location.href = "/auth"}
                className="rounded-full"
                data-testid="button-cta-signin"
              >
                Sign In to Get Started
              </Button>
            </Card>
          </div>
        )}
      </main>

      {/* Destination Details Dialog - Only for database destinations */}
      <Dialog open={!!selectedDestination && !!isDatabaseDestination} onOpenChange={(open) => !open && setSelectedDestination(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDestination && isDatabaseDestination && (
            <>
              {(() => {
                const dest = selectedDestination as Destination;
                return (
                  <>
                    <div className="h-48 overflow-hidden rounded-lg mb-4 relative">
                      <img
                        src={dest.imageUrl}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <DialogHeader className="space-y-3">
                      <DialogTitle className="text-2xl">{dest.name}, {dest.country}</DialogTitle>
                      <DialogDescription className="text-base leading-relaxed">
                        {dest.description}
                      </DialogDescription>
                    </DialogHeader>

                    {/* Weather & Climate Information */}
                    {(dest.climate || dest.bestMonths) && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Climate & Best Time to Visit
                      </h3>
                      
                      {dest.climate && (
                        <div className="mb-4">
                          <p className="font-medium text-sm mb-2 flex items-center gap-2">
                            <Sun className="w-4 h-4" />
                            Climate
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {dest.climate}
                          </p>
                        </div>
                      )}

                      {dest.bestMonths && (
                        <div>
                          <p className="font-medium text-sm mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Best Time to Visit
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {dest.bestMonths}
                          </p>
                        </div>
                      )}
                    </div>
                    )}

                    {/* Visa & Travel Requirements */}
                    {(dest.visaRequirements || dest.travelDocuments) && (
                      <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-primary" />
                          Visa & Travel Requirements
                        </h3>
                        
                        {dest.visaRequirements && (
                          <div className="mb-4">
                            <p className="font-medium text-sm mb-2">Visa Requirements</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {dest.visaRequirements}
                            </p>
                          </div>
                        )}

                        {dest.travelDocuments && (
                          <div className="mb-4">
                            <p className="font-medium text-sm mb-2">Required Documents</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {dest.travelDocuments}
                            </p>
                          </div>
                        )}

                        <div className="p-3 bg-background rounded-lg border border-border">
                          <p className="text-xs text-muted-foreground">
                            <strong>Important:</strong> Visa and entry requirements can change. Always verify current requirements with the embassy or official government sources before your trip.
                          </p>
                        </div>
                      </div>
                    )}

              {/* Tours & Activities */}
              {activities?.data && activities.data.length > 0 && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900/50">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    Popular Tours & Activities
                  </h3>
                  <div className="space-y-3">
                    {activities.data.slice(0, 5).map((activity: any) => (
                      <div key={activity.id} className="p-3 bg-background rounded-lg border border-border">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2">{activity.name}</p>
                            {activity.shortDescription && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {activity.shortDescription}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              {activity.rating && (
                                <div className="flex items-center gap-1 text-xs">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{activity.rating}</span>
                                </div>
                              )}
                              {activity.price?.amount && (
                                <span className="text-xs font-medium text-primary">
                                  {activity.price.currencyCode} {activity.price.amount}
                                </span>
                              )}
                            </div>
                          </div>
                          {activity.bookingLink && (
                            <a
                              href={activity.bookingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0"
                            >
                              <Button size="sm" variant="outline" className="h-8">
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Powered by Amadeus - Book directly with providers
                  </p>
                </div>
              )}
              {activitiesLoading && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900/50">
                  <p className="text-sm text-muted-foreground">Loading activities...</p>
                </div>
              )}

                    {isAuthenticated && (
                      <Button 
                        size="lg" 
                        className="w-full mt-4 rounded-full"
                        onClick={() => window.location.href = "/trips/new"}
                        data-testid="button-plan-trip"
                      >
                        Plan a Trip to {dest.name}
                      </Button>
                    )}
                  </>
                );
              })()}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Amadeus City Dialog */}
      <Dialog open={!!selectedAmadeusCity} onOpenChange={(open) => !open && setSelectedAmadeusCity(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedAmadeusCity && (
            <>
              <div className="h-48 overflow-hidden rounded-lg mb-4 relative">
                {selectedAmadeusCity.imageUrl ? (
                  <img
                    src={selectedAmadeusCity.imageUrl}
                    alt={`${selectedAmadeusCity.name}, ${selectedAmadeusCity.country}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-primary/5 flex items-center justify-center">
                    <div className="text-center p-6">
                      <Globe className="w-16 h-16 mx-auto mb-3 text-primary/40" />
                      <Badge variant="secondary" className="text-sm">
                        <Globe className="w-4 h-4 mr-1.5" />
                        Discover Worldwide
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl flex items-center gap-2">
                  {selectedAmadeusCity.name}, {selectedAmadeusCity.country}
                  <Badge variant="outline" className="ml-2">
                    <Globe className="w-3 h-3 mr-1" />
                    Global Database
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-base leading-relaxed">
                  Explore this destination from our global database powered by Amadeus. Discover tours, activities, and start planning your adventure.
                </DialogDescription>
              </DialogHeader>

              {/* City Information */}
              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  City Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Location:</span>
                    <span className="text-muted-foreground">{selectedAmadeusCity.name}, {selectedAmadeusCity.country}</span>
                  </div>
                  {selectedAmadeusCity.iataCode && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">IATA Code:</span>
                      <span className="text-muted-foreground font-mono">{selectedAmadeusCity.iataCode}</span>
                    </div>
                  )}
                  {selectedAmadeusCity.geoCode && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Coordinates:</span>
                      <span className="text-muted-foreground font-mono">
                        {selectedAmadeusCity.geoCode.latitude.toFixed(4)}, {selectedAmadeusCity.geoCode.longitude.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tours & Activities */}
              {amadeusActivitiesLoading && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900/50">
                  <p className="text-sm text-muted-foreground">Loading activities...</p>
                </div>
              )}
              
              {amadeusActivities?.data && amadeusActivities.data.length > 0 && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900/50">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    Popular Tours & Activities
                  </h3>
                  <div className="space-y-3">
                    {amadeusActivities.data.slice(0, 5).map((activity: any) => (
                      <div key={activity.id} className="p-3 bg-background rounded-lg border border-border">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2">{activity.name}</p>
                            {activity.shortDescription && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {activity.shortDescription}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              {activity.rating && (
                                <div className="flex items-center gap-1 text-xs">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{activity.rating}</span>
                                </div>
                              )}
                              {activity.price?.amount && (
                                <span className="text-xs font-medium text-primary">
                                  {activity.price.currencyCode} {activity.price.amount}
                                </span>
                              )}
                            </div>
                          </div>
                          {activity.bookingLink && (
                            <a
                              href={activity.bookingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0"
                            >
                              <Button size="sm" variant="outline" className="h-8">
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Powered by Amadeus - Book directly with providers
                  </p>
                </div>
              )}

              {!amadeusActivitiesLoading && (!amadeusActivities?.data || amadeusActivities.data.length === 0) && selectedAmadeusCity.geoCode && (
                <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    No tours or activities available for this destination at the moment.
                  </p>
                </div>
              )}

              {!selectedAmadeusCity.geoCode && (
                <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    Limited information available for this destination. Try searching for nearby cities or check back later.
                  </p>
                </div>
              )}

              {/* Call to Action */}
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
                <h4 className="font-semibold text-sm mb-2">Want to explore more destinations?</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  This destination is from our global database. Sign in to see our curated collection with detailed information, visa requirements, and climate data.
                </p>
                {!isAuthenticated && (
                  <Button
                    size="sm"
                    onClick={() => window.location.href = "/auth"}
                    className="w-full"
                  >
                    Sign In to See More
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  );
}
