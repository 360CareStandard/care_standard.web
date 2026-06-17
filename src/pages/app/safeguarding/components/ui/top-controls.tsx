import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import React from "react";

type Props = {
  search: string;
  setSearch: (v: string) => void;

  status?: string;
  setStatus: (v?: string) => void;

  priority?: string;
  setPriority: (v?: string) => void;

  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

export function TopControls({
  search,
  setSearch,
  setStatus,
  setPriority,
  dateRange,
  setDateRange,
}: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 🔍 Search */}
      <SearchInput value={search} onChange={setSearch} />
      {/* 📊 Status Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            Status
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setStatus(undefined)}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatus("open")}>
            Open
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatus("closed")}>
            Closed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ⚠️ Priority Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            Priority
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setPriority(undefined)}>
            All
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPriority("high")}>
            High
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPriority("medium")}>
            Medium
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPriority("low")}>
            Low
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 📅 Date Range */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />

            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd")} -{" "}
                  {format(dateRange.to, "LLL dd")}
                </>
              ) : (
                format(dateRange.from, "LLL dd")
              )
            ) : (
              "Date Range"
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-0"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDateRange(undefined)}
          >
            Clear
          </Button>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={(range) => {
              if (!range?.from && !range?.to) {
                setDateRange(undefined);
                return;
              }

              setDateRange(range);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        onClick={() => {
          setSearch("");
          setStatus(undefined);
          setPriority(undefined);
          setDateRange(undefined); // 👈 here
        }}
      >
        Clear Filters
      </Button>
    </div>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative w-[260px]">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        placeholder="Search cases..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
