
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`);

export function RosterHeader() {
    return (
        <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(24, minmax(0, 1fr))` }}
        >
            {HOURS.map((h) => (
                <div key={h} className="p-2 text-xs text-muted-foreground border-l">
                    {h}
                </div>
            ))}
        </div>
    );
}
