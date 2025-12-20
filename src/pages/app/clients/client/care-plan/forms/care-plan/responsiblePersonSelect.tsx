// components/assessments/ResponsiblePersonSelect.tsx
import * as React from "react";
import Select, {
  OptionProps,
  SingleValueProps,
  StylesConfig,
  components,
} from "react-select";
import { Controller, useFormContext } from "react-hook-form";
import { Search, User, X } from "lucide-react";

import { customSelectStyles as userCustomStyles } from "@/styles/react-select";
import { AssessmentForm } from "../../../../schemas/care-assesment";

type Carer = {
  id: string;
  name: string;
  email: string;
  initials: string;
  skills?: string[];
};

type Option = {
  value: string; // id
  label: string; // name
  email: string;
  initials: string;
  skills?: string[];
};

/**
 * Single-responsible-person select
 * visually consistent with Preferred/Avoid Carers
 */
export function ResponsiblePersonSelect() {
  const { control, setValue } = useFormContext<AssessmentForm>();

  // TODO: replace with real carers list from API / props
  const carers: Carer[] = [
    {
      id: "b9a680cb-3c6b-4680-86e5-06b476399eb8",
      name: "John Malik",
      email: "john.john@careservice.com",
      initials: "JM",
      skills: ["Medication", "Dementia Care"],
    },
    {
      id: "2a4270a9-4d47-442a-8fd8-dc1d839ab722",
      name: "A. Brown",
      email: "anna.brown@careservice.com",
      initials: "AB",
      skills: ["Moving & Handling", "PEG Feeding"],
    },
    {
      id: "52ec9599-6113-4114-b6d0-333977053459",
      name: "S. Johnson",
      email: "sarah.john@careservice.com",
      initials: "SJ",
      skills: ["Medication", "Dementia Care"],
    },
  ];

  const options: Option[] = carers.map((c) => ({
    value: c.id,
    label: c.name,
    email: c.email,
    initials: c.initials,
    skills: c.skills,
  }));

  // portal container (inside sheet)
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(
    null
  );
  React.useLayoutEffect(() => {
    if (containerRef.current) setPortalTarget(containerRef.current);
    else if (typeof document !== "undefined") setPortalTarget(document.body);
  }, []);

  const customStyles: StylesConfig<Option, false> = {
    ...(userCustomStyles as StylesConfig<Option, false>),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    // slightly taller control to match design
    control: (base, state) => ({
      ...base,
      borderRadius: 8,
      borderColor: state.isFocused ? "#16a34a" : base.borderColor,
      boxShadow: "none",
      "&:hover": {
        borderColor: state.isFocused ? "#16a34a" : base.borderColor,
      },
    }),
    valueContainer: (base) => ({
      ...base,
      paddingLeft: 12,
      paddingRight: 8,
    }),
  };

  /* --------- Custom components ---------- */

  const CarerOption = (props: OptionProps<Option, false>) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="flex items-center p-2 cursor-pointer hover:bg-gray-50"
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold mr-3 bg-emerald-100 text-emerald-800">
          {data.initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate font-medium text-sm">{data.label}</div>
          </div>
        </div>
      </div>
    );
  };

  // IMPORTANT: wrap our pill layout with components.SingleValue
  const ResponsibleSingleValue = (props: SingleValueProps<Option, false>) => {
    const { data } = props;
    return (
      <components.SingleValue {...props}>
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
          <User size={14} />
          <span className="text-xs font-medium truncate">{data.label}</span>
        </div>
      </components.SingleValue>
    );
  };

  const ClearIndicator = (props: any) => (
    <components.ClearIndicator {...props}>
      <X className="w-4 h-4 text-gray-400" />
    </components.ClearIndicator>
  );

  // const DropdownIndicator = (props: any) => (
  //   <components.DropdownIndicator {...props}>
  //     <span className="text-gray-500">▾</span>
  //   </components.DropdownIndicator>
  // );

  /* --------- Render inside RHF Controller ---------- */

  return (
    <div ref={containerRef}>
      <Controller
        name="responsiblePersonId"
        control={control}
        render={({ field }) => {
          const selected = options.find((o) => o.value === field.value) ?? null;

          return (
            <Select
              isMulti={false}
              options={options}
              value={selected}
              onChange={(opt) => {
                const o = opt as Option | null;
                field.onChange(o?.value ?? "");
                // keep name field in sync for API
                setValue("responsiblePersonName", o?.label ?? "", {
                  shouldDirty: true,
                });
              }}
              placeholder={
                <span className="flex gap-2 items-center text-sm text-gray-400">
                  <Search className="w-4 h-4" />
                  Select …
                </span>
              }
              styles={customStyles}
              components={{
                Option: CarerOption,
                SingleValue: ResponsibleSingleValue,
                ClearIndicator,
                // DropdownIndicator,
              }}
              menuPortalTarget={portalTarget}
              menuPosition="fixed"
              menuShouldScrollIntoView={false}
              closeMenuOnScroll={false}
              classNamePrefix="react-select"
            />
          );
        }}
      />
    </div>
  );
}
