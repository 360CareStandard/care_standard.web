import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function EmptyState({
  onReset,
  title = "No activity events found",
  desc = "Adjust filters or date range to see more events",
}: {
  onReset: () => void;
  title?: string;
  desc?: string;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <Avatar className="mb-4 h-28 w-28 rounded-none">
        <AvatarImage src="/EmptyState.svg" alt="Empty state" />
        <AvatarFallback>ES</AvatarFallback>
      </Avatar>

      <h4 className="font-semibold text-foreground">{title}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{desc}</p>

      <Button variant="outline" className="mt-5" onClick={onReset}>
        Reset All Filters
      </Button>
    </div>
  );
}
