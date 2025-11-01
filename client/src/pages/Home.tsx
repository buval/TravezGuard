import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MobileNav } from "@/components/MobileNav";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Shield, Search, X, Sun, Calendar, Landmark, Activity, ExternalLink, Star } from "lucide-react";
import type { Destination } from "@shared/schema";

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
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  // Fetch POIs for selected destination
  const { data: pois, isLoading: poisLoading } = useQuery<any>({
    queryKey: [`/api/destinations/${selectedDestination?.id}/pois`],
    enabled: !!selectedDestination,
  });

  // Fetch Activities for selected destination
  const { data: activities, isLoading: activitiesLoading } = useQuery<any>({
    queryKey: [`/api/destinations/${selectedDestination?.id}/activities`],
    enabled: !!selectedDestination,
  });

  // Filter and search destinations
  const filteredDestinations = useMemo(() => {
    if (!destinations) return [];

    let filtered = destinations;

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((dest) => dest.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dest) =>
          dest.name.toLowerCase().includes(query) ||
          dest.country.toLowerCase().includes(query) ||
          dest.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [destinations, selectedCategory, searchQuery]);

  const hasActiveFilters = selectedCategory !== "all" || searchQuery.trim() !== "";

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <h1 className="text-xl font-bold" data-testid="text-page-title">Travez</h1>
          
          {!isAuthenticated && (
            <Button
              variant="default"
              onClick={() => window.location.href = "/api/login"}
              className="rounded-full"
              data-testid="button-login"
            >
              Sign In
            </Button>
          )}
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
            {filteredDestinations.map((destination) => (
              <Card
                key={destination.id}
                className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 group"
                onClick={() => setSelectedDestination(destination)}
                data-testid={`card-destination-${destination.id}`}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1" data-testid={`text-destination-name-${destination.id}`}>
                    {destination.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{destination.country}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {destination.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full capitalize">
                      {destination.category}
                    </span>
                    {destination.visaRequirements && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Shield className="w-3 h-3" />
                        <span>Visa info</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
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
                onClick={() => window.location.href = "/api/login"}
                className="rounded-full"
                data-testid="button-cta-signin"
              >
                Sign In to Get Started
              </Button>
            </Card>
          </div>
        )}
      </main>

      {/* Destination Details Dialog */}
      <Dialog open={!!selectedDestination} onOpenChange={(open) => !open && setSelectedDestination(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDestination && (
            <>
              <div className="aspect-[16/9] overflow-hidden rounded-lg mb-4 -mt-6">
                <img
                  src={selectedDestination.imageUrl}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedDestination.name}, {selectedDestination.country}</DialogTitle>
                <DialogDescription className="text-base leading-relaxed pt-2">
                  {selectedDestination.description}
                </DialogDescription>
              </DialogHeader>

              {/* Weather & Climate Information */}
              {(selectedDestination.climate || selectedDestination.bestMonths) && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/50">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Climate & Best Time to Visit
                  </h3>
                  
                  {selectedDestination.climate && (
                    <div className="mb-4">
                      <p className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Climate
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedDestination.climate}
                      </p>
                    </div>
                  )}

                  {selectedDestination.bestMonths && (
                    <div>
                      <p className="font-medium text-sm mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Best Time to Visit
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedDestination.bestMonths}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Visa & Travel Requirements */}
              {(selectedDestination.visaRequirements || selectedDestination.travelDocuments) && (
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Visa & Travel Requirements
                  </h3>
                  
                  {selectedDestination.visaRequirements && (
                    <div className="mb-4">
                      <p className="font-medium text-sm mb-2">Visa Requirements</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedDestination.visaRequirements}
                      </p>
                    </div>
                  )}

                  {selectedDestination.travelDocuments && (
                    <div className="mb-4">
                      <p className="font-medium text-sm mb-2">Required Documents</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedDestination.travelDocuments}
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

              {/* Points of Interest */}
              {pois?.data && pois.data.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900/50">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Top Attractions & Places
                  </h3>
                  <div className="space-y-3">
                    {pois.data.slice(0, 5).map((poi: any) => (
                      <div key={poi.id} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                        <MapPin className="w-4 h-4 mt-1 text-green-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{poi.name}</p>
                          {poi.category && (
                            <p className="text-xs text-muted-foreground mt-1 capitalize">
                              {poi.category}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Powered by Amadeus - Real-time attraction data
                  </p>
                </div>
              )}
              {poisLoading && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900/50">
                  <p className="text-sm text-muted-foreground">Loading attractions...</p>
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
                  Plan a Trip to {selectedDestination.name}
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  );
}
