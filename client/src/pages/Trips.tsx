import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { Plus, Calendar, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { Trip, Destination } from "@shared/schema";

export default function Trips() {
  const { isAuthenticated } = useAuth();

  const { data: trips, isLoading } = useQuery<(Trip & { destination: Destination })[]>({
    queryKey: ["/api/trips"],
    enabled: isAuthenticated,
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view and manage your trips
          </p>
          <Button
            size="lg"
            onClick={() => window.location.href = "/api/login"}
            className="rounded-full w-full"
            data-testid="button-signin"
          >
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <h1 className="text-xl font-bold" data-testid="text-page-title">My Trips</h1>
          
          <Link href="/trips/new">
            <Button size="sm" className="rounded-full gap-2" data-testid="button-create-trip">
              <Plus className="w-4 h-4" />
              New Trip
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-48 animate-pulse bg-muted" />
            ))}
          </div>
        ) : trips && trips.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip) => (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <Card className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 group h-full">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={trip.destination?.imageUrl}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-1" data-testid={`text-trip-title-${trip.id}`}>
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{trip.destination?.name}, {trip.destination?.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center max-w-md mx-auto">
            <div className="mb-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Trips Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start planning your next adventure by creating your first trip
              </p>
            </div>
            <Link href="/trips/new">
              <Button className="rounded-full w-full" data-testid="button-first-trip">
                Create Your First Trip
              </Button>
            </Link>
          </Card>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
