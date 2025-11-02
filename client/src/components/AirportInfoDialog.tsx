import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  ExternalLink,
  Building,
  Wifi,
  ShoppingBag,
  UtensilsCrossed,
  Info
} from "lucide-react";
import { getAirportInfo, type AirportInfo } from "@/lib/airlineData";

interface AirportInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  airportCode: string;
}

export function AirportInfoDialog({ open, onOpenChange, airportCode }: AirportInfoDialogProps) {
  const airportInfo = getAirportInfo(airportCode);

  if (!airportInfo) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent data-testid="dialog-airport-info">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Airport Information
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <Info className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Detailed information for {airportCode} is not available at the moment.
            </p>
            <Button className="mt-4" variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" data-testid="dialog-airport-info">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Airport Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Airport Header */}
          <div>
            <h3 className="text-2xl font-bold">{airportInfo.name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{airportInfo.code}</Badge>
              <span className="text-sm text-muted-foreground">
                {airportInfo.city}, {airportInfo.country}
              </span>
            </div>
          </div>

          {/* Quick Info */}
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              {airportInfo.terminals && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    Terminals
                  </p>
                  <p className="font-medium">{airportInfo.terminals}</p>
                </div>
              )}
              {airportInfo.website && (
                <div>
                  <p className="text-sm text-muted-foreground">Official Website</p>
                  <a
                    href={airportInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 text-sm"
                    data-testid="link-airport-website"
                  >
                    Visit Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </Card>

          {/* Facilities */}
          {airportInfo.facilities && airportInfo.facilities.length > 0 && (
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Facilities & Services
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {airportInfo.facilities.map((facility, idx) => {
                  // Icon mapping
                  let Icon = Info;
                  if (facility.toLowerCase().includes("wifi")) Icon = Wifi;
                  else if (facility.toLowerCase().includes("shop")) Icon = ShoppingBag;
                  else if (facility.toLowerCase().includes("restaurant") || facility.toLowerCase().includes("food")) 
                    Icon = UtensilsCrossed;
                  else if (facility.toLowerCase().includes("lounge")) Icon = Building;

                  return (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span>{facility}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Terminal Map Notice */}
          <Card className="p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">
              <Info className="w-4 h-4 inline mr-2" />
              For detailed terminal maps and real-time flight information, please visit the official airport website.
            </p>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            {airportInfo.website && (
              <Button 
                className="flex-1" 
                onClick={() => window.open(airportInfo.website, "_blank")}
                data-testid="button-visit-website"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Airport Website
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-close-dialog">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
