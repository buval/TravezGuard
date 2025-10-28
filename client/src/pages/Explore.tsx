import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Shield } from "lucide-react";
import type { Destination } from "@shared/schema";

export default function Explore() {
  const { isAuthenticated } = useAuth();
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const { data: destinations, isLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <h1 className="text-xl font-bold" data-testid="text-page-title">Explore Destinations</h1>
          
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

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-64 animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations?.map((dest) => (
              <Card
                key={dest.id}
                className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 group"
                onClick={() => setSelectedDestination(dest)}
                data-testid={`card-destination-${dest.id}`}
              >
                <div className="aspect-[3/2] overflow-hidden relative">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg mb-1">{dest.name}</h3>
                    <div className="flex items-center gap-2 text-sm opacity-90">
                      <MapPin className="w-4 h-4" />
                      <span>{dest.country}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {dest.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                      {dest.category}
                    </span>
                    {dest.visaRequirements && (
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

        {!isAuthenticated && destinations && destinations.length > 0 && (
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

              {/* Visa & Travel Requirements */}
              {(selectedDestination.visaRequirements || selectedDestination.travelDocuments) && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
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
