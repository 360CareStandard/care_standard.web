import { useMemo, useState } from "react";
import { useShiftRosterList } from "@/hooks/roster/useShiftRoster";
import { ShiftRosterBoard } from "./components/shift-roster-board";
import { toCarerRows, toClientRows } from "./utils/roster-mappers";
import { addDays, formatPretty, toYMD } from "./utils/date-utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, ChevronLeft } from "lucide-react";
import SinglePageLoader from "@/components/loading/single-page-loader";

const ShiftRoaster = () => {
    const [mode, setMode] = useState<"carer" | "client">("carer");
    const [date, setDate] = useState<Date>(new Date());

    const [dateOpen, setDateOpen] = useState(false);

    const dateYMD = useMemo(() => toYMD(date), [date]);

    const params = useMemo(
        () => ({ view: "daily", date: dateYMD }),
        [dateYMD]
    );

    const { data, isLoading, error } = useShiftRosterList(params);

    const rows = useMemo(() => {
        if (!data) return [];
        return mode === "carer" ? toCarerRows(data.roster) : toClientRows(data);
    }, [data, mode]);

    const goToday = () => setDate(new Date());
    const goPrev = () => setDate((d) => addDays(d, -1));
    const goNext = () => setDate((d) => addDays(d, 1));

    if (error) return <div className="p-6 text-red-600">Failed to load roster</div>;

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={goToday}>
                        Today
                    </Button>

                    <Button variant="outline" size="icon" onClick={goPrev} aria-label="Previous day">
                        <ChevronLeft strokeWidth={3} />
                    </Button>

                    <Button variant="outline" size="icon" onClick={goNext} aria-label="Next day">
                        <ChevronLeft strokeWidth={3} className="rotate-180" />
                    </Button>
                </div>

                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="gap-2">
                            <span className="text-sm font-medium text-green-800">
                                {formatPretty(date)}
                            </span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent align="center" className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => {
                                if (!d) return;
                                setDate(d);
                                setDateOpen(false); // ✅ closes on select
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>


                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            {mode === "carer" ? "Carer view" : "Client view"}
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem
                            onClick={() => setMode("carer")}
                            className="flex items-center justify-between"
                        >
                            Carer view
                            {mode === "carer" && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => setMode("client")}
                            className="flex items-center justify-between"
                        >
                            Client view
                            {mode === "client" && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isLoading ? (
                <SinglePageLoader text=" shift roster..." />
            ) : (
                <ShiftRosterBoard rows={rows} height={650} />
            )}
        </div>
    );
};

export default ShiftRoaster;
