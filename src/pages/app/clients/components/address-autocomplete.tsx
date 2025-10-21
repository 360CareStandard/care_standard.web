// features/clients/components/address-autocomplete.tsx
import React from "react";
import { UseFormSetValue } from "react-hook-form";
import type { ClientFormData } from "../schemas/add-client";
import { TextField } from "@/components/shared/text-field";

type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
  address: any;
};

type Props = {
  setValue: UseFormSetValue<ClientFormData>;
  // optional: current query initial value
  defaultValue?: string;
  onSelected?: () => void;
};

export function AddressAutocomplete({
  setValue,
  defaultValue = "",
  onSelected,
}: Props) {
  const [q, setQ] = React.useState(defaultValue);
  const [items, setItems] = React.useState<Suggestion[]>([]);
  const [loading, setLoading] = React.useState(false);
  const abortRef = React.useRef<AbortController | null>(null);
  const timerRef = React.useRef<number | null>(null);

  async function fetchSuggestions(query: string, signal?: AbortSignal) {
    if (!query) return setItems([]);
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        format: "jsonv2",
        addressdetails: "1",
        limit: "5",
      });
      const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
      const res = await fetch(url, {
        headers: { "User-Agent": "CareSuite/1.0", "Accept-Language": "en" },
        signal,
      });
      if (!res.ok) return setItems([]);
      const js = await res.json();
      setItems(js || []);
    } catch (err) {
      if ((err as any)?.name === "AbortError") return;
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // debounce input
  React.useEffect(() => {
    abortRef.current?.abort();
    if (timerRef.current) window.clearTimeout(timerRef.current);

    if (!q) {
      setItems([]);
      return;
    }

    const ac = new AbortController();
    abortRef.current = ac;
    timerRef.current = window.setTimeout(
      () => void fetchSuggestions(q, ac.signal),
      300
    );
    return () => {
      window.clearTimeout(timerRef.current!);
      ac.abort();
    };
  }, [q]);

  function buildLine1FromAddress(a: any) {
    // similar to your helper
    const hn = a.house_number;
    const road = a.road || a.pedestrian || a.footway || a.path;
    if (hn && road) return `${hn} ${road}`;
    return road || a.building || a.hamlet || a.neighbourhood || undefined;
  }

  const handleSelect = (s: Suggestion) => {
    const a = s.address || {};
    // prefer your schema keys
    const addressLine1 =
      buildLine1FromAddress(a) ?? s.display_name.split(",")[0];
    const city = a.city || a.town || a.village || a.suburb || a.hamlet || "";
    const state = a.county || a.state || a.region || "";
    const postcode = a.postcode || "";
    const country = a.country || "";

    // set form values — IMPORTANT: keys must match your schema exactly
    setValue("addressLine1", addressLine1, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("city", city, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("state", state, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("county", state, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    // your schema uses "zip" so set zip - if you use "postcode" rename consistently
    setValue("zip", postcode, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("country", country, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    // vital: set latitude / longitude so map block recenters
    const lat = Number(s.lat);
    const lon = Number(s.lon);
    setValue("latitude", lat, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("longitude", lon, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    // optionally set the primary phone country code if you want:
    // if (a.country_code) {
    //   setValue("phone", (a.country_code as string).toUpperCase(), {
    //     shouldDirty: true,
    //   });
    // }

    setQ(s.display_name);
    setItems([]);
    onSelected?.();
  };

  return (
    <div className="relative">
      <TextField
        value={q}
        type="search"
        className="w-full rounded border px-3 py-2"
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search address (street, postcode, town...)"
      />
      {loading && (
        <div className="mt-1 text-xs text-muted-foreground">Searching…</div>
      )}

      {items.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-56 w-full divide divide-y shadow-2xl overflow-auto rounded border bg-white">
          {items.map((s) => (
            <li
              key={`${s.lat}-${s.lon}-${s.display_name}`}
              className="cursor-pointer px-3 py-2 hover:bg-slate-50"
              onClick={() => handleSelect(s)}
            >
              <div className="text-sm">{s.display_name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
