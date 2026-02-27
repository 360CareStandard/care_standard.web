const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

export function RosterHeader({ hourWidth }: { hourWidth: number }) {
    return (
        <div
            className="grid h-12 bg-[#F9FAFB]"
            style={{ gridTemplateColumns: `repeat(24, ${hourWidth}px)` }}
        >
            {HOURS.map((h, index) => (
                <div
                    key={h}
                    className="flex items-center justify-center border-l text-xs text-muted-foreground"
                    style={{ borderRightWidth: index === HOURS.length - 1 ? "1px" : undefined }}
                >
                    {h}
                </div>
            ))}
        </div>
    );
}
