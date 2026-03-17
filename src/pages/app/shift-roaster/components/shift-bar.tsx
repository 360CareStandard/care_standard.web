import { Status } from "iconsax-react";

import { Shift } from "@/types/roster";
import { barStyle, formatTime } from "../utils/time";

function statusClass(status: string) {
    switch (status) {
        case "completed":
            return "border-emerald-500 bg-emerald-50 text-emerald-900";
        case "scheduled":
            return "border-blue-500 bg-blue-50 text-blue-900";
        case "missed":
            return "border-orange-500 bg-orange-50 text-orange-900";
        case "ongoing":
            return "border-amber-500 bg-amber-50 text-amber-900";
        case "leave":
            return "border-slate-300 bg-slate-100 text-slate-700";
        default:
            return "border-gray-300 bg-gray-100 text-gray-900";
    }
}

export function ShiftBar({ shift, onOpen }: { shift: Shift; onOpen: () => void }) {
    const pos = barStyle(shift.visitStartTime, shift.visitEndTime);
    const start = formatTime(shift.visitStartTime);
    const end = formatTime(shift.visitEndTime);
    const label = shift.note ?? shift.counterpartyName ?? `${shift.client.firstname} ${shift.client.lastname}`;

    return (
        <button
            type="button"
            className={[
                "absolute top-4 h-11 rounded-md border-l-2 px-2 text-left text-xs",
                "shadow-sm transition hover:shadow truncate",
                statusClass(shift.status),
            ].join(" ")}
            style={{ left: pos.left, width: pos.width }}
            title={`${label} (${start} - ${end})`}
            onClick={onOpen}
        >
            <div className="truncate font-semibold">{label}</div>
            <div className="mt-1 flex items-center gap-1">
                <Status size={12} />
                <span className="truncate capitalize opacity-80">
                    {shift.status} - {start} to {end}
                </span>
            </div>
        </button>
    );
}