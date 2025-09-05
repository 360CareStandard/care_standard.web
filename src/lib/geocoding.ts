// lib/geocoding.ts
export type ReverseGeo = {
  addressLine1?: string;
  city?: string;
  state?: string; // County/State/Region
  postcode?: string;
  country?: string;
  countryCode?: string; // "GB"
};

function houseAndRoadToLine1(a: any) {
  const hn = a?.house_number;
  const rd = a?.road || a?.pedestrian || a?.footway || a?.path;
  if (hn && rd) return `${hn} ${rd}`;
  return rd || undefined;
}

export async function reverseGeocodeNominatim(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<ReverseGeo | null> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lng),
    addressdetails: "1",
  });
  const url = `https://nominatim.openstreetmap.org/reverse?${params.toString()}`;

  // Nominatim asks for an identifying UA; add Accept-Language to prefer EN
  const res = await fetch(url, {
    headers: {
      "Accept-Language": "en",
      "User-Agent": "CareSuite/1.0 (reverse-geocode)",
    },
    signal,
  });
  if (!res.ok) return null;

  const json = await res.json();
  const a = json?.address ?? {};
  const city =
    a.city || a.town || a.village || a.hamlet || a.suburb || undefined;
  const state = a.county || a.state || a.region || undefined;
  return {
    addressLine1: houseAndRoadToLine1(a),
    city,
    state,
    postcode: a.postcode || undefined,
    country: a.country || undefined,
    countryCode: a.country_code
      ? String(a.country_code).toUpperCase()
      : undefined,
  };
}

// quick OSM geocode
// export async function geocodeNominatim(query: string) {
//   const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
//   const res = await fetch(url, { headers: { "User-Agent": "CareSuite/1.0" }});
//   const js = await res.json();
//   const p = js?.[0];
//   if (!p) return null;
//   return { lat: Number(p.lat), lng: Number(p.lon) };
// }
