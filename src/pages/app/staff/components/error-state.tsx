import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Danger } from "iconsax-react";

type ErrorStateSize = "sm" | "md" | "lg";

export type ErrorStateCardProps = {
  title: string;
  description?: string;
  /** Pass an icon element (SVG) or any ReactNode */
  icon?: React.ReactNode;
  /** Optional action area (buttons/links) */
  actions?: React.ReactNode;
  size?: ErrorStateSize;
  className?: string;
  /** Center content (default true) */
  centered?: boolean;
  button?: React.ReactNode;
  btnText?: string;
  onClick?: () => void;
};

const sizeStyles: Record<
  ErrorStateSize,
  { icon: string; title: string; desc: string; gap: string; pad: string }
> = {
  sm: {
    icon: "h-6 w-6",
    title: "text-sm",
    desc: "text-xs",
    gap: "gap-1.5",
    pad: "p-3",
  },
  md: {
    icon: "h-8 w-8",
    title: "text-sm font-semibold",
    desc: "text-xs",
    gap: "gap-2",
    pad: "p-4",
  },
  lg: {
    icon: "h-10 w-10",
    title: "text-base font-semibold",
    desc: "text-sm",
    gap: "gap-3",
    pad: "p-6",
  },
};

export function ErrorStateCard({
  title,
  actions,
  size = "md",
  className,
  centered = true,

  onClick,
}: ErrorStateCardProps) {
  const s = sizeStyles[size];

  return (
    <Card className={className}>
      <CardContent
        className={[
          s.pad,
          "flex flex-col items-center text-center",
          centered ? "justify-center" : "",
          s.gap,
        ].join(" ")}
      >
        <div className="inline-flex items-center justify-center [&>*]:h-full ">
          <Danger color="#fb2c36" size={30} />
        </div>

        <p className={s.title}>{title}</p>

        {actions ? <div className="mt-1">{actions}</div> : null}

        <div className="mt-1">
          <Button onClick={onClick} className="text-xs" size={"sm"}>
            <RefreshCw />
            Retry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
