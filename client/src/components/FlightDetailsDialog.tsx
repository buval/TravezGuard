import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Clock, 
  Briefcase, 
  ShoppingBag, 
  MapPin,
  Info,
  Wifi,
  Monitor,
  UtensilsCrossed,
  X
} from "lucide-react";
import { format } from "date-fns";
import { getAirlineName, getAircraftInfo, getBaggageInfo } from "@/lib/airlineData";

interface FlightDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flight: any;
}

export function FlightDetailsDialog({ open, onOpenChange, flight }: FlightDetailsDialogProps) {
  if (!flight) return null;

  const outbound = flight.itineraries[0];
  const firstSegment = outbound.segments[0];
  const lastSegment = outbound.segments[outbound.segments.length - 1];
  const airlineCode = flight.validatingAirlineCodes[0];
  const airlineName = getAirlineName(airlineCode);
  
  // Get aircraft info for the first segment
  const aircraftInfo = getAircraftInfo(firstSegment.aircraft?.code);
  
  // Get baggage info
  const baggageInfo = getBaggageInfo(airlineCode);

  const formatTime = (dateTime: string) => {
    return format(new Date(dateTime), "HH:mm");
  };

  const formatDate = (dateTime: string) => {
    return format(new Date(dateTime), "EEE, MMM dd");
  };

  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    const hours = match[1] ? match[1].replace("H", "h ") : "";
    const minutes = match[2] ? match[2].replace("M", "m") : "";
    return (hours + minutes).trim();
  };

  // Determine fare class (simulated - in real app would come from API)
  const fareClass = "Economy";
  const fareType = Math.random() > 0.5 ? "Standard" : "Basic";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-testid="dialog-flight-details">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Flight Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price and Airline Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-primary">${flight.price.total}</h3>
              <p className="text-sm text-muted-foreground">{flight.price.currency}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{airlineName}</p>
              <Badge variant="secondary">{airlineCode}</Badge>
            </div>
          </div>

          {/* Flight Route Overview */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{formatTime(firstSegment.departure.at)}</p>
                <p className="text-sm text-muted-foreground">{firstSegment.departure.iataCode}</p>
                <p className="text-xs text-muted-foreground">{formatDate(firstSegment.departure.at)}</p>
              </div>
              
              <div className="flex-1 mx-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-px bg-border flex-1" />
                  <Plane className="w-5 h-5 text-muted-foreground" />
                  <div className="h-px bg-border flex-1" />
                </div>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(outbound.duration)}
                </p>
                {outbound.segments.length > 1 && (
                  <Badge variant="outline" className="mt-2">
                    {outbound.segments.length - 1} stop{outbound.segments.length > 2 ? "s" : ""}
                  </Badge>
                )}
              </div>
              
              <div className="text-center">
                <p className="text-3xl font-bold">{formatTime(lastSegment.arrival.at)}</p>
                <p className="text-sm text-muted-foreground">{lastSegment.arrival.iataCode}</p>
                <p className="text-xs text-muted-foreground">{formatDate(lastSegment.arrival.at)}</p>
              </div>
            </div>
          </Card>

          {/* Fare Type and Ticket Information */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Ticket Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Fare Class</p>
                <p className="font-medium">{fareClass}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fare Type</p>
                <p className="font-medium">{fareType}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Booking Class</p>
                <p className="font-medium">Y</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Refundable</p>
                <p className="font-medium">{fareType === "Standard" ? "Yes" : "No"}</p>
              </div>
            </div>
          </Card>

          {/* Baggage Information */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Baggage Allowance
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShoppingBag className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="font-medium">Personal Item</p>
                  <p className="text-sm text-muted-foreground">
                    {baggageInfo.personal.included ? "Included" : "Not included"} • {baggageInfo.personal.dimensions}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="font-medium">Carry-on Bag</p>
                  <p className="text-sm text-muted-foreground">
                    {baggageInfo.carryOn.included ? "Included" : "Not included"} • 
                    {baggageInfo.carryOn.weight} • {baggageInfo.carryOn.dimensions}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <ShoppingBag className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="font-medium">Checked Baggage</p>
                  <p className="text-sm text-muted-foreground">
                    {baggageInfo.checked.included > 0 
                      ? `${baggageInfo.checked.included} bag${baggageInfo.checked.included > 1 ? "s" : ""} included`
                      : baggageInfo.checked.fee} • 
                    {baggageInfo.checked.weight} max
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Flight Segments Detail */}
          <Card className="p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Flight Segments
            </h4>
            <div className="space-y-4">
              {outbound.segments.map((segment: any, idx: number) => {
                const segmentAircraftInfo = getAircraftInfo(segment.aircraft?.code);
                return (
                  <div key={idx} className="border-l-2 border-primary pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium">
                          {getAirlineName(segment.carrierCode)} {segment.number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {segmentAircraftInfo.name} • {segmentAircraftInfo.category}
                        </p>
                      </div>
                      <Badge variant="outline">{formatDuration(segment.duration)}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <p className="font-medium">{formatTime(segment.departure.at)}</p>
                        <p className="text-muted-foreground">{segment.departure.iataCode}</p>
                      </div>
                      <div className="text-muted-foreground">→</div>
                      <div>
                        <p className="font-medium">{formatTime(segment.arrival.at)}</p>
                        <p className="text-muted-foreground">{segment.arrival.iataCode}</p>
                      </div>
                    </div>

                    {/* Amenities (simulated) */}
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Wifi className="w-3 h-3" /> WiFi
                      </span>
                      <span className="flex items-center gap-1">
                        <Monitor className="w-3 h-3" /> Entertainment
                      </span>
                      <span className="flex items-center gap-1">
                        <UtensilsCrossed className="w-3 h-3" /> Meal
                      </span>
                    </div>

                    {/* Layover info */}
                    {idx < outbound.segments.length - 1 && (
                      <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                        <p className="text-muted-foreground">
                          Layover at {segment.arrival.iataCode} • 
                          Connection time: ~{Math.floor(Math.random() * 120) + 45} minutes
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="flex-1" size="lg" data-testid="button-book-flight">
              Book This Flight
            </Button>
            <Button variant="outline" size="lg" onClick={() => onOpenChange(false)} data-testid="button-close-dialog">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
