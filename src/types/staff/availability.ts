export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export interface StaffAvailability {
  id: string;
  staffId: string;
  frequency: string;
  repeatEvery: number;
  repeatUnit: string;
  selectedDays: string[];
  startTime: string;
  endTime: string;
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
