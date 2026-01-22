// features/clients/components/address-autocomplete.tsx
import React from "react";
import { TextField } from "@/components/shared/text-field";
import { StaffWorkForm } from "../../schemas/work";
import { useController, UseFormSetValue, Control } from "react-hook-form";

type Props = {
  control: Control<StaffWorkForm>;
  setValue: UseFormSetValue<StaffWorkForm>;
  name?: "address";
  onSelected?: () => void;
};
type Suggestion = {
  display_name: string;
  lat: string;
  lon: string;
  address: any;
};

export function AddressAutocomplete({
  control,
  setValue,
  name = "address",
  onSelected,
}: Props) {
  const {
    field: { value, onChange },
  } = useController({
    control,
    name,
    rules: { required: true },
  });
  const isUserTypingRef = React.useRef(false);

  const query = value || "";
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

  React.useEffect(() => {
    if (!query || !isUserTypingRef.current) {
      setItems([]);
      return;
    }

    abortRef.current?.abort();
    if (timerRef.current) clearTimeout(timerRef.current);

    const ac = new AbortController();
    abortRef.current = ac;

    timerRef.current = window.setTimeout(
      () => fetchSuggestions(query, ac.signal),
      300,
    );

    return () => {
      clearTimeout(timerRef.current!);
      ac.abort();
    };
  }, [query]);

  const handleSelect = (s: Suggestion) => {
    const fullAddress = s.display_name;
    const lat = Number(s.lat);
    const lng = Number(s.lon);
    onChange(fullAddress); // 👈 THIS is critical

    setValue("latitude", lat, { shouldDirty: true, shouldValidate: true });
    setValue("longitude", lng, { shouldDirty: true, shouldValidate: true });
    setValue(
      "map",
      `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`,
      { shouldDirty: true },
    );
    isUserTypingRef.current = false;

    setItems([]);
    onSelected?.();
  };

  return (
    <div className="relative">
      <TextField
        value={query}
        type="search"
        onChange={(e) => {
          isUserTypingRef.current = true;
          onChange(e.target.value);
        }}
        onBlur={() => setItems([])}
        placeholder="Search address (street, postcode, town...)"
      />

      {loading && (
        <div className="mt-1 text-xs text-muted-foreground">Searching…</div>
      )}

      {items.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-56 w-full divide divide-y shadow-2xl overflow-auto rounded border bg-white">
          {items.map((s, i) => (
            <li
              key={`${i}-${s.display_name}`}
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
