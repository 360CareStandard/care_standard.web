import { cn } from "@/lib/utils";

type Props = {
  value: number; // 0..100
  size?: number; // px
  strokeWidth?: number; // px
  showLabel?: boolean;
  className?: string; // e.g. "text-primary" to color the progress
  "aria-label"?: string;
};

export function CircularProgress({
  value,
  size = 36,
  strokeWidth = 4,
  showLabel = true,
  className,
  ...rest
}: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = Math.max(0, (size - strokeWidth) / 2);
  const c = 2 * Math.PI * r;

  const dashArray = `${c}`;
  const dashOffset = `${c * (1 - clamped / 100)}`;

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
      {...rest}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-muted-foreground/30"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 300ms ease" }}
        />
      </svg>

      {showLabel && (
        <span className="absolute pointer-events-none text-[10px] font-medium text-muted-foreground">
          {clamped}%
        </span>
      )}
    </div>
  );
}
