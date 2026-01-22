export type StaffSkill = {
  certificateUrl: string | null;
  createdAt: string;
  expiredAt: string | null;
  id: string;
  issuedBy: string;
  note: string | null;
  skillName: string;
  skillType: string;
  staffId: string;
  updatedAt: string;
};

export interface StaffSkillResponse {
  // status: "success" | "error" | string;
  message?: string;
  data?: {
    skills: StaffSkill[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
