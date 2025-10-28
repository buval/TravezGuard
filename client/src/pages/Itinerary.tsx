import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { MobileNav } from "@/components/MobileNav";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ChevronLeft, Plus, Trash2, Clock, MapPin } from "lucide-react";
import type { Trip, Destination, ItineraryItem, InsertItineraryItem } from "@shared/schema";

export default function Itinerary() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const { data: trip } = useQuery<Trip & { destination: Destination; itineraryItems: ItineraryItem[] }>({
    queryKey: ["/api/trips", id],
  });

  const addItemMutation = useMutation({
    mutationFn: async (data: InsertItineraryItem) => {
      return await apiRequest("POST", "/api/itinerary-items", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips", id] });
      setIsAddDialogOpen(false);
      toast({ title: "Activity added successfully" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Failed to add activity", variant: "destructive" });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return await apiRequest("DELETE", `/api/itinerary-items/${itemId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips", id] });
      toast({ title: "Activity deleted" });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({ title: "Failed to delete activity", variant: "destructive" });
    },
  });

  const handleAddActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addItemMutation.mutate({
      tripId: id!,
      day: parseInt(formData.get("day") as string),
      time: formData.get("time") as string || undefined,
      title: formData.get("title") as string,
      description: formData.get("description") as string || undefined,
      location: formData.get("location") as string || undefined,
      type: formData.get("type") as string,
    });
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const groupedItems = trip?.itineraryItems?.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>) || {};

  const totalDays = trip ? getDuration(trip.startDate, trip.endDate) : 0;
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-4xl">
          <div className="flex items-center gap-3">
            <Link href={`/trips/${id}`}>
              <Button size="icon" variant="ghost" className="rounded-full" data-testid="button-back">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold" data-testid="text-page-title">Itinerary</h1>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-full gap-2" data-testid="button-add-activity">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Activity</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddActivity}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="day">Day</Label>
                    <Select name="day" defaultValue="1" required>
                      <SelectTrigger data-testid="select-day">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            Day {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" defaultValue="activity" required>
                      <SelectTrigger data-testid="select-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activity">Activity</SelectItem>
                        <SelectItem value="dining">Dining</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Visit Acropolis"
                      required
                      data-testid="input-title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time (Optional)</Label>
                    <Input
                      id="time"
                      name="time"
                      placeholder="e.g., 09:00 AM"
                      data-testid="input-time"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., Athens, Greece"
                      data-testid="input-location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Add details about this activity..."
                      rows={3}
                      data-testid="input-description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="rounded-full"
                    disabled={addItemMutation.isPending}
                    data-testid="button-submit-activity"
                  >
                    {addItemMutation.isPending ? "Adding..." : "Add Activity"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {days.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading trip details...</p>
          </Card>
        ) : days.map((day) => (
          <div key={day} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold">
                {day}
              </div>
              <h2 className="text-xl font-semibold" data-testid={`text-day-${day}`}>
                Day {day}
              </h2>
            </div>

            {groupedItems[day] && groupedItems[day].length > 0 ? (
              <div className="space-y-3 relative before:absolute before:left-5 before:top-12 before:bottom-0 before:w-0.5 before:bg-border">
                {groupedItems[day].map((item, idx) => (
                  <Card
                    key={item.id}
                    className="ml-12 hover-elevate"
                    data-testid={`card-activity-${item.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {item.time && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{item.time}</span>
                              </div>
                            )}
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                              {item.type}
                            </span>
                          </div>
                          
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          
                          {item.location && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                              <MapPin className="w-3 h-3" />
                              <span>{item.location}</span>
                            </div>
                          )}
                          
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                        
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full text-destructive hover:bg-destructive/10"
                          onClick={() => deleteItemMutation.mutate(item.id)}
                          disabled={deleteItemMutation.isPending}
                          data-testid={`button-delete-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="ml-12 p-6 text-center border-dashed">
                <p className="text-sm text-muted-foreground">No activities for this day</p>
              </Card>
            )}
          </div>
        ))}
      </main>

      <MobileNav />
    </div>
  );
}
