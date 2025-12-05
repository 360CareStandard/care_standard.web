import * as React from "react";
import { Accordion } from "@/components/ui/accordion";
import { CareAccordionSection } from "../wrapper/care-accordion";
import { LivingSituationFields } from "../../forms/home/LivingSituationFields";
import { AccessSecurityFields } from "../../forms/home/AccessSecurityFields";
import { EnvironmentEquipmentFields } from "../../forms/home/EnvironmentEquipmentFields";

export function HomeSetupAccordion() {
  // optional: control which is open
  const [open, setOpen] = React.useState<string | undefined>("living");

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={(v) => setOpen(v as string | undefined)}
      className="w-full space-y-2"
    >
      <CareAccordionSection
        value="living"
        icon={
          <svg
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.86998 8.1525C6.79498 8.145 6.70498 8.145 6.62248 8.1525C4.83748 8.0925 3.41998 6.63 3.41998 4.83C3.41998 2.9925 4.90498 1.5 6.74998 1.5C8.58748 1.5 10.08 2.9925 10.08 4.83C10.0725 6.63 8.65498 8.0925 6.86998 8.1525Z"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.3075 3C13.7625 3 14.9325 4.1775 14.9325 5.625C14.9325 7.0425 13.8075 8.1975 12.405 8.25C12.345 8.2425 12.2775 8.2425 12.21 8.25"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.12001 10.92C1.30501 12.135 1.30501 14.115 3.12001 15.3225C5.18251 16.7025 8.56501 16.7025 10.6275 15.3225C12.4425 14.1075 12.4425 12.1275 10.6275 10.92C8.57251 9.5475 5.19001 9.5475 3.12001 10.92Z"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.755 15C14.295 14.8875 14.805 14.67 15.225 14.3475C16.395 13.47 16.395 12.0225 15.225 11.145C14.8125 10.83 14.31 10.62 13.7775 10.5"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        title="Living Situation"
      >
        <LivingSituationFields />
      </CareAccordionSection>

      <CareAccordionSection
        value="access"
        icon={
          <svg
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.8425 11.1977C13.2975 12.7352 11.085 13.2077 9.14249 12.6002L5.60999 16.1252C5.35499 16.3877 4.85249 16.5452 4.49249 16.4927L2.85749 16.2677C2.31749 16.1927 1.81499 15.6827 1.73249 15.1427L1.50749 13.5077C1.45499 13.1477 1.62749 12.6452 1.87499 12.3902L5.39999 8.86523C4.79999 6.91523 5.26499 4.70273 6.80999 3.16523C9.02249 0.952734 12.615 0.952734 14.835 3.16523C17.055 5.37773 17.055 8.98523 14.8425 11.1977Z"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.16751 13.1172L6.89251 14.8422"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.875 8.25C11.4963 8.25 12 7.74632 12 7.125C12 6.50368 11.4963 6 10.875 6C10.2537 6 9.75 6.50368 9.75 7.125C9.75 7.74632 10.2537 8.25 10.875 8.25Z"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        title="Access & Security"
      >
        <AccessSecurityFields />
      </CareAccordionSection>
      <CareAccordionSection
        value="environment"
        icon={
          <svg
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.5 9.66007V8.34007C1.5 7.56007 2.1375 6.91507 2.925 6.91507C4.2825 6.91507 4.8375 5.95507 4.155 4.77757C3.765 4.10257 3.9975 3.22507 4.68 2.83507L5.9775 2.09257C6.57 1.74007 7.335 1.95007 7.6875 2.54257L7.77 2.68507C8.445 3.86257 9.555 3.86257 10.2375 2.68507L10.32 2.54257C10.6725 1.95007 11.4375 1.74007 12.03 2.09257L13.3275 2.83507C14.01 3.22507 14.2425 4.10257 13.8525 4.77757C13.17 5.95507 13.725 6.91507 15.0825 6.91507C15.8625 6.91507 16.5075 7.55257 16.5075 8.34007V9.66007C16.5075 10.4401 15.87 11.0851 15.0825 11.0851C13.725 11.0851 13.17 12.0451 13.8525 13.2226C14.2425 13.9051 14.01 14.7751 13.3275 15.1651L12.03 15.9076C11.4375 16.2601 10.6725 16.0501 10.32 15.4576L10.2375 15.3151C9.5625 14.1376 8.4525 14.1376 7.77 15.3151L7.6875 15.4576C7.335 16.0501 6.57 16.2601 5.9775 15.9076L4.68 15.1651C3.9975 14.7751 3.765 13.8976 4.155 13.2226C4.8375 12.0451 4.2825 11.0851 2.925 11.0851C2.1375 11.0851 1.5 10.4401 1.5 9.66007Z"
              stroke="#025134"
              strokeWidth="0.9375"
              strokeMiterlimit={10}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        title="Environment & Equipment"
      >
        <EnvironmentEquipmentFields />
      </CareAccordionSection>
    </Accordion>
  );
}
