

export type VisitScheduleNote = {
  id: string;
  visitScheduleId: string;
  agencyId: string;
  staffId: string;
  note: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
};

export type VisitScheduleNotesResponse = {
    data: {

        result: number;
        notes: VisitScheduleNote[];
        totalPages: number;
        currentPage: number;
    }
};

