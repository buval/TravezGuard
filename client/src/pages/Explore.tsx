import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { Link } from "wouter";
import { MapPin } from "lucide-react";
import type { Destination } from "@shared/schema";

export default function Explore() {
  const { isAuthenticated } = useAuth();

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
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {dest.description}
                  </p>
                  <div className="mt-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                      {dest.category}
                    </span>
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

      <MobileNav />
    </div>
  );
}
