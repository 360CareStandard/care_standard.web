export function InfoRow({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex  items-center gap-4 px-6 py-2 ">
      <div className="flex items-center gap-2  text-muted-foreground">
        {icon ? (
          <span className="text-muted-foreground text-base">{icon}</span>
        ) : null}
      </div>
      <div>
        <span className="text-muted-foreground text-xs">{label}</span>
        <div className="text-sm font-medium">{children}</div>
      </div>
    </div>
  );
}
