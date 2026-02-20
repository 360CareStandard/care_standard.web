import { useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { RosterRow } from "@/types/roster";
import { RosterHeader } from "./roster-header";
import { RosterRowItem } from "./roster-row-item";
import CalendarManageEventDialog from "./dialog/calendar-manage-event-dialog";

type Props = {
    rows: RosterRow[];
    height?: number;
};
type SelectedShift = {
    scheduleId: string;
    clientId: string;
};


export function ShiftRosterBoard({ rows, height = 650 }: Props) {
    const parentRef = useRef<HTMLDivElement | null>(null);

    const [selectedShift, setSelectedShift] = useState<SelectedShift | null>(null);
    // ✅ single dialog state

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 76,
        overscan: 8,
    });

    const virtualItems = rowVirtualizer.getVirtualItems();
    const totalSize = rowVirtualizer.getTotalSize();

    return (
        <>
            <div className="w-full rounded-lg bg-white">
                <div className="w-full overflow-x-auto">
                    <div className="min-w-[1200px]">
                        {/* Sticky Header */}
                        <div className="sticky top-0 z-20 bg-white border-b">
                            <div className="grid grid-cols-[260px_1fr]">
                                <div className="border-r bg-white sticky left-0 z-30" />
                                <RosterHeader />
                            </div>
                        </div>

                        {/* Virtualized rows */}
                        <div ref={parentRef} className="overflow-y-auto" style={{ height }}>
                            <div style={{ height: totalSize, position: "relative" }}>
                                {virtualItems.map((vi) => {
                                    const row = rows[vi.index];
                                    return (
                                        <div
                                            key={row.rowId}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                transform: `translateY(${vi.start}px)`,
                                            }}
                                        >
                                            {/* ✅ pass handler down so bars can open the ONE dialog */}
                                            <RosterRowItem
                                                row={row}
                                                onOpenShift={(shift) =>
                                                    setSelectedShift({
                                                        scheduleId: shift.id,
                                                        clientId: shift.client.id,
                                                    })
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ ONE dialog rendered once */}
            <CalendarManageEventDialog
                open={!!selectedShift}
                onOpenChange={(open) => {
                    if (!open) setSelectedShift(null);
                }}
                clientId={selectedShift?.clientId ?? ""}
                scheduleId={selectedShift?.scheduleId ?? null}
            />
        </>
    );
}
