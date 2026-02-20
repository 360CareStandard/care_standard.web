import { Status } from "iconsax-react";
import { barStyle } from "../utils/time";
import { Shift } from "@/types/roster";

function statusClass(status: string) {
    switch (status) {
        case "completed":
            return "bg-green-100 border-green-300 text-green-900";
        case "scheduled":
            return "bg-blue-100 border-blue-300 border-l-2 text-blue-900";
        case "missed":
            return "bg-red-100 border-red-300 text-red-900";
        case "ongoing":
            return "bg-orange-100 border-orange-300 text-orange-900";
        default:
            return "bg-gray-100 border-gray-300 text-gray-900";
    }
}

export function ShiftBar({ shift, onOpen }: { shift: Shift; onOpen: () => void }) {
    const pos = barStyle(shift.visitStartTime, shift.visitEndTime);
    const label = `${shift.client.firstname} ${shift.client.lastname}`;


    return (
        <>
            <button
                type="button"
                className={[
                    "absolute top-4 h-10 px-2 rounded-md  text-left text-xs cursor-pointer",
                    "shadow-sm hover:shadow transition truncate",
                    statusClass(shift.status),
                ].join(" ")}
                style={{ left: pos.left, width: pos.width }}
                title={`${label} (${shift.visitStartTime} - ${shift.visitEndTime})`}
                onClick={onOpen}
            >
                <div className="font-semibold truncate ">{label}</div>
                <div className="flex items-center gap-1 mt-1"   >
                    <Status size={12} />
                    <span className="opacity-80 truncate capitalize "> {shift.status}</span>
                </div>
            </button>

        </>
    );
}
