// components/shared/carer-selection.tsx
import React from "react";
import { X, Search, Check, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from "react-dom";
import { TextField } from "@/components/shared/text-field";

export interface Carer {
  id: string;
  name: string;
  email: string;
  initials: string;
  skills: string[];
}

type Variant = "preferred" | "avoid";

export interface CarerSelectionProps {
  label: string;
  description?: string;
  selectedCarers: string[]; // IDs
  availableCarers: Carer[]; // source list
  onSelectionChange: (carerIds: string[]) => void;

  placeholder?: string;
  maxSelections?: number;
  /** If provided, these IDs will be disabled in the list (e.g., avoid cannot pick preferred). */
  disabledIds?: string[];
  /** Changes tag color (green for preferred, red for avoid) */
  variant?: Variant;
  className?: string;
}

const CarerTag: React.FC<{
  carer: Carer;
  onRemove: () => void;
  variant: Variant;
}> = ({ carer, onRemove, variant }) => {
  const styles =
    variant === "preferred"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
        styles
      )}
    >
      <User size={15} />
      {carer.name}
      <button
        onClick={onRemove}
        className="hover:bg-black/10 rounded-full p-0.5"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
};

const CarerListItem: React.FC<{
  carer: Carer;
  isSelected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}> = ({ carer, isSelected, disabled, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "w-full text-left flex items-center gap-3 p-3   transition-colors",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : isSelected
          ? "bg-[#D9D9D92B] "
          : "hover:bg-gray-50 "
      )}
    >
      {/* Avatar */}
      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg  font-bold text-gray-600">
        {carer.initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900">{carer.name}</div>
        <div className="text-xs text-gray-500 truncate">{carer.email}</div>
        <div className="flex flex-wrap gap-1 mt-1">
          {carer.skills.map((s) => (
            <span
              key={s}
              className="inline-block px-2 py-0.5 bg-gray-100 text-xs text-gray-600 rounded"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Checkbox */}
      <div
        className={cn(
          "w-4 h-4 rounded border-2 flex items-center justify-center",
          isSelected ? "bg-primary border-primary" : "border-gray-300"
        )}
      >
        {isSelected && <Check className="w-3 h-3 text-white" />}
      </div>
    </button>
  );
};

export const CarerSelection: React.FC<CarerSelectionProps> = ({
  label,
  description,
  selectedCarers,
  availableCarers,
  onSelectionChange,
  placeholder = "Search for carers…",
  maxSelections,
  disabledIds = [],
  variant = "preferred",
  className,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const inputWrapRef = React.useRef<HTMLDivElement | null>(null); // the relative input container
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  // ---- floating coordinates (portal) ----
  const [coords, setCoords] = React.useState<{
    top: number;
    left: number;
    width: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
  });

  const updatePosition = React.useCallback(() => {
    const el = inputWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({ top: rect.bottom, left: rect.left, width: rect.width });
  }, []);

  React.useEffect(() => {
    if (!open) return;
    updatePosition();
    const handlers = [
      ["scroll", updatePosition, true],
      ["resize", updatePosition, false],
    ] as const;
    handlers.forEach(([evt, fn, capture]) =>
      window.addEventListener(evt, fn as any, capture as any)
    );
    return () => {
      handlers.forEach(([evt, fn, capture]) =>
        window.removeEventListener(evt, fn as any, capture as any)
      );
    };
  }, [open, updatePosition]);

  // ---- close on outside click (consider portal as "inside") ----
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideBox = boxRef.current?.contains(target);
      const insideDropdown = dropdownRef.current?.contains(target);
      if (!insideBox && !insideDropdown) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const filtered = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return availableCarers;
    return availableCarers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q))
    );
  }, [searchTerm, availableCarers]);

  const selectedObjs = React.useMemo(
    () => availableCarers.filter((c) => selectedCarers.includes(c.id)),
    [selectedCarers, availableCarers]
  );

  const toggle = (id: string) => {
    if (selectedCarers.includes(id)) {
      onSelectionChange(selectedCarers.filter((x) => x !== id));
    } else {
      if (maxSelections && selectedCarers.length >= maxSelections) return;
      onSelectionChange([...selectedCarers, id]);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          {label}
        </label>
        {description ? (
          <p className="text-xs text-gray-500">{description}</p>
        ) : null}
      </div>

      {/* Selected tags */}
      {!!selectedObjs.length && (
        <div className="flex flex-wrap gap-2">
          {selectedObjs.map((c) => (
            <CarerTag
              key={c.id}
              carer={c}
              variant={variant}
              onRemove={() =>
                onSelectionChange(selectedCarers.filter((x) => x !== c.id))
              }
            />
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative" ref={boxRef}>
        <div className="relative" ref={inputWrapRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <TextField
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
          />
        </div>

        {/* Dropdown */}
        {open &&
          createPortal(
            <div
              ref={dropdownRef}
              data-radix-scroll-lock-allow
              style={{
                position: "fixed", // 👈 fixed, not absolute
                top: coords.top,
                left: coords.left,
                width: coords.width,
              }}
              className="z-[9999] bg-white border border-gray-200 rounded-lg shadow-xl
                 max-h-64 overflow-y-auto overscroll-contain
                 pointer-events-auto"
              // optional: be extra safe
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {filtered.length ? (
                <div className="py-2">
                  {filtered.map((c) => {
                    const isSelected = selectedCarers.includes(c.id);
                    const isDisabled = disabledIds.includes(c.id);
                    return (
                      <CarerListItem
                        key={c.id}
                        carer={c}
                        isSelected={isSelected}
                        disabled={isDisabled}
                        onToggle={() => !isDisabled && toggle(c.id)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No carers found
                </div>
              )}
            </div>,
            document.body
          )}
      </div>

      {/* Small helper / max note */}
      {maxSelections ? (
        <p className="text-[11px] text-muted-foreground">
          {selectedCarers.length}/{maxSelections} selected
        </p>
      ) : null}
    </div>
  );
};
