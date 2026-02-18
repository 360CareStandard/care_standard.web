import type { CalendarProps } from "./calendar-types";
import CalendarHeader from "./header/calendar-header";
import CalendarBody from "./body/calendar-body";
// import CalendarHeaderActions from "./header/actions/calendar-header-actions";
// import CalendarHeaderDate from "./header/date/calendar-header-date";
// import CalendarHeaderActionsMode from "./header/actions/calendar-header-actions-mode";
// import CalendarHeaderActionsAdd from "./header/actions/calendar-header-actions-add";
import CalendarProvider from "./calendar-provider";
import { CalendarHeaderLeft } from "./header/actions/calendar-header-left";
import { CalendarHeaderTitle } from "./header/actions/calendar-header-title";
import { CalendarHeaderRight } from "./header/actions/calendar-header-right";

export default function Calendar({
  events,
  setEvents,
  mode,
  setMode,
  date,
  setDate,
  calendarIconIsToday = true,
}: CalendarProps) {
  return (
    <CalendarProvider
      events={events}
      setEvents={setEvents}
      mode={mode}
      setMode={setMode}
      date={date}
      setDate={setDate}
      calendarIconIsToday={calendarIconIsToday}
    >
      <CalendarHeader>
        {/* LEFT */}
        <CalendarHeaderLeft />

        {/* CENTER */}
        <CalendarHeaderTitle />

        {/* RIGHT */}
        <CalendarHeaderRight />
      </CalendarHeader>

      <CalendarBody />
    </CalendarProvider>
  );
}
