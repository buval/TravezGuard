import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MobileNav } from "@/components/MobileNav";
import { AirportSearch } from "@/components/AirportSearch";
import { FlightDetailsDialog } from "@/components/FlightDetailsDialog";
import { AirportInfoDialog } from "@/components/AirportInfoDialog";
import { FlightBookingDialog } from "@/components/FlightBookingDialog";
import { Plane, Search, Clock, Info, ArrowRight, Briefcase, ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { getAirlineName, getAircraftInfo, getBaggageInfo } from "@/lib/airlineData";
import type { FlightOffer } from "@shared/schema";
import logoUrl from "@assets/logo_1761679001485.png";

export default function Flights() {
  const [originCode, setOriginCode] = useState("");
  const [originDisplay, setOriginDisplay] = useState("");
  const [destinationCode, setDestinationCode] = useState("");
  const [destinationDisplay, setDestinationDisplay] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState("1");
  const [searchParams, setSearchParams] = useState<any>(null);
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  const [flightDetailsOpen, setFlightDetailsOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [flightToBook, setFlightToBook] = useState<FlightOffer | null>(null);
  const [airportInfoCode, setAirportInfoCode] = useState("");
  const [airportInfoOpen, setAirportInfoOpen] = useState(false);

  const { data: flightResults, isLoading, error } = useQuery<{ data: FlightOffer[] }>({
    queryKey: [searchParams],
    enabled: !!searchParams,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!originCode || !destinationCode || !departureDate || !adults) {
      return;
    }

    const params = new URLSearchParams({
      origin: originCode,
      destination: destinationCode,
      departureDate,
      adults,
    });

    if (returnDate) {
      params.append("returnDate", returnDate);
    }

    // Set the full URL with query params for TanStack Query
    setSearchParams(`/api/flights/search?${params.toString()}`);
  };

  const formatDuration = (duration: string) => {
    // Convert PT2H30M to "2h 30m"
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return duration;
    
    const hours = match[1] ? match[1].replace("H", "h ") : "";
    const minutes = match[2] ? match[2].replace("M", "m") : "";
    return (hours + minutes).trim();
  };

  const formatTime = (dateTime: string) => {
    return format(new Date(dateTime), "HH:mm");
  };

  const formatDate = (dateTime: string) => {
    return format(new Date(dateTime), "MMM dd");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center max-w-7xl">
          <div className="flex-1"></div>
          <img src={logoUrl} alt="Travez" className="h-8" data-testid="img-logo" />
          <div className="flex-1"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Search Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>From</Label>
                  <AirportSearch
                    value={originCode}
                    displayValue={originDisplay}
                    onSelect={(code, display) => {
                      setOriginCode(code);
                      setOriginDisplay(display);
                    }}
                    placeholder="Search city or airport..."
                    testId="input-flight-origin"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Search by city or airport name
                  </p>
                </div>

                <div>
                  <Label>To</Label>
                  <AirportSearch
                    value={destinationCode}
                    displayValue={destinationDisplay}
                    onSelect={(code, display) => {
                      setDestinationCode(code);
                      setDestinationDisplay(display);
                    }}
                    placeholder="Search city or airport..."
                    testId="input-flight-destination"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Search by city or airport name
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="departureDate">Departure Date</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    data-testid="input-departure-date"
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>

                <div>
                  <Label htmlFor="returnDate">Return Date (Optional)</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    data-testid="input-return-date"
                    min={departureDate || format(new Date(), "yyyy-MM-dd")}
                  />
                </div>

                <div>
                  <Label htmlFor="adults">Passengers</Label>
                  <Input
                    id="adults"
                    type="number"
                    min="1"
                    max="9"
                    value={adults}
                    onChange={(e) => setAdults(e.target.value)}
                    data-testid="input-passengers"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2"
                data-testid="button-search-flights"
              >
                <Search className="w-4 h-4" />
                Search Flights
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <p className="text-destructive font-medium">Failed to search flights</p>
              <p className="text-sm text-muted-foreground mt-2">
                Please check your airport codes and try again
              </p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {flightResults && flightResults.data && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {flightResults.data.length} flights found
              </h2>
            </div>

            {flightResults.data.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No flights found for your search
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try different dates or destinations
                  </p>
                </CardContent>
              </Card>
            ) : (
              flightResults.data.map((offer: FlightOffer) => {
                const outbound = offer.itineraries[0];
                const firstSegment = outbound.segments[0];
                const lastSegment = outbound.segments[outbound.segments.length - 1];
                const airlineCode = offer.validatingAirlineCodes[0];
                const airlineName = getAirlineName(airlineCode);
                const aircraftInfo = getAircraftInfo(firstSegment.aircraft?.code);
                const baggageInfo = getBaggageInfo(airlineCode);

                return (
                  <Card 
                    key={offer.id} 
                    className="hover-elevate"
                    data-testid={`card-flight-${offer.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4">
                        {/* Airline and Aircraft Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Plane className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-semibold">{airlineName}</p>
                              <p className="text-xs text-muted-foreground">
                                {aircraftInfo.name} • {aircraftInfo.category}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {baggageInfo.checked.included > 0 && (
                              <Badge variant="secondary" className="gap-1">
                                <Briefcase className="w-3 h-3" />
                                {baggageInfo.checked.included} bag{baggageInfo.checked.included > 1 ? "s" : ""}
                              </Badge>
                            )}
                            {baggageInfo.carryOn.included && (
                              <Badge variant="secondary" className="gap-1">
                                <ShoppingBag className="w-3 h-3" />
                                Carry-on
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          {/* Flight Times */}
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold">
                                  {formatTime(firstSegment.departure.at)}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-sm text-muted-foreground p-0 h-auto hover:text-primary"
                                  onClick={() => {
                                    setAirportInfoCode(firstSegment.departure.iataCode);
                                    setAirportInfoOpen(true);
                                  }}
                                  data-testid={`button-airport-info-${firstSegment.departure.iataCode}`}
                                >
                                  {firstSegment.departure.iataCode}
                                  <Info className="w-3 h-3 ml-1" />
                                </Button>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(firstSegment.departure.at)}
                                </div>
                              </div>

                              <div className="flex-1 text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  <div className="h-px bg-border flex-1" />
                                  <Plane className="w-4 h-4 text-muted-foreground" />
                                  <div className="h-px bg-border flex-1" />
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDuration(outbound.duration)}
                                </div>
                                {outbound.segments.length > 1 && (
                                  <div className="text-xs text-amber-600 mt-1">
                                    {outbound.segments.length - 1} stop{outbound.segments.length > 2 ? "s" : ""}
                                  </div>
                                )}
                              </div>

                              <div className="text-center">
                                <div className="text-2xl font-bold">
                                  {formatTime(lastSegment.arrival.at)}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-sm text-muted-foreground p-0 h-auto hover:text-primary"
                                  onClick={() => {
                                    setAirportInfoCode(lastSegment.arrival.iataCode);
                                    setAirportInfoOpen(true);
                                  }}
                                  data-testid={`button-airport-info-${lastSegment.arrival.iataCode}`}
                                >
                                  {lastSegment.arrival.iataCode}
                                  <Info className="w-3 h-3 ml-1" />
                                </Button>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(lastSegment.arrival.at)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price and Action */}
                          <div className="text-right md:text-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6">
                            <div className="text-3xl font-bold text-primary">
                              ${offer.price.total}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {offer.price.currency}
                            </div>
                            <Button 
                              size="sm" 
                              className="gap-2 w-full md:w-auto"
                              onClick={() => {
                                setSelectedFlight(offer);
                                setFlightDetailsOpen(true);
                              }}
                              data-testid={`button-select-flight-${offer.id}`}
                            >
                              View Details
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Helper Text */}
        {!searchParams && (
          <Card className="bg-muted/30">
            <CardContent className="p-6 text-center">
              <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Search for Flights</h3>
              <p className="text-sm text-muted-foreground">
                Enter airport codes (e.g., JFK for New York, LAX for Los Angeles) and travel dates to find the best flight deals
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <MobileNav />

      {/* Flight Details Dialog */}
      <FlightDetailsDialog
        open={flightDetailsOpen}
        onOpenChange={setFlightDetailsOpen}
        flight={selectedFlight}
        onBookFlight={(flight) => {
          setFlightToBook(flight);
          setBookingDialogOpen(true);
        }}
      />

      {/* Airport Info Dialog */}
      <AirportInfoDialog
        open={airportInfoOpen}
        onOpenChange={setAirportInfoOpen}
        airportCode={airportInfoCode}
      />

      {/* Flight Booking Dialog */}
      <FlightBookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        flight={flightToBook}
      />
    </div>
  );
}
