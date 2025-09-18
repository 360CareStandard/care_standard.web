import { z } from "zod";

export const FundingSourceEnum = z.enum([
  "NHS",
  "Local Authority",
  "Private",
  "Mixed",
]);

export const FundingSchema = z.object({
  fundingSource: FundingSourceEnum,
  funderCouncil: z.string().min(1, "Enter funder/council/ICB"),
  authorisationRef: z
    .string()
    .min(1, "Enter authorisation or reference number"),
  budgetCap: z.string().min(1, "Enter budget cap or rate plan"),
});
