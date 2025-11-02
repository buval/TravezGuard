import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileNav } from "@/components/MobileNav";
import { Plus, Calendar, MapPin, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import type { Trip, Destination } from "@shared/schema";

export default function Trips() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);

  const { data: trips, isLoading } = useQuery<(Trip & { destination: Destination })[]>({
    queryKey: ["/api/trips"],
    enabled: isAuthenticated,
  });

  const deleteTripMutation = useMutation({
    mutationFn: async (tripId: string) => {
      await apiRequest("DELETE", `/api/trips/${tripId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
      toast({ title: "Trip deleted successfully" });
      setTripToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete trip",
        description: error.message,
        variant: "destructive",
      });
      setTripToDelete(null);
    },
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
          <Link href="/auth">
            <Button
              size="lg"
              className="rounded-full w-full"
              data-testid="button-signin"
            >
              Sign In
            </Button>
          </Link>
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
              <Card key={trip.id} className="overflow-hidden hover-elevate active-elevate-2 group h-full">
                <Link href={`/trips/${trip.id}`}>
                  <div className="aspect-[16/9] overflow-hidden cursor-pointer">
                    <img
                      src={trip.destination?.imageUrl}
                      alt={trip.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link href={`/trips/${trip.id}`} className="flex-1 min-w-0 cursor-pointer">
                      <h3 className="font-semibold line-clamp-1" data-testid={`text-trip-title-${trip.id}`}>
                        {trip.title}
                      </h3>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 flex-shrink-0"
                          data-testid={`button-trip-menu-${trip.id}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/trips/${trip.id}/edit`);
                          }}
                          data-testid={`menu-item-edit-${trip.id}`}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Trip
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setTripToDelete(trip.id);
                          }}
                          className="text-destructive"
                          data-testid={`menu-item-delete-${trip.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Trip
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Link href={`/trips/${trip.id}`} className="block cursor-pointer">
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
                  </Link>
                </CardContent>
              </Card>
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

      <AlertDialog open={!!tripToDelete} onOpenChange={(open) => !open && setTripToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Trip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this trip? This action cannot be undone and will also delete all itinerary items and expenses associated with this trip.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete" disabled={deleteTripMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => tripToDelete && deleteTripMutation.mutate(tripToDelete)}
              disabled={deleteTripMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteTripMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MobileNav />
    </div>
  );
}
