import { RosterRow, Shift } from "@/types/roster";
import { ShiftBar } from "./shift-bar";

export function RosterRowItem({
    row,
    onOpenShift,
}: {
    row: RosterRow;
    onOpenShift: (shift: Shift) => void;
}) {
    return (
        <div className="grid grid-cols-[260px_1fr] border-b">
            <div className="p-3 border-r bg-white sticky left-0 z-10">
                <div className="text-sm font-medium">{row.title}</div>
                {row.subtitle && (
                    <div className="text-xs text-muted-foreground">{row.subtitle}</div>
                )}
            </div>

            <div className="relative h-[76px]">
                {/* …grid lines… */}

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
