import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type EmptyStateSize = "sm" | "md" | "lg";

export type EmptyStateCardProps = {
  title: string;
  description?: string;
  /** Pass an icon element (SVG) or any ReactNode */
  icon?: React.ReactNode;
  /** Optional action area (buttons/links) */
  actions?: React.ReactNode;
  size?: EmptyStateSize;
  className?: string;
  /** Center content (default true) */
  centered?: boolean;
  button?: React.ReactNode;
  btnText?: string;
  onClick?: () => void;
};

const sizeStyles: Record<
  EmptyStateSize,
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

export function EmptyStateCard({
  title,
  description,
  icon,
  actions,
  size = "md",
  className,
  centered = true,
  button,
  btnText,
  onClick,
}: EmptyStateCardProps) {
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
        {icon ? (
          <div className={["text-foreground/90", s.icon].join(" ")}>
            {/* ensure icons inherit color/size via CSS */}
            <div className="inline-flex items-center justify-center [&>*]:h-full ">
              {icon}
            </div>
          </div>
        ) : null}

        <p className={s.title}>{title}</p>

        {description ? (
          <p className={["text-muted-foreground", s.desc].join(" ")}>
            {description}
          </p>
        ) : null}

        {actions ? <div className="mt-1">{actions}</div> : null}
        {button && (
          <div className="mt-1">
            <Button onClick={onClick} className="text-xs" size={"sm"}>
              <PlusIcon />
              {btnText}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
