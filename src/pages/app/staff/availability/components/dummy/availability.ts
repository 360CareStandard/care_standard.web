// dummy/availability-api.ts
export const availabilityApiResponse: {
  status: "success";
  data: AvailabilityApiRule[];
} = {
  status: "success",
  data: [
    // DAILY (with end date)
    {
      id: "rule-daily-1",
      staffId: "staff-123",
      frequency: "daily",
      repeatUnit: "weeks",
      repeatEvery: null,
      selectedDays: [],
      startTime: "09:00:00",
      endTime: "17:00:00",
      startDate: "2026-01-24T00:00:00.000Z",
      endDate: "2026-01-28T00:00:00.000Z",
      noEndDate: false,
      isActive: true,
      createdAt: "2026-01-24T12:40:47.001Z",
      updatedAt: "2026-01-24T12:40:47.001Z",
    },

    // WEEKLY (Mon–Wed)
    {
      id: "rule-weekly-1",
      staffId: "staff-123",
      frequency: "weekly",
      repeatUnit: "weeks",
      repeatEvery: null,
      selectedDays: ["Mon", "Tue", "Wed"],
      startTime: "10:00:00",
      endTime: "14:00:00",
      startDate: "2026-01-25T00:00:00.000Z",
      endDate: "2026-02-05T00:00:00.000Z",
      noEndDate: false,
      isActive: true,
      createdAt: "2026-01-24T12:42:49.032Z",
      updatedAt: "2026-01-24T12:42:49.032Z",
    },

    // CUSTOM (every 2 days on Mon–Thu)
    {
      id: "rule-custom-1",
      staffId: "staff-123",
      frequency: "custom",
      repeatUnit: "days",
      repeatEvery: 2,
      selectedDays: ["Mon", "Tue", "Wed", "Thu"],
      startTime: "13:00:00",
      endTime: "16:30:00",
      startDate: "2026-01-30T00:00:00.000Z",
      endDate: "2026-02-10T00:00:00.000Z",
      noEndDate: false,
      isActive: true,
      createdAt: "2026-01-24T12:44:15.462Z",
      updatedAt: "2026-01-24T12:44:15.462Z",
    },

    // DAILY (no end date)
    {
      id: "rule-daily-open",
      staffId: "staff-123",
      frequency: "daily",
      repeatUnit: "weeks",
      repeatEvery: null,
      selectedDays: [],
      startTime: "18:00:00",
      endTime: "21:00:00",
      startDate: "2026-01-26T00:00:00.000Z",
      endDate: null,
      noEndDate: true,
      isActive: true,
      createdAt: "2026-01-24T12:50:00.000Z",
      updatedAt: "2026-01-24T12:50:00.000Z",
    },
  ],
};

// types/api-availability.ts
export type AvailabilityApiRule = {
  id: string;
  staffId: string;
  frequency: "daily" | "weekly" | "custom";
  repeatUnit?: "days" | "weeks";
  repeatEvery: number | null;
  selectedDays: ("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[];
  startDate: string;
  endDate: string | null;
  noEndDate: boolean;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
