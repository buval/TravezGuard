import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Users } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import logoUrl from "@assets/logo_1761679001485.png";
import heroBeachUrl from "@assets/generated_images/Hero_beach_paradise_landscape_21ce7151.png";
import type { Destination } from "@shared/schema";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect authenticated users to home
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/home");
    }
  }, [isAuthenticated, setLocation]);

  // Fetch featured destinations from API
  const { data: featuredDestinations, isLoading} = useQuery<Destination[]>({
    queryKey: ["/api/destinations/featured"],
  });

  const features = [
    {
      icon: MapPin,
      title: "Discover Destinations",
      description: "Explore amazing places around the world",
    },
    {
      icon: Calendar,
      title: "Plan Your Trip",
      description: "Create detailed itineraries day-by-day",
    },
    {
      icon: Users,
      title: "Share & Collaborate",
      description: "Share trips with friends and family",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2">
            <img src={logoUrl} alt="Travez" className="h-8" data-testid="img-logo" />
          </div>
          <Link href="/auth">
            <Button
              variant="default"
              className="rounded-full"
              data-testid="button-login"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden mt-16">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBeachUrl})` }}
        >
          {/* Dark gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-20 text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6" data-testid="text-hero-title">
            Plan Your Dream Journey
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover amazing destinations, create detailed itineraries, and make unforgettable memories
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button
                size="lg"
                className="rounded-full text-base px-8 py-6 font-semibold"
                data-testid="button-get-started"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full text-base px-8 py-6 font-semibold bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
                data-testid="button-explore"
              >
                Explore as Guest
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-features-title">
            Everything You Need to Travel
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="p-6 hover-elevate">
                <CardContent className="p-0">
                  <feature.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" data-testid="text-destinations-title">
            Popular Destinations
          </h2>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="h-48 animate-pulse bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDestinations?.map((dest) => (
                <Link key={dest.id} href="/explore">
                  <Card
                    className="overflow-hidden cursor-pointer hover-elevate active-elevate-2 group"
                    data-testid={`card-destination-${dest.id}`}
                  >
                    <div className="aspect-[3/2] overflow-hidden">
                      <img
                        src={dest.imageUrl}
                        alt={dest.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-1">{dest.name}</h3>
                      <p className="text-sm text-muted-foreground">{dest.country}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Join thousands of travelers planning their perfect trips with Travez
          </p>
          <Link href="/auth">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full text-base px-8 py-6 font-semibold"
              data-testid="button-cta-signin"
            >
              Sign In to Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-card-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Travez. Plan your perfect journey.</p>
        </div>
      </footer>
    </div>
  );
}
