import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SinglePageLoader from "@/components/loading/single-page-loader";
import { useShiftRosterList } from "@/hooks/roster/useShiftRoster";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, ChevronLeft } from "lucide-react";

import { ShiftRosterBoard } from "./components/shift-roster-board";
import { addDays, formatPretty, fromYMD, toYMD } from "./utils/date-utils";
import { toCarerRows, toClientRows } from "./utils/roster-mappers";
import { ErrorStateCard } from "../staff/components/error-state";

const ShiftRoaster = () => {
    const [mode, setMode] = useState<"carer" | "client">("carer");
    const [dateYMD, setDateYMD] = useState<string>(() => toYMD(new Date()));
    const [dateOpen, setDateOpen] = useState(false);

    const date = useMemo(() => fromYMD(dateYMD), [dateYMD]);
    const params = useMemo(() => ({ view: "daily", date: dateYMD }), [dateYMD]);

    const { data, isLoading, isFetching, error, refetch } = useShiftRosterList(params);

    const rows = useMemo(() => {
        if (!data) return [];
        return mode === "carer"
            ? toCarerRows(data.roster, dateYMD)
            : toClientRows(data, dateYMD);
    }, [data, dateYMD, mode]);

    const goToday = () => setDateYMD(toYMD(new Date()));
    const goPrev = () => setDateYMD((value) => toYMD(addDays(fromYMD(value), -1)));
    const goNext = () => setDateYMD((value) => toYMD(addDays(fromYMD(value), 1)));

    if (error) return <div className="flex mt-52 justify-center items-center">
        <ErrorStateCard
            className="shadow-none !border-0 !bg-transparent"
            title="Unable to load shift roster"
            onClick={() => refetch()}
            size="lg"
        />
    </div>;

    return (
        <div className="space-y-4 p-6">
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
                            <span className="text-sm font-medium text-green-800">{formatPretty(date)}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent align="center" className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(d) => {
                                if (!d) return;
                                setDateYMD(toYMD(d));
                                setDateOpen(false);
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

            {isLoading || isFetching ? (
                <SinglePageLoader text="shift roster..." />
            ) : (
                <ShiftRosterBoard rows={rows} height={650} />
            )}
        </div>
    );
};

export default ShiftRoaster;