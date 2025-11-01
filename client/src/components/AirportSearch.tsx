import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Airport {
  id: string;
  type: string;
  subType: string;
  name: string;
  iataCode: string;
  address: {
    cityName?: string;
    countryName?: string;
  };
}

interface AirportSearchProps {
  value: string;
  displayValue?: string;
  onSelect: (iataCode: string, displayName: string) => void;
  placeholder?: string;
  testId?: string;
}

export function AirportSearch({ value, displayValue = "", onSelect, placeholder = "Search airports or cities...", testId }: AirportSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [airports, setAirports] = useState<Airport[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync display with parent's displayValue prop
  useEffect(() => {
    if (!value && !displayValue) {
      // Reset search query when parent clears the selection
      setSearchQuery("");
    }
  }, [value, displayValue]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/airports/search?keyword=${encodeURIComponent(searchQuery)}`);
          const data = await response.json();
          setAirports(data.data || []);
        } catch (error) {
          console.error("Airport search error:", error);
          setAirports([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setAirports([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSelect = (airport: Airport) => {
    const displayName = `${airport.address.cityName || airport.name} (${airport.iataCode})`;
    onSelect(airport.iataCode, displayName);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          data-testid={testId}
        >
          <div className="flex items-center gap-2 flex-1 text-left">
            <Plane className="h-4 w-4 shrink-0 opacity-50" />
            <span className={cn("flex-1 truncate", !displayValue && "text-muted-foreground")}>
              {displayValue || placeholder}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type city or airport name..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Searching..." : searchQuery.length < 2 ? "Type at least 2 characters" : "No airports found"}
            </CommandEmpty>
            {airports.length > 0 && (
              <CommandGroup heading="Airports">
                {airports.map((airport) => (
                  <CommandItem
                    key={airport.id}
                    value={airport.iataCode}
                    onSelect={() => handleSelect(airport)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === airport.iataCode ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <div className="font-medium">
                        {airport.address.cityName || airport.name} ({airport.iataCode})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {airport.name}
                        {airport.address.countryName && `, ${airport.address.countryName}`}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
