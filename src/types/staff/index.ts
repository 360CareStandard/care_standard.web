export interface StaffListResponse {
  data: {
    pagination: Pagination;
    staffs: Staff[];
  };
}
export interface StaffResponse {
  data: Staff;
}
export interface Pagination {
  total: number;
  page: string; // API returns string
  limit: string; // API returns string
  totalPages: number;
}
export interface Staff {
  id: string;
  userId: string;
  agencyId: string;

  preferredName: string;
  tittle: "Mr" | "Mrs" | "Miss" | "Dr" | string;
  gender: "Male" | "Female" | string;
  pronouns: string;
  dob: string; // ISO date (YYYY-MM-DD)

  staffRole: string;
  status: "active" | "inactive" | string;
  adminAccessLevel: boolean;

  primaryPhoneNumber: string;
  primaryPhoneNumberType: "mobile" | "home" | "work" | string;
  secondaryPhoneNumber: string;
  secondaryPhoneNumberType: "mobile" | "home" | "work" | string;

  highlights: string;
  profilePicture: string | null;

  createdAt: string; // ISO datetime
  updatedAt: string;

  user: User;
}
export interface User {
  id: string;
  email: string;
  phone: string;

  firstname: string;
  lastname: string;

  status: "active" | "inactive" | string;
  authProvider: "magic_link" | "password" | string;

  emailVerified: boolean;
  accountApproved: boolean;
  isSuperAdmin: boolean;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  verificationToken: string | null;
  verificationTokenExpiresIn: string | null;
  passwordResetToken: string | null;
  passwordResetTokenExpires: string | null;

  memberships: Membership[];
}
export interface Membership {
  id: string;
  userId: string;
  // add more fields here when the API expands
}
