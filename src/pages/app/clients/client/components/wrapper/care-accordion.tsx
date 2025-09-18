// components/care/CareAccordionSection.tsx
import { cn } from "@/lib/utils";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type Props = {
  value: string;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export function CareAccordionSection({
  value,
  icon,
  title,
  subtitle,
  children,
  className,
  contentClassName,
}: Props) {
  return (
    <AccordionItem value={value} className={cn("border-none", className)}>
      <AccordionTrigger className=" py-3 hover:no-underline">
        <div className="flex w-full items-center gap-3 text-left">
          {icon ? (
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-accent text-primary">
              {icon}
            </span>
          ) : null}
          <div className="flex-1">
            <div className=" font-semibold leading-none">{title}</div>
            {subtitle ? (
              <div className="mt-1 text-[12px] text-muted-foreground">
                {subtitle}
              </div>
            ) : null}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className=" pb-4 pt-2">
        <div className={cn("", contentClassName)}>{children}</div>
      </AccordionContent>
    </AccordionItem>
  );
}
