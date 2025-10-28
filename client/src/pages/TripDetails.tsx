import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { MobileNav } from "@/components/MobileNav";
import { ChevronLeft, Calendar, MapPin, FileText, Edit, Shield, FileCheck, Sun, DollarSign, Plus, Trash2, Hotel, Utensils, Plane, Ticket, ShoppingBag, MoreHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExpenseSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Trip, Destination, ItineraryItem, Expense } from "@shared/schema";

const EXPENSE_CATEGORIES = [
  { value: "accommodation", label: "Accommodation", icon: Hotel },
  { value: "food", label: "Food & Dining", icon: Utensils },
  { value: "transport", label: "Transportation", icon: Plane },
  { value: "activities", label: "Activities", icon: Ticket },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "other", label: "Other", icon: MoreHorizontal },
];

export default function TripDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const { data: trip, isLoading } = useQuery<Trip & { destination: Destination; itineraryItems: ItineraryItem[]; expenses: Expense[] }>({
    queryKey: ["/api/trips", id],
  });

  const form = useForm({
    defaultValues: {
      tripId: id,
      category: "other",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    },
  });

  const createExpenseMutation = useMutation({
    mutationFn: async (data: { tripId: string; category: string; amount: number; date: string; description: string }) => {
      const response = await apiRequest("POST", "/api/expenses", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips", id] });
      toast({ title: "Expense added successfully!" });
      form.reset({
        tripId: id,
        category: "other",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setShowExpenseForm(false);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to add expense", variant: "destructive" });
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      await apiRequest("DELETE", `/api/expenses/${expenseId}`, null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/trips", id] });
      toast({ title: "Expense deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete expense", variant: "destructive" });
    },
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

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const totalExpenses = trip?.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const budgetPercentage = trip?.budget ? Math.min((totalExpenses / trip.budget) * 100, 100) : 0;

  const groupedItems = trip?.itineraryItems?.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>) || {};

  const onSubmitExpense = (data: any) => {
    const amountInCents = Math.round(parseFloat(data.amount) * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    
    createExpenseMutation.mutate({
      tripId: data.tripId,
      category: data.category,
      amount: amountInCents,
      date: data.date,
      description: data.description || "",
    });
  };

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

        {/* Weather & Climate Information */}
        {trip.destination && (trip.destination.climate || trip.destination.bestMonths) && (
          <Card className="mb-6 p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Climate & Best Time to Visit
            </h2>
            
            {trip.destination.climate && (
              <div className="mb-4">
                <div className="flex items-start gap-2">
                  <Sun className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm mb-1">Climate</p>
                    <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-climate">
                      {trip.destination.climate}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {trip.destination.bestMonths && (
              <div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm mb-1">Best Time to Visit</p>
                    <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-best-months">
                      {trip.destination.bestMonths}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

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

        {/* Budget & Expenses */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Budget & Expenses
            </h2>
            <Button
              size="sm"
              onClick={() => setShowExpenseForm(!showExpenseForm)}
              className="rounded-full gap-2"
              data-testid="button-add-expense"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
          </div>

          {/* Budget Overview */}
          {trip.budget && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Budget Progress</span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(totalExpenses)} / {formatCurrency(trip.budget)}
                </span>
              </div>
              <Progress value={budgetPercentage} className="h-2 mb-2" />
              <div className="text-xs text-muted-foreground">
                {trip.budget - totalExpenses > 0 ? (
                  <span className="text-green-600 dark:text-green-400">
                    {formatCurrency(trip.budget - totalExpenses)} remaining
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">
                    {formatCurrency(totalExpenses - trip.budget)} over budget
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Add Expense Form */}
          {showExpenseForm && (
            <Card className="p-4 mb-6 bg-muted/30">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitExpense)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {EXPENSE_CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              data-testid="input-amount"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} data-testid="input-date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Hotel night 1" {...field} data-testid="input-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowExpenseForm(false)}
                      className="rounded-full"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-full"
                      disabled={createExpenseMutation.isPending}
                      data-testid="button-submit-expense"
                    >
                      {createExpenseMutation.isPending ? "Adding..." : "Add Expense"}
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          )}

          {/* Expenses List */}
          {trip.expenses && trip.expenses.length > 0 ? (
            <div className="space-y-2">
              {trip.expenses.map((expense) => {
                const category = EXPENSE_CATEGORIES.find((c) => c.value === expense.category);
                const CategoryIcon = category?.icon || MoreHorizontal;
                return (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover-elevate"
                    data-testid={`expense-${expense.id}`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-muted">
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{category?.label || expense.category}</p>
                          <span className="text-xs text-muted-foreground">{formatDate(expense.date)}</span>
                        </div>
                        {expense.description && (
                          <p className="text-sm text-muted-foreground">{expense.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{formatCurrency(expense.amount)}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full"
                        onClick={() => deleteExpenseMutation.mutate(expense.id)}
                        data-testid={`button-delete-${expense.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No expenses tracked yet</p>
              <p className="text-sm">Click "Add Expense" to start tracking your trip costs</p>
            </div>
          )}
        </Card>

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
