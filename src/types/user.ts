export type User = {
  id: string;
  email: string;
  phone: string | null;
  firstname: string;
  lastname: string;
  authProvider: string;
  isSuperAdmin: boolean;
  status: string;
  emailVerified: boolean;
  accountApproved: boolean;
  createdAt: string;
  updatedAt: string;
};

