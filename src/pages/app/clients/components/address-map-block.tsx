// features/clients/components/address-map-block.tsx
"use client";

import * as React from "react";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ClientFormData } from "../schemas/add-client";

import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { Info } from "lucide-react";
import { reverseGeocodeNominatim } from "@/lib/geocoding";

const MIN = 50;
const MAX = 500;
const clamp = (n: number, lo = MIN, hi = MAX) =>
  Math.min(hi, Math.max(lo, Math.round(n))); // round to whole meters

// simple default marker fix (Leaflet needs image URLs)
const DefaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type Props = {
  control: Control<ClientFormData>;
  watch: UseFormWatch<ClientFormData>;
  setValue: UseFormSetValue<ClientFormData>;
  errors?: Partial<Record<keyof ClientFormData, any>>;
  className?: string;
};

function FitOnLatLngChange({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView([lat, lng], Math.max(map.getZoom(), 15), { animate: true });
  }, [lat, lng, map]);
  return null;
}

export function AddressMapBlock({ watch, setValue, errors, className }: Props) {
  const lat = watch("lat") ?? 51.5074;
  const lng = watch("lng") ?? -0.1278;
  const radius = watch("checkinRadiusM") ?? 200;
  const [geoLoading, setGeoLoading] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const setRadius = (n: number) =>
    setValue("checkinRadiusM", clamp(n), {
      shouldDirty: true,
      shouldTouch: true,
    });
  const setLatLng = (newLat: number, newLng: number, doReverse = true) => {
    setValue("lat", Number(newLat), { shouldDirty: true, shouldTouch: true });
    setValue("lng", Number(newLng), { shouldDirty: true, shouldTouch: true });
    if (doReverse) void reverseFill(newLat, newLng);
  };

  const reverseFill = async (la: number, ln: number) => {
    try {
      // cancel any in-flight reverse-geo
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setGeoLoading(true);
      const result = await reverseGeocodeNominatim(la, ln, ac.signal);
      if (!result) return;

      // Write what we have—only overwrite if empty or different
      if (result.addressLine1)
        setValue("addressLine1", result.addressLine1, { shouldDirty: true });
      if (result.city) setValue("city", result.city, { shouldDirty: true });
      if (result.state) setValue("state", result.state, { shouldDirty: true });
      if (result.postcode)
        setValue("postcode", result.postcode, { shouldDirty: true });

      // If you have a "country" field, set it. If not, omit this.
      setValue("primaryPhoneCountry" as any, result.country ?? "", {
        shouldDirty: true,
      });
    } finally {
      setGeoLoading(false);
    }
  };

  const setMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLatLng(pos.coords.latitude, pos.coords.longitude, true),
      () => {}
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Use map</Label>

          <Button
            size="sm"
            variant="secondary"
            onClick={setMyLocation}
            disabled={geoLoading}
            className="text-xs"
          >
            {geoLoading ? "Fetching…" : "Set to my location"}
          </Button>
        </div>

        <div className="relative h-64 w-full overflow-hidden rounded-md border">
          <MapContainer
            center={[lat, lng]}
            zoom={16}
            className="h-full w-full"
            scrollWheelZoom
          >
            {/* Free OSM tiles (be nice; for heavier use, get a MapTiler/Thunderforest key) */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors'
            />

            <FitOnLatLngChange lat={lat} lng={lng} />

            <Marker
              position={[lat, lng]}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const m = e.target as L.Marker;
                  const p = m.getLatLng();
                  setLatLng(p.lat, p.lng);
                },
              }}
            />

            <Circle
              center={[lat, lng]}
              radius={radius}
              pathOptions={{
                color: "#0ea5e9",
                fillColor: "#0ea5e9",
                fillOpacity: 0.15,
              }}
            />
          </MapContainer>
        </div>

        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
          <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted">
            <Info className="h-3 w-3 text-muted-foreground" />
          </span>
          If this isn’t the correct location, drag the location icon to the
          correct position.
        </p>
      </div>

      {/* --- Secure check-in zone (styled like your mock) --- */}
      <div className="space-y-3">
        {/* Title + inline helper note with tiny icon */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Label className="font-normal">Secure check-in zone</Label>
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted">
              <Info className="h-3 w-3 text-muted-foreground" />
            </span>
          </div>
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-[2px] inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border border-border">
              <span className="h-[6px] w-[6px] rounded-full bg-muted-foreground/70" />
            </span>
            If this isn’t the correct location, drag the location icon to the
            correct position.
          </p>
        </div>

        <div className="grid grid-cols-12 items-center gap-3">
          {/* left min label */}
          <div className="text-xs text-muted-foreground">{MIN}</div>

          {/* slider */}
          <div className="col-span-7">
            <div className="relative w-full flex flex-col items-center">
              <SliderPrimitive.Root
                value={[clamp(Number(radius))]} // ✅ force in-rail
                min={MIN}
                max={MAX}
                step={10}
                onValueChange={(v) => setRadius(Number(v[0] ?? MIN))}
                className="relative flex w-full touch-none select-none items-center"
                aria-label="Check-in radius"
              >
                <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
                  <SliderPrimitive.Range className="absolute h-full bg-primary" />
                </SliderPrimitive.Track>

                <SliderPrimitive.Thumb className="relative block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  {/* Sticky badge above the thumb */}
                  <Badge
                    className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full
                     px-1.5 py-0.5 text-[10px] font-medium"
                    variant="secondary"
                  >
                    {clamp(Number(radius))}
                    <span className="ml-0.5">m</span>

                    {/* tiny arrow */}
                    <span
                      className="absolute left-1/2 top-full -translate-x-1/2
                           border-x-[6px] border-t-[6px] border-x-transparent border-t-muted"
                    />
                  </Badge>
                </SliderPrimitive.Thumb>
              </SliderPrimitive.Root>
            </div>
          </div>

          {/* right max label */}
          <div className="text-right text-xs text-muted-foreground">{MAX}</div>

          {/* numeric input + unit */}
          <div className="col-span-3 flex items-center gap-2">
            <Input
              className="h-9 w-[110px]"
              type="number" // ✅ real number input
              inputMode="numeric"
              pattern="[0-9]*"
              min={MIN}
              max={MAX} // ✅ same rail
              step={10}
              value={clamp(Number(radius))}
              onChange={(e) => setRadius(Number(e.target.value || MIN))}
              onBlur={(e) => setRadius(Number(e.target.value || MIN))} // ✅ snap inside on blur
            />
            <span className="text-xs text-muted-foreground">meters</span>
          </div>
        </div>
        {errors?.checkinRadiusM && (
          <p className="text-xs text-destructive">
            {errors.checkinRadiusM.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
