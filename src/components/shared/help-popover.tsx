// components/ui/help-popover.tsx

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

type HelpPopoverProps = {
  title?: string;
  children: React.ReactNode; // the body/content
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
};

export function HelpPopover({
  title = "What’s this?",
  children,
  side = "top",
  align = "center",
  className,
}: HelpPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={title}
          className={className + " h-6 w-6 p-0"}
        >
          <Info className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side={side}
        align={align}
        className="w-80 text-sm"
        collisionPadding={8}
      >
        <p className="mb-1 font-medium">{title}</p>
        <div className="space-y-2 text-muted-foreground">{children}</div>
      </PopoverContent>
    </Popover>
  );
}
