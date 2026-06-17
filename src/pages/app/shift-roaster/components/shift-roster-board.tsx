import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { RosterRow } from "@/types/roster";

import CalendarManageEventDialog from "./dialog/calendar-manage-event-dialog";
import { RosterHeader } from "./roster-header";
import { RosterRowItem } from "./roster-row-item";

type Props = {
  rows: RosterRow[];
  height?: number;
};

type SelectedShift = {
  scheduleId: string;
  clientId: string;
};

export function ShiftRosterBoard({ rows, height = 650 }: Props) {
  const ROW_HEIGHT = 76;
  const LEFT_COL_WIDTH = 180;
  const parentRef = useRef<HTMLDivElement | null>(null);
  const timelineViewportRef = useRef<HTMLDivElement | null>(null);
  const [selectedShift, setSelectedShift] = useState<SelectedShift | null>(
    null,
  );
  const [timelineViewportWidth, setTimelineViewportWidth] = useState(0);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  useEffect(() => {
    const element = timelineViewportRef.current;
    if (!element) return;

    const updateWidth = () => {
      setTimelineViewportWidth(element.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const baseHourWidth = 52;
  const minTimelineWidth = baseHourWidth * 24;
  const timelineWidth = Math.max(minTimelineWidth, timelineViewportWidth);
  const hourWidth = Math.floor((timelineWidth / 24) * 100) / 100;

  return (
    <>
      <div className="w-full overflow-hidden rounded-lg border bg-white">
        <div className="w-full">
          <div
            className="grid"
            style={{ gridTemplateColumns: `${LEFT_COL_WIDTH}px 1fr` }}
          >
            <div className="border-r bg-white">
              <div className="h-12 border-b bg-white" />
              <div
                ref={parentRef}
                className="overflow-y-auto"
                style={{ height }}
              >
                <div style={{ height: totalSize, position: "relative" }}>
                  {virtualItems.map((vi) => {
                    const row = rows[vi.index];
                    const isEven = vi.index % 2 === 0;
                    return (
                      <div
                        key={row.rowId}
                        style={{
                          position: "absolute",
                          top: vi.start,
                          left: 0,
                          width: "100%",
                        }}
                      >
                        <div
                          className={`grid ${
                            isEven ? "bg-gray-50" : "bg-white"
                          }`}
                          style={{
                            height: `${ROW_HEIGHT}px`,
                            gridTemplateColumns: `${LEFT_COL_WIDTH}px 1fr`,
                          }}
                        >
                          <div className="sticky left-0 z-10 flex h-full flex-col justify-center border-b bg-transparent px-3">
                            <div className="truncate text-sm font-medium text-ellipsis">
                              {row.title}
                            </div>
                            {row.subtitle && (
                              <div className="mt-1 inline-flex rounded px-1.5 py-0.5 text-xs text-muted-foreground">
                                ({row.subtitle})
                              </div>
                            )}
                          </div>
                          <div />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div ref={timelineViewportRef} className="overflow-x-auto">
              <div style={{ width: `${timelineWidth}px` }}>
                <div className="sticky top-0 z-20 border-b bg-white">
                  <RosterHeader hourWidth={hourWidth} />
                </div>

                <div className="overflow-y-auto" style={{ height }}>
                  <div style={{ height: totalSize, position: "relative" }}>
                    {virtualItems.map((vi) => {
                      const row = rows[vi.index];

                      return (
                        <div
                          key={`grid-${row.rowId}`}
                          style={{
                            position: "absolute",
                            top: vi.start,
                            left: 0,
                            width: "100%",
                          }}
                        >
                          <RosterRowItem
                            row={row}
                            hourWidth={hourWidth}
                            showLabel={false}
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
        </div>
      </div>

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
