export type AgencyMembership = {
  membershipId: string;
  agencyId: string;
  agencyName: string;
  country: string;
  roles: string[]; // e.g. ["Agency Owner"]
};

export type AgenciesResponse = {
  status: "success";
  message: string;
  data: { agencies: AgencyMembership[] };
};

export type SelectAgencyReq = { agencyId: string };
export type Workspace = {
  id: string;
  legalName: string;
  tradingName: string;
  name: string;
} | null;
export type SelectAgencyRes = {
  status: "success";
  message: string;
  data?: {
    token?: string; // if your API returns a new token
    agency?: Workspace;
  };
};
