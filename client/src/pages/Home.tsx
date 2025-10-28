import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MobileNav } from "@/components/MobileNav";
import { Plus, Calendar, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { Trip, Destination } from "@shared/schema";
import santoriniUrl from "@assets/generated_images/Santorini_Greece_destination_ed8bbac7.png";
import mountainUrl from "@assets/generated_images/Mountain_lake_alpine_landscape_a7b30a6f.png";
import tokyoUrl from "@assets/generated_images/Tokyo_Japan_city_nightscape_9823a378.png";
import machuPicchuUrl from "@assets/generated_images/Machu_Picchu_Peru_ruins_7f99dac1.png";
import cappadociaUrl from "@assets/generated_images/Cappadocia_Turkey_hot_air_balloons_52a3e247.png";
import maldivesUrl from "@assets/generated_images/Maldives_overwater_bungalows_paradise_b727e2cb.png";
import parisUrl from "@assets/generated_images/Paris_Eiffel_Tower_twilight_4567ec69.png";
import safariUrl from "@assets/generated_images/African_safari_sunset_landscape_b72df65e.png";

export default function Home() {
  const { user } = useAuth();

  // Fetch user's trips
  const { data: trips, isLoading: tripsLoading } = useQuery<(Trip & { destination: Destination })[]>({
    queryKey: ["/api/trips"],
  });

  // Fetch featured destinations
  const { data: destinations, isLoading: destinationsLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations/featured"],
  });

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <h1 className="text-xl font-bold" data-testid="text-app-title">Travez</h1>
          
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => window.location.href = "/api/logout"}
              className="rounded-full"
              data-testid="button-logout"
            >
              <Avatar className="w-9 h-9">
                <AvatarImage src={user?.profileImageUrl || undefined} className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user?.firstName || user?.email)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-welcome">
            Welcome back, {user?.firstName || "Traveler"}!
          </h2>
          <p className="text-muted-foreground">Ready to plan your next adventure?</p>
        </div>

        {/* My Trips Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">My Trips</h3>
            <Link href="/trips/new">
              <Button size="sm" className="rounded-full gap-2" data-testid="button-create-trip">
                <Plus className="w-4 h-4" />
                New Trip
              </Button>
            </Link>
          </div>

          {tripsLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Card key={i} className="h-32 animate-pulse bg-muted" />
              ))}
            </div>
          ) : trips && trips.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {trips.map((trip) => (
                <Link key={trip.id} href={`/trips/${trip.id}`}>
                  <Card className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 group">
                    <div className="flex">
                      <div className="w-1/3 aspect-square overflow-hidden">
                        <img
                          src={trip.destination?.imageUrl || santoriniUrl}
                          alt={trip.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="flex-1 p-4">
                        <h4 className="font-semibold mb-2 line-clamp-1" data-testid={`text-trip-title-${trip.id}`}>
                          {trip.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4" />
                          <span className="line-clamp-1">{trip.destination?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">You haven't created any trips yet</p>
              <Link href="/trips/new">
                <Button className="rounded-full" data-testid="button-first-trip">
                  Create Your First Trip
                </Button>
              </Link>
            </Card>
          )}
        </section>

        {/* Featured Destinations */}
        <section>
          <h3 className="text-xl font-semibold mb-6">Explore Destinations</h3>
          
          {destinationsLoading ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-48 animate-pulse bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h4 className="font-semibold text-lg mb-1">{dest.name}</h4>
                      <p className="text-sm opacity-90">{dest.country}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>

      <MobileNav />
    </div>
  );
}
