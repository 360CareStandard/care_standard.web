import { RosterRow, Shift } from "@/types/roster";
import { ShiftBar } from "./shift-bar";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function RosterRowItem({
    row,
    hourWidth,
    showLabel = true,
    onOpenShift,
}: {
    row: RosterRow;
    hourWidth: number;
    showLabel?: boolean;
    onOpenShift: (shift: Shift) => void;
}) {
    if (!showLabel) {
        return (
            <div className="relative h-[76px] border-b bg-[#FCFCFD]">
                <div
                    className="absolute inset-0 grid"
                    style={{ gridTemplateColumns: `repeat(24, ${hourWidth}px)` }}
                >
                    {HOURS.map((hour, index) => (
                        <div
                            key={`${row.rowId}-h-${hour}`}
                            className="border border-gray-200"
                            style={{ borderRightWidth: index === HOURS.length - 1 ? "1px" : undefined }}
                        />
                    ))}
                </div>

                {row.shifts.map((shift) => (
                    <ShiftBar
                        key={shift.id}
                        shift={shift}
                        onOpen={() => onOpenShift(shift)}
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-[260px_1fr] border-b">
            <div className="sticky left-0 z-10 border-r  p-3">
                <div className="text-sm font-medium truncate text-ellipsis">{row.title}</div>
                {row.subtitle && (
                    <div className="mt-1 inline-flex rounded  px-1.5 py-0.5 text-xs text-muted-foreground">
                        ({row.subtitle})
                    </div>
                )}
            </div>

            <div className="relative h-[76px] bg-[#FCFCFD]">
                <div
                    className="absolute inset-0 grid"
                    style={{ gridTemplateColumns: `repeat(24, ${hourWidth}px)` }}
                >
                    {HOURS.map((hour, index) => (
                        <div
                            key={`${row.rowId}-h-${hour}`}
                            className="border border-gray-200"
                            style={{ borderRightWidth: index === HOURS.length - 1 ? "1px" : undefined }}
                        />
                    ))}
                </div>

                {row.shifts.map((shift) => (
                    <ShiftBar
                        key={shift.id}
                        shift={shift}
                        onOpen={() => onOpenShift(shift)}
                    />
                ))}
            </div>
        </div>
    );
}
