export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export interface StaffAvailability {
  id: string;
  staffId: string;
  type: "availability" | "absent";
  absenceType: string | null;
  reason: string | null;
  frequency: string;
  repeatEvery: number | null;
  repeatUnit: string;
  selectedDays: string[] | null;
  startTime: string;
  endTime: string;
  isFullDay?: boolean;
  startDate: string;
  endDate: string | null;
  noEndDate: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StaffAvailabilityResponse {
  status: "success";
  data: {
    availabilities: StaffAvailability[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
