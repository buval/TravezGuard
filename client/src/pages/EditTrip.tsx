import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MobileNav } from "@/components/MobileNav";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import type { Destination, InsertTrip, Trip } from "@shared/schema";

export default function EditTrip() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedDestination, setSelectedDestination] = useState<string>("");

  const { data: trip, isLoading: tripLoading } = useQuery<Trip & { destination: Destination }>({
    queryKey: ["/api/trips", id],
    enabled: !!id,
  });

  const { data: destinations, isLoading: destinationsLoading } = useQuery<Destination[]>({
    queryKey: ["/api/destinations"],
  });

  useEffect(() => {
    if (trip?.destinationId) {
      setSelectedDestination(trip.destinationId);
    }
  }, [trip]);

  const updateTripMutation = useMutation({
    mutationFn: async (data: Partial<InsertTrip>) => {
      const response = await apiRequest("PATCH", `/api/trips/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trips", id] });
      toast({ title: "Trip updated successfully!" });
      setLocation(`/trips/${id}`);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Failed to update trip",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    updateTripMutation.mutate({
      destinationId: formData.get("destinationId") as string,
      title: formData.get("title") as string,
      startDate: formData.get("startDate") as string,
      endDate: formData.get("endDate") as string,
      notes: formData.get("notes") as string || undefined,
    });
  };

  const selectedDest = destinations?.find((d) => d.id === selectedDestination);

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background pb-20 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Trip Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The trip you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link href="/trips">
            <Button className="rounded-full" data-testid="button-back-trips">
              Back to My Trips
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3 max-w-4xl">
          <Link href={`/trips/${id}`}>
            <Button size="icon" variant="ghost" className="rounded-full" data-testid="button-back">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">Edit Trip</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Choose Destination</h2>
              
              {destinationsLoading ? (
                <div className="h-12 bg-muted animate-pulse rounded" />
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="destinationId">Destination</Label>
                    <Select
                      name="destinationId"
                      value={selectedDestination}
                      onValueChange={setSelectedDestination}
                      required
                    >
                      <SelectTrigger data-testid="select-destination">
                        <SelectValue placeholder="Select a destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations?.map((dest) => (
                          <SelectItem key={dest.id} value={dest.id}>
                            {dest.name}, {dest.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDest && (
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={selectedDest.imageUrl}
                        alt={selectedDest.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {selectedDest.description}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Trip Details</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Trip Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Summer Adventure in Greece"
                    defaultValue={trip.title}
                    required
                    data-testid="input-title"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      defaultValue={trip.startDate}
                      required
                      data-testid="input-start-date"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      defaultValue={trip.endDate}
                      required
                      data-testid="input-end-date"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Add any additional notes or plans..."
                    defaultValue={trip.notes || ""}
                    rows={4}
                    data-testid="input-notes"
                  />
                </div>
              </div>
            </Card>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full"
              disabled={updateTripMutation.isPending}
              data-testid="button-update-trip"
            >
              {updateTripMutation.isPending ? "Updating..." : "Update Trip"}
            </Button>
          </div>
        </form>
      </main>

      <MobileNav />
    </div>
  );
}
