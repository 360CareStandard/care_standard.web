import { CalendarEvent as CalendarEventType } from "./calendar-types";
import { useCalendarContext } from "./calendar-context";
import { format, isSameDay, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";
import { Clock, User } from "iconsax-react";

interface EventPosition {
  left: string;
  width: string;
  top: string;
  height: string;
}

function getOverlappingEvents(
  currentEvent: CalendarEventType,
  events: CalendarEventType[],
): CalendarEventType[] {
  return events.filter((event) => {
    if (event.id === currentEvent.id) return false;
    return (
      currentEvent.start < event.end &&
      currentEvent.end > event.start &&
      isSameDay(currentEvent.start, event.start)
    );
  });
}

function calculateEventPosition(
  event: CalendarEventType,
  allEvents: CalendarEventType[],
): EventPosition {
  const overlappingEvents = getOverlappingEvents(event, allEvents);
  const group = [event, ...overlappingEvents].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );
  const position = group.indexOf(event);
  const width = `${100 / (overlappingEvents.length + 1)}%`;
  const left = `${(position * 100) / (overlappingEvents.length + 1)}%`;

  const startHour = event.start.getHours();
  const startMinutes = event.start.getMinutes();

  let endHour = event.end.getHours();
  let endMinutes = event.end.getMinutes();

  if (!isSameDay(event.start, event.end)) {
    endHour = 23;
    endMinutes = 59;
  }

  const topPosition = startHour * 128 + (startMinutes / 60) * 128;
  const duration = endHour * 60 + endMinutes - (startHour * 60 + startMinutes);
  const height = (duration / 60) * 128;

  return {
    left,
    width,
    top: `${topPosition}px`,
    height: `${height}px`,
  };
}

export default function CalendarEvent({
  event,
  month = false,
  className,
}: {
  event: CalendarEventType;
  month?: boolean;
  className?: string;
}) {
  const { events, setSelectedEvent, setManageEventDialogOpen, date } =
    useCalendarContext();
  const style = month ? {} : calculateEventPosition(event, events);

  // Generate a unique key that includes the current month to prevent animation conflicts
  const isEventInCurrentMonth = isSameMonth(event.start, date);
  const animationKey = `${event.id}-${
    isEventInCurrentMonth ? "current" : "adjacent"
  }`;
  function formatCarerLabel(event: CalendarEventType) {
    const carers = event.carerassigned ?? [];

    // pick primary person to display:
    const primary = carers[0]?.user ?? null;

    if (!primary) return "";

    const firstInitial = primary.firstname?.[0]
      ? `${primary.firstname[0]}.`
      : "";
    const lastName = primary.lastname ?? "";
    const name = `${firstInitial} ${lastName}`.trim();

    // how many extra carers to show as +N
    // - if carersNeeded is present, use it (it represents total required)
    // - otherwise use preferredCarersDetails length as a fallback
    const totalNeeded = carers.length;
    const plus = totalNeeded > 1 ? ` +${totalNeeded - 1}` : "";

    return `${name}${plus}`;
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div
          className={cn(
            `px-3 py-1.5 rounded-md truncate cursor-pointer transition-all duration-300 bg-${event.color}-500/10 hover:bg-${event.color}-500/20 border-l-2 border-${event.color}-500`,
            !month && "absolute",
            className,
          )}
          style={style}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedEvent(event);
            setManageEventDialogOpen(true);
          }}
          initial={{
            opacity: 0,
            y: -3,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.98,
            transition: {
              duration: 0.15,
              ease: "easeOut",
            },
          }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
            opacity: {
              duration: 0.2,
              ease: "linear",
            },
            layout: {
              duration: 0.2,
              ease: "easeOut",
            },
          }}
          layoutId={`event-${animationKey}-${month ? "month" : "day"}`}
        >
          <motion.div
            className={cn(
              `flex flex-col w-full text-${event.color}-700`,
              month && "flex-row items-center justify-between",
            )}
            layout="position"
          >
            <p
              className={cn(
                "font-semibold capitalize text-sm truncate",
                month && "text-xs",
              )}
            >
              {event.title}
            </p>
            <p
              className={cn(
                "text-sm flex gap-1 items-center",
                month && "text-xs",
              )}
            >
              <Clock size={13} />
              <small>{format(event.start, "h:mm a")}</small>
              <small className={cn("", month && "hidden")}>-</small>
              <small className={cn(month && "hidden")}>
                {format(event.end, "h:mm a")}
              </small>
            </p>
            <small className={cn("text-xs", month && "hidden ")}>
              ({event.duration ? `${event.duration} mins` : ""})
            </small>
          </motion.div>
          <div className="absolute bottom-5 grid gap-2">
            <small
              className={cn(
                `capitalize font-medium text-${event.color}-700`,
                month && "hidden ",
              )}
            >
              {event.status ? `${event.status}` : ""}
            </small>
            <span className={cn("flex items-center gap-1", month && "hidden")}>
              <User size={13} />
              <small className={cn(`capitalize text-${event.color}-700`)}>
                {formatCarerLabel(event)}
              </small>
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
