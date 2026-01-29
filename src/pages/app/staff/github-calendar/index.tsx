import Calendar from "@/components/calendar";

import { EventsProvider } from "@/context/events-context";

export default function Home() {
  return (
    <EventsProvider>
      <div className="py-4">
        <Calendar />
      </div>
    </EventsProvider>
  );
}
