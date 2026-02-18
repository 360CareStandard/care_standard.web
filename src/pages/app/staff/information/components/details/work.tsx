import { Card, CardContent } from "@/components/ui/card";

import { Global, Map, Money2 } from "iconsax-react";
import { workDetails } from "@/types/staff/work";
import { InfoRow } from "@/pages/app/clients/client/components/info-row";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface Props {
  data: workDetails;
  open: boolean;
}

export const StaffWorkDetails = ({ data, open }: Props) => {
  const lat = data.latitude ? Number(data.latitude) : 51.5074;
  const lng = data.longitude ? Number(data.longitude) : -0.1278;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Map size={18} color="#025134" />

              <h3 className="font-semibold text-lg">Location & Transport</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4 items-baseline">
            <div>
              <InfoRow label="Address">{data.address || "-"}</InfoRow>
              <InfoRow label="Transport Mode">
                {data.modeOfTransport || "-"}
              </InfoRow>
            </div>
            {!open && (
              <InfoRow label="Map">
                <div
                  className="flex items-center gap-2   overflow-hidden"
                  style={{ height: "140px", width: "400px" }}
                >
                  <MapContainer
                    center={[lat!, lng!]}
                    zoom={15}
                    style={{ height: "140px", width: "400px" }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[lat!, lng!]}>
                      <Popup>{data?.address ?? "Staff location"}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </InfoRow>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Grid - Consent & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consent & Data Sharing */}
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Money2 size={18} color="#025134" />

                <h3 className="font-semibold text-lg">Pay & Rate</h3>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow label="Rate Card">{data.rateCard || "-"}</InfoRow>
              <InfoRow label="Travel rate card">
                {data.travelRateCard || "-"}
              </InfoRow>
              <InfoRow label="Notes">{data.note || "-"}</InfoRow>
            </div>
          </CardContent>
        </Card>

        {/* Documents & Review */}
        <Card>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Global size={18} color="#025134" />

                <h3 className="font-semibold text-lg">
                  Communication Preferences
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <InfoRow label="Preffered method of contact">
                <div className="grid gap-2">
                  {data.isPhone && (
                    <Badge className="rounded-full text-black bg-gray-200">
                      Phone
                    </Badge>
                  )}
                  {data.isEmail && (
                    <Badge className="rounded-full text-black bg-gray-200">
                      Email
                    </Badge>
                  )}
                  {data.isText && (
                    <Badge className="rounded-full text-black bg-gray-200">
                      Text
                    </Badge>
                  )}
                  {data.isApp && (
                    <Badge className="rounded-full text-black bg-gray-200">
                      App
                    </Badge>
                  )}
                </div>
              </InfoRow>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
