import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { CareAccordionSection } from "../wrapper/care-accordion";
import { RoutinesLifestyleFields } from "../../forms/preferences/RoutinesLifestyleFields";
import { CulturalFaithFields } from "../../forms/preferences/CulturalFaithFields";
import { FoodDietFields } from "../../forms/preferences/FoodDietFields";
import { CommunicationIdentityFields } from "../../forms/preferences/CommunicationIdentityFields";

export function PreferenceAccordion() {
  // optional: control which is open
  const [open, setOpen] = React.useState<string | undefined>("routines");

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={(v) => setOpen(v as string | undefined)}
      className="w-full space-y-2"
    >
      <CareAccordionSection
        value="routines"
        icon={
          <svg
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 1.5V3.75"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 1.5V3.75"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.625 6.81738H15.375"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.75 6.375V12.75C15.75 15 14.625 16.5 12 16.5H6C3.375 16.5 2.25 15 2.25 12.75V6.375C2.25 4.125 3.375 2.625 6 2.625H12C14.625 2.625 15.75 4.125 15.75 6.375Z"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.771 10.2754H11.7778"
              stroke="#191D31"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.771 12.5254H11.7778"
              stroke="#191D31"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.99661 10.2754H9.00335"
              stroke="#191D31"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.99661 12.5254H9.00335"
              stroke="#191D31"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.22073 10.2754H6.22747"
              stroke="#191D31"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.22073 12.5254H6.22747"
              stroke="#191D31"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        title="Routines & Lifestyle"
      >
        <RoutinesLifestyleFields />
      </CareAccordionSection>

      <CareAccordionSection
        value="cultural"
        icon={
          <svg
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.00001 2.25H6.75001C5.28751 6.63 5.28751 11.37 6.75001 15.75H6.00001"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.25 2.25C12.7125 6.63 12.7125 11.37 11.25 15.75"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.25 12V11.25C6.63 12.7125 11.37 12.7125 15.75 11.25V12"
              stroke="#191D31"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.25 6.7502C6.63 5.2877 11.37 5.2877 15.75 6.7502"
              stroke="#191D31"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        title="Cultural & Faith"
      >
        <CulturalFaithFields />
      </CareAccordionSection>
      <CareAccordionSection
        value="food"
        icon={
          <svg
            width={15}
            height={20}
            viewBox="0 0 15 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.4 11.8C4.03652 11.8 4.64697 11.5471 5.09706 11.0971C5.54714 10.647 5.8 10.0365 5.8 9.4V1V5.8H1V1V9.4C1 10.0365 1.25286 10.647 1.70294 11.0971C2.15303 11.5471 2.76348 11.8 3.4 11.8ZM3.4 11.8V19M3.4 5.8V1M14.2 1V19H13V13H14.2H9.4V5.8C9.4 4.52696 9.90571 3.30606 10.8059 2.40589C11.7061 1.50571 12.927 1 14.2 1Z"
              stroke="#025134"
              strokeLinejoin="round"
            />
          </svg>
        }
        title="Food & Diet"
      >
        <FoodDietFields />
      </CareAccordionSection>
      <CareAccordionSection
        value="communication"
        icon={
          <svg
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 1.5H6C3 1.5 1.5 3 1.5 6V15.75C1.5 16.1625 1.8375 16.5 2.25 16.5H12C15 16.5 16.5 15 16.5 12V6C16.5 3 15 1.5 12 1.5Z"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.25 7.125H12.75"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.25 10.875H10.5"
              stroke="#191D31"
              strokeWidth="0.9375"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        title="Communication & Identity"
      >
        <CommunicationIdentityFields />
      </CareAccordionSection>
    </Accordion>
  );
}
