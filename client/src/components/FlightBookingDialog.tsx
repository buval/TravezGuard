import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, Plane, CreditCard, CheckCircle, Calendar, MapPin } from "lucide-react";
import type { FlightOffer } from "@shared/schema";
import { format } from "date-fns";
import { getAirlineName } from "@/lib/airlineData";

interface FlightBookingDialogProps {
  flight: FlightOffer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type BookingStep = "passengers" | "review" | "payment" | "confirmation";

const passengerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().optional(),
  passportNumber: z.string().optional(),
  seatPreference: z.string().optional(),
});

type PassengerFormData = z.infer<typeof passengerSchema>;

export function FlightBookingDialog({ flight, open, onOpenChange }: FlightBookingDialogProps) {
  const [step, setStep] = useState<BookingStep>("passengers");
  const [passengerData, setPassengerData] = useState<PassengerFormData | null>(null);

  const form = useForm<PassengerFormData>({
    resolver: zodResolver(passengerSchema),
    defaultValues: {
      title: "Mr",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      passportNumber: "",
      seatPreference: "window",
    },
  });

  if (!flight) return null;

  const outbound = flight.itineraries[0];
  const firstSegment = outbound.segments[0];
  const lastSegment = outbound.segments[outbound.segments.length - 1];
  const price = parseFloat(flight.price.total);
  const isInternational = firstSegment.departure.iataCode.substring(0, 1) !== lastSegment.arrival.iataCode.substring(0, 1);

  const getStepProgress = (): number => {
    switch (step) {
      case "passengers": return 33;
      case "review": return 66;
      case "payment": return 90;
      case "confirmation": return 100;
      default: return 0;
    }
  };

  const handlePassengerSubmit = (data: PassengerFormData) => {
    setPassengerData(data);
    setStep("review");
  };

  const handleConfirmBooking = () => {
    setStep("payment");
  };

  const handlePaymentComplete = () => {
    setStep("confirmation");
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+)H(\d+)M/);
    if (!match) return duration;
    return `${match[1]}h ${match[2]}m`;
  };

  const formatDateTime = (dateTime: string) => {
    try {
      return format(new Date(dateTime), "MMM d, h:mm a");
    } catch {
      return dateTime;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {step === "passengers" && "Passenger Details"}
            {step === "review" && "Review Your Booking"}
            {step === "payment" && "Payment"}
            {step === "confirmation" && "Booking Confirmed!"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={getStepProgress()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className={step === "passengers" ? "text-primary font-medium" : ""}>
                <User className="w-3 h-3 inline mr-1" />
                Details
              </span>
              <span className={step === "review" ? "text-primary font-medium" : ""}>
                <Plane className="w-3 h-3 inline mr-1" />
                Review
              </span>
              <span className={step === "payment" ? "text-primary font-medium" : ""}>
                <CreditCard className="w-3 h-3 inline mr-1" />
                Payment
              </span>
              <span className={step === "confirmation" ? "text-primary font-medium" : ""}>
                <CheckCircle className="w-3 h-3 inline mr-1" />
                Done
              </span>
            </div>
          </div>

          {/* Flight Summary Card - Always visible */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{getAirlineName(flight.validatingAirlineCodes[0])}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {outbound.segments.length === 1 ? "Direct" : `${outbound.segments.length - 1} stop${outbound.segments.length > 2 ? "s" : ""}`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{firstSegment.departure.iataCode}</span>
                      </div>
                      <div className="font-medium">{formatDateTime(firstSegment.departure.at)}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{lastSegment.arrival.iataCode}</span>
                      </div>
                      <div className="font-medium">{formatDateTime(lastSegment.arrival.at)}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Duration: {formatDuration(outbound.duration)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${price.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{flight.price.currency}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          {step === "passengers" && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handlePassengerSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Primary Passenger</h3>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-title">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mr">Mr</SelectItem>
                              <SelectItem value="Mrs">Mrs</SelectItem>
                              <SelectItem value="Ms">Ms</SelectItem>
                              <SelectItem value="Dr">Dr</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John" data-testid="input-first-name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" data-testid="input-last-name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" data-testid="input-email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 234 567 8900" data-testid="input-phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {isInternational && (
                    <>
                      <Separator />
                      <h4 className="text-sm font-medium text-muted-foreground">International Travel Information</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input type="date" data-testid="input-dob" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="passportNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Passport Number</FormLabel>
                              <FormControl>
                                <Input placeholder="A12345678" data-testid="input-passport" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}

                  <Separator />
                  <h4 className="text-sm font-medium text-muted-foreground">Seat Preference (Optional)</h4>
                  
                  <FormField
                    control={form.control}
                    name="seatPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Seat</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-seat-preference">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="window">Window</SelectItem>
                            <SelectItem value="aisle">Aisle</SelectItem>
                            <SelectItem value="middle">No Preference</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" data-testid="button-continue">
                    Continue to Review
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {step === "review" && passengerData && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold">Passenger Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Name</div>
                      <div className="font-medium">{passengerData.title} {passengerData.firstName} {passengerData.lastName}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Email</div>
                      <div className="font-medium">{passengerData.email}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Phone</div>
                      <div className="font-medium">{passengerData.phone}</div>
                    </div>
                    {passengerData.seatPreference && (
                      <div>
                        <div className="text-muted-foreground">Seat Preference</div>
                        <div className="font-medium capitalize">{passengerData.seatPreference}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold">Price Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Fare (1 Adult)</span>
                      <span>${price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Taxes & Fees</span>
                      <span>Included</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${price.toFixed(2)} {flight.price.currency}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("passengers")}
                  data-testid="button-back"
                >
                  Back
                </Button>
                <Button onClick={handleConfirmBooking} data-testid="button-proceed-payment">
                  Proceed to Payment
                </Button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Demo Payment Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a demonstration booking system. In production, Stripe payment processing would be integrated here.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <h3 className="font-semibold">Payment Information</h3>
                  <div className="space-y-3">
                    <div>
                      <Label>Card Number (Demo)</Label>
                      <Input placeholder="4242 4242 4242 4242" disabled />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Expiry Date (Demo)</Label>
                        <Input placeholder="MM/YY" disabled />
                      </div>
                      <div>
                        <Label>CVV (Demo)</Label>
                        <Input placeholder="123" disabled />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("review")}
                  data-testid="button-back-review"
                >
                  Back
                </Button>
                <Button onClick={handlePaymentComplete} data-testid="button-complete-booking">
                  Complete Booking (Demo)
                </Button>
              </div>
            </div>
          )}

          {step === "confirmation" && (
            <div className="space-y-6 text-center py-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Booking Confirmed!</h3>
                <p className="text-muted-foreground">
                  Your booking reference: <span className="font-mono font-bold">TRV-DEMO-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                </p>
              </div>

              <Card>
                <CardContent className="p-4 text-left space-y-2 text-sm">
                  <p>✓ Confirmation email sent to {passengerData?.email}</p>
                  <p>✓ E-ticket will be available in your trips</p>
                  <p>✓ Check-in opens 24 hours before departure</p>
                </CardContent>
              </Card>

              <Button
                onClick={() => {
                  onOpenChange(false);
                  setStep("passengers");
                  form.reset();
                }}
                className="w-full"
                data-testid="button-done"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
