import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Types for our form data
interface TimeValue {
  time: string;
  period: "AM" | "PM";
}

// Custom Time Picker Component
interface TimePickerProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  label: string;
  error?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  label,
  error,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.time);

  const handleTimeEdit = () => {
    setIsEditing(true);
    setTempValue(value.time);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow only digits and colon
    const filtered = inputValue.replace(/[^\d:]/g, "");

    // Format as HH:MM
    let formatted = filtered;
    if (filtered.length >= 3 && !filtered.includes(":")) {
      formatted = filtered.slice(0, 2) + ":" + filtered.slice(2);
    }

    // Limit to HH:MM format
    if (formatted.length <= 5) {
      setTempValue(formatted);
    }
  };

  const handleTimeBlur = () => {
    setIsEditing(false);

    // Validate and format the time
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (timeRegex.test(tempValue)) {
      const [hours, minutes] = tempValue.split(":");
      const formattedTime = `${hours.padStart(2, "0")}:${minutes}`;
      onChange({ ...value, time: formattedTime });
    } else {
      // Reset to previous valid value if invalid
      setTempValue(value.time);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTimeBlur();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setTempValue(value.time);
    }
  };

  // Format display time (convert 24hr to 12hr if needed)
  const formatDisplayTime = (time: string) => {
    if (!time) return "00:00";
    const [hours, minutes] = time.split(":");
    const hour24 = parseInt(hours);
    let hour12 = hour24 > 12 ? hour24 - 12 : hour24;
    if (hour12 === 0) hour12 = 12;
    return `${hour12.toString().padStart(2, "0")}:${minutes}`;
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-3">
        {/* Manual Time Input */}
        <div className="relative">
          {isEditing ? (
            <Input
              type="text"
              value={tempValue}
              onChange={handleTimeChange}
              onBlur={handleTimeBlur}
              onKeyDown={handleKeyPress}
              placeholder="HH:MM"
              autoFocus
              className={`
             w-20  bg-white border-0 
                outline-none text-center
                ${error ? "border-red-500 text-red-600" : "text-gray-900"}
              `}
            />
          ) : (
            <button
              onClick={handleTimeEdit}
              className={`
                py-2 px-4 bg-border/50 border-0 outline-none
                 cursor-pointer rounded-md 
                ${error ? "text-red-600" : "text-gray-900"}
              `}
            >
              {formatDisplayTime(value.time)}
            </button>
          )}
        </div>

        {/* AM/PM Toggle */}
        <ToggleGroup
          type="single"
          variant="outline"
          value={value.period}
          // prevent clearing to empty; keep last period if user clicks the same item
          onValueChange={(v) => {
            if (!v) return; // make it non-clearable
            onChange({ ...value, period: v as "AM" | "PM" });
          }}
        >
          <ToggleGroupItem value="AM">AM</ToggleGroupItem>
          <ToggleGroupItem value="PM">PM</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {isEditing && (
        <p className="text-xs text-gray-500 mt-1">
          Enter time as HH:MM (e.g., 09:30).
        </p>
      )}
    </div>
  );
};
