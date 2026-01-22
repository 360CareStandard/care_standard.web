import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useFormContext } from "react-hook-form";
import L from "leaflet";
import { StaffWorkForm } from "@/pages/app/staff/schemas/work";
import React from "react";

const DefaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView([lat, lng], 16);
  }, [lat, lng, map]);
  return null;
}

export function StaffAddressMapBlock() {
  const { watch, setValue } = useFormContext<StaffWorkForm>();

  const lat = watch("latitude") ?? 51.5074;
  const lng = watch("longitude") ?? -0.1278;

  return (
    <div className="h-64 w-full overflow-hidden rounded-md border">
      <MapContainer center={[lat, lng]} zoom={16} className="h-full w-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <Recenter lat={lat} lng={lng} />

        <Marker
          position={[lat, lng]}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const p = (e.target as L.Marker).getLatLng();

              setValue("latitude", p.lat, { shouldDirty: true });
              setValue("longitude", p.lng, { shouldDirty: true });

              // keep backend map in sync
              setValue(
                "map",
                `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}#map=18/${p.lat}/${p.lng}`,
                { shouldDirty: true },
              );
            },
          }}
        />
      </MapContainer>
    </div>
  );
}
