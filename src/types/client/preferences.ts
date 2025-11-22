import { Workspace } from "../workspace";
export interface ClientPreferencesResponse {
  status: "success" | "error";
  message: string;
  data: {
    clientPreferences: ClientPreferences;
    agency: Workspace;
    country: string;
    id: string; // same as agency.id
    legalName: string;
    tradingName: string;
  };
}

export interface ClientPreferences {
  id: string;
  clientId: string;
  agencyId: string;

  morningRoutine: string;
  sleepingHabits: string;
  dailyActivities: string;

  preferredVisitTimes: VisitTime[];

  religionOrFaith: string;
  faithPractices: string;
  culturalConsiderations: string;

  dietaryRestrictions: DietaryRestriction[];

  foodLikes: string;
  foodDislikes: string;
  favouriteMeals: string;

  preferredLanguage: string;
  interpreterNeeded: boolean;
  communicationAids: string;
  interactionNotes: string;

  metadata: Record<string, unknown>;
  status: "active" | "inactive" | "archived";

  createdAt: string;
  updatedAt: string;

  client: ClientDetails;
}

export interface ClientDetails {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  // add other optional fields if API includes them
}

export type VisitTime = "Morning" | "Afternoon" | "Evening";

export type DietaryRestriction =
  | "Vegetarian"
  | "Halal"
  | "Diabetic"
  | "Allergies";
