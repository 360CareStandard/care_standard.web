import { EventsProvider } from "@/context/events-context";
import Availability from "./page";

export default function AvailabilityPage() {
  return (
    <EventsProvider>
      <Availability />
    </EventsProvider>
  );
}
