import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { ChevronLeft, Calendar, MapPin, FileText, Edit, Shield, FileCheck } from "lucide-react";
import type { Trip, Destination, ItineraryItem } from "@shared/schema";

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();

  const { data: trip, isLoading } = useQuery<Trip & { destination: Destination; itineraryItems: ItineraryItem[] }>({
    queryKey: ["/api/trips", id],
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { 
      weekday: "short",
      month: "short", 
      day: "numeric",
      year: "numeric" 
    });
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} ${days === 1 ? "day" : "days"}`;
  };

  const groupedItems = trip?.itineraryItems?.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>) || {};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="h-64 bg-muted animate-pulse" />
        <div className="container mx-auto px-4 py-6 max-w-4xl space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <p className="text-muted-foreground">Trip not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={trip.destination?.imageUrl}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        
        {/* Back Button */}
        <Link href="/">
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 left-4 rounded-full bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
            data-testid="button-back"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>

        {/* Trip Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-trip-title">
            {trip.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{trip.destination?.name}, {trip.destination?.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{getDuration(trip.startDate, trip.endDate)}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Trip Details */}
        <Card className="mb-6 p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-semibold">Trip Details</h2>
            <Link href={`/trips/${id}/edit`}>
              <Button size="sm" variant="outline" className="rounded-full gap-2" data-testid="button-edit-trip">
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Start Date</p>
              <p className="font-medium" data-testid="text-start-date">{formatDate(trip.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">End Date</p>
              <p className="font-medium" data-testid="text-end-date">{formatDate(trip.endDate)}</p>
            </div>
          </div>

          {trip.notes && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Notes</p>
              <p className="text-sm">{trip.notes}</p>
            </div>
          )}
        </Card>

        {/* Visa & Travel Requirements */}
        {trip.destination && (trip.destination.visaRequirements || trip.destination.travelDocuments) && (
          <Card className="mb-6 p-6 bg-primary/5 border-primary/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Visa & Travel Requirements
            </h2>
            
            {trip.destination.visaRequirements && (
              <div className="mb-4">
                <div className="flex items-start gap-2 mb-2">
                  <FileCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm mb-1">Visa Requirements</p>
                    <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-visa-requirements">
                      {trip.destination.visaRequirements}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {trip.destination.travelDocuments && (
              <div>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm mb-1">Required Documents</p>
                    <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-travel-documents">
                      {trip.destination.travelDocuments}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 p-3 bg-background rounded-lg border border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Important:</strong> Visa and entry requirements can change. Always verify current requirements with the embassy or official government sources before your trip.
              </p>
            </div>
          </Card>
        )}

        {/* About Destination */}
        {trip.destination && (
          <Card className="mb-6 p-6">
            <h2 className="text-xl font-semibold mb-4">About {trip.destination.name}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {trip.destination.description}
            </p>
          </Card>
        )}

        {/* Itinerary Preview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Itinerary</h2>
            <Link href={`/trips/${id}/itinerary`}>
              <Button size="sm" className="rounded-full gap-2" data-testid="button-view-itinerary">
                <FileText className="w-4 h-4" />
                View Full Itinerary
              </Button>
            </Link>
          </div>

          {Object.keys(groupedItems).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedItems).slice(0, 2).map(([day, items]) => (
                <div key={day}>
                  <h3 className="font-semibold mb-3" data-testid={`text-day-${day}`}>
                    Day {day}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 rounded-lg bg-muted/50"
                        data-testid={`item-activity-${item.id}`}
                      >
                        {item.time && (
                          <div className="text-sm font-medium text-muted-foreground min-w-[4rem]">
                            {item.time}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.title}</p>
                          {item.location && (
                            <p className="text-sm text-muted-foreground">{item.location}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(groupedItems).length > 2 && (
                <p className="text-sm text-muted-foreground text-center">
                  And {Object.keys(groupedItems).length - 2} more days...
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No activities added yet</p>
              <Link href={`/trips/${id}/itinerary`}>
                <Button className="rounded-full" data-testid="button-add-activities">
                  Add Activities
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </main>

      <MobileNav />
    </div>
  );
}
