// src/components/clients/addresses.tsx
import { Card, CardContent } from "@/components/ui/card";
import { InfoRow } from "../components/info-row";
import { Button } from "@/components/ui/button";
import { MapIcon, MapPin, MapPinnedIcon, NotebookText } from "lucide-react";
import { EditIcon } from "@/assets/icons";
import { Client } from "@/types/client/client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// optionally fix default icon (webpack/CRA issue)
// delete (L.Icon.Default as any).prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

interface Props {
  personal: Client | undefined;
  isLoading?: boolean;
  openSheet: () => void;
}

export default function Addresses({
  personal,
  isLoading = false,
  openSheet,
}: Props) {
  const lat = personal?.latitude ? Number(personal.latitude) : null;
  const lng = personal?.longitude ? Number(personal.longitude) : null;
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

  // const mapUrl = hasCoords
  //   ? // OpenStreetMap embed with marker (useleaflet's marker param via query)
  //     `https://www.openstreetmap.org/export/embed.html?bbox=${lng! - 0.01}%2C${
  //       lat! - 0.01
  //     }%2C${lng! + 0.01}%2C${lat! + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`
  //   : "";

  const openInGoogle = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
    : null;

  return (
    <Card className="shadow-none">
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-16">
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-xl"> Address</h2>
          <p className=" text-sm text-muted-foreground">
            Client's primary address and additional ones
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              disabled={isLoading}
              onClick={openSheet}
            >
              <EditIcon />
              Update
            </Button>
          </div>
        </div>

        <Card className="shadow-none">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ) : (
              <>
                <InfoRow label="Address" icon={<MapPin size={17.65} />}>
                  {[
                    personal?.addressLine1,
                    personal?.addressLine2,
                    personal?.city,
                    personal?.county,
                    personal?.zip,
                    personal?.country,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </InfoRow>

                <InfoRow
                  label="Secure Check in (Location within)"
                  icon={<MapPinnedIcon size={17.65} />}
                >
                  {personal?.secureCheckInZone
                    ? `${personal.secureCheckInZone}m`
                    : "—"}
                </InfoRow>

                <InfoRow
                  label="Access Details"
                  icon={<NotebookText size={17.65} />}
                >
                  {personal?.accessDetails ?? "—"}
                </InfoRow>

                <InfoRow label="Map" icon={<MapIcon size={17.65} />}>
                  {hasCoords ? (
                    // Dialog trigger
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          className="underline underline-offset-4 h-0 !p-0"
                        >
                          Show map
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl gap-0 w-[90vw] p-0 overflow-hidden">
                        <DialogTitle className="hidden">Location</DialogTitle>
                        <div className="flex items-center gap-2 border-b p-3">
                          <div className="text-sm font-semibold">
                            Client Location
                          </div>
                          <div className="flex items-center gap-2">
                            {openInGoogle && (
                              <a
                                href={openInGoogle}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm underline"
                              >
                                Open in Google Maps
                              </a>
                            )}
                          </div>
                        </div>
                        {/* <div style={{ height: "60vh", width: "100%" }}>
                          
                          <iframe
                            title="Client location"
                            src={mapUrl}
                            style={{ border: 0, width: "100%", height: "100%" }}
                            loading="lazy"
                          />
                        </div> */}

                        <MapContainer
                          center={[lat!, lng!]}
                          zoom={15}
                          style={{ height: "60vh", width: "100%" }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={[lat!, lng!]}>
                            <Popup>
                              {personal?.addressLine1 ?? "Client location"}
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <span className="text-muted-foreground">
                      No coordinates available
                    </span>
                  )}
                </InfoRow>
              </>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
