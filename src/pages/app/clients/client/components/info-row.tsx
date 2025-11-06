import { cn } from "@/lib/utils";

export function InfoRow({
  label,
  icon,
  children,
  className,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex  items-center gap-4 ${icon && "px-6"}  py-2 `}>
      {icon ? (
        <div className="flex items-center gap-2  text-muted-foreground">
          <span className="text-muted-foreground text-base">{icon}</span>
        </div>
      ) : null}
      <div>
        <span className="text-muted-foreground text-xs">{label}</span>
        <div className={cn("text-sm font-medium", className)}>{children}</div>
      </div>
    </div>
  );
}
