import { Spinner } from "@/components/shared/spinner";
import { useStaffDetails } from "@/hooks/staff/useStaff";
import { useStaffVisitScheduleList } from "@/hooks/staff/useStaffVisitSchedule";
import { useParams } from "react-router-dom";
import { Mode } from "../../clients/client/visit-schedule/components/calendar/calendar-types";
import React from "react";
import { CalendarEvent } from "./components/calendar/calendar-types";
import { visitSchedulesToCalendarEvents } from "./components/visit-schedules-to-calendar-events";
import { CalendarAdd } from "iconsax-react";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorStateCard } from "../components/error-state";
import SinglePageLoader from "@/components/loading/single-page-loader";
import Calendar from "./components/calendar/calendar";

const Visits = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const { data: staffData } = useStaffDetails(staffId);
  const { data, isLoading, refetch, isError } = useStaffVisitScheduleList(staffId as string);

  const visitSchedules = data?.visits ?? [];

  const [mode, setMode] = React.useState<Mode>("week");
  const [date, setDate] = React.useState<Date>(new Date());

  const calendarEvents = React.useMemo<CalendarEvent[]>(
    () => visitSchedulesToCalendarEvents(visitSchedules as any),
    [visitSchedules],
  );

  return <div className="space-y-6">
    <div className="flex justify-between items-center">
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        staffData && (
          <div>
            <h1 className="text-2xl font-semibold">
              {staffData?.user.firstname}'s visits
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Scheduled care visits assigned to this staff member
            </p>
          </div>
        )
      )}

    </div>
    {isLoading ? (
      <SinglePageLoader text="visit schedules" />
    ) : isError ? (
      <div className="flex mt-52 justify-center items-center">
        <ErrorStateCard
          className="shadow-none !border-0 !bg-transparent"
          title="Failed to load visit schedules."
          onClick={() => refetch()}
          size="lg"
        />
      </div>
    ) : visitSchedules.length === 0 ? (
      <Card className="flex-1 mt-12  mx-auto w-full">
        <CardContent className="flex justify-center items-center flex-col py-8 gap-2 w-full">
          <CalendarAdd size={32} />
          <h4 className="font-semibold">No visits scheduled yet</h4>
          <p className="text-muted-foreground text-sm">
            Start by adding a visit to track care schedule and ensure
            continuity.
          </p>
          <div className="mt-1">
            {/* <Button onClick={openForAdd} className="text-xs">
                <PlusIcon />
                Add Visit
              </Button> */}
          </div>
        </CardContent>
      </Card>
    ) : (
      <Card className="flex-1 mt-12 mx-auto w-full shadow-none border-0">
        <CardContent>
          <Calendar
            events={calendarEvents}
            setEvents={() => { }}
            mode={mode}
            setMode={setMode}
            date={date}
            setDate={setDate}
          />
        </CardContent>
      </Card>
    )}
  </div>;
};

export default Visits;
