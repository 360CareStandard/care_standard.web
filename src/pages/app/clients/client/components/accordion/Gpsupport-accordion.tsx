import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { CareAccordionSection } from "../wrapper/care-accordion";
import { GPInformationFields } from "../../forms/gp/GPInformationFields";
import { OtherHealthcareProfessionalsFields } from "../../forms/gp/OtherHealthcareProfessionalsFields";

export function GPsupportAccordion() {
  // optional: control which is open
  const [open, setOpen] = React.useState<string | undefined>("information");

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={(v) => setOpen(v as string | undefined)}
      className="w-full space-y-2"
    >
      <CareAccordionSection
        value="information"
        icon={
          <svg
            width={18}
            height={19}
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.3083 18.5C8.73531 18.5 7.39543 17.9507 6.28869 16.8522C5.18194 15.7537 4.62857 14.4173 4.62857 12.8429V12.3111C3.32571 12.1897 2.22857 11.6411 1.33714 10.6654C0.445715 9.69097 0 8.53109 0 7.18571V1.52857H3.08571V0.5H4.11429V3.58571H3.08571V2.55714H1.02857V7.18571C1.02857 8.31714 1.43143 9.28571 2.23714 10.0914C3.04286 10.8971 4.01143 11.3 5.14286 11.3C6.27429 11.3 7.24286 10.8971 8.04857 10.0914C8.85429 9.28571 9.25714 8.31714 9.25714 7.18571V2.55714H7.2V3.58571H6.17143V0.5H7.2V1.52857H10.2857V7.18571C10.2857 8.53109 9.84 9.69131 8.94857 10.6664C8.05714 11.6415 6.96 12.1897 5.65714 12.3111V12.8429C5.65714 14.1286 6.10903 15.2216 7.0128 16.1219C7.91794 17.0216 9.01612 17.4714 10.3073 17.4714C11.593 17.4714 12.6857 17.0216 13.5854 16.1219C14.485 15.2223 14.9352 14.1293 14.9359 12.8429V11.2383C14.4545 11.1251 14.0571 10.8721 13.7438 10.4792C13.4304 10.0863 13.2737 9.6344 13.2737 9.12354C13.2737 8.52011 13.4856 8.00651 13.9094 7.58274C14.3331 7.15966 14.8474 6.94811 15.4522 6.94811C16.057 6.94811 16.5706 7.15966 16.993 7.58274C17.4154 8.00583 17.6263 8.51977 17.6256 9.12457C17.6256 9.63474 17.4689 10.0863 17.1555 10.4792C16.8429 10.8721 16.4458 11.1255 15.9645 11.2393V12.8429C15.9645 14.4173 15.4152 15.7537 14.3167 16.8522C13.2182 17.9507 11.8821 18.5 10.3083 18.5Z"
              fill="black"
            />
          </svg>
        }
        title="GP Information"
      >
        <GPInformationFields />
      </CareAccordionSection>

      <CareAccordionSection
        value="professionals"
        icon={
          <svg
            width={18}
            height={19}
            viewBox="0 0 18 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.87004 8.6525C6.79504 8.645 6.70504 8.645 6.62254 8.6525C4.83754 8.5925 3.42004 7.13 3.42004 5.33C3.42004 3.4925 4.90504 2 6.75004 2C8.58754 2 10.08 3.4925 10.08 5.33C10.0725 7.13 8.65504 8.5925 6.87004 8.6525Z"
              stroke="#191D31"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.3075 3.5C13.7625 3.5 14.9325 4.6775 14.9325 6.125C14.9325 7.5425 13.8075 8.6975 12.405 8.75C12.345 8.7425 12.2775 8.7425 12.21 8.75"
              stroke="#191D31"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.12004 11.42C1.30504 12.635 1.30504 14.615 3.12004 15.8225C5.18254 17.2025 8.56504 17.2025 10.6275 15.8225C12.4425 14.6075 12.4425 12.6275 10.6275 11.42C8.57254 10.0475 5.19004 10.0475 3.12004 11.42Z"
              stroke="#191D31"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.755 15.5C14.295 15.3875 14.805 15.17 15.225 14.8475C16.395 13.97 16.395 12.5225 15.225 11.645C14.8125 11.33 14.31 11.12 13.7775 11"
              stroke="#191D31"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        title="Other Healthcare Professionals"
      >
        <OtherHealthcareProfessionalsFields />
      </CareAccordionSection>
    </Accordion>
  );
}
