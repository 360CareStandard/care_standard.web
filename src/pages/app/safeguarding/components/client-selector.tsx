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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SafeguardingFormData } from "@/pages/schemas/safeguarding";
import { useClientScroll } from "@/hooks/client/useClients";

type Option = {
  value: string | undefined;
  label: string | undefined;
  email: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  image: string | undefined;
};

/**
 * Single-client select
 */
export function SafeguardClientSelector() {
  const { control } = useFormContext<SafeguardingFormData>();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useClientScroll({ limit: 10 });

  const clients = data?.pages.flatMap((p) => p?.clients) ?? [];
  // TODO: replace with real clients list from API / props
  const getInitials = (firstname: string, lastname: string) =>
    `${firstname[0]}${lastname[0]}`.toUpperCase();

  const options: Option[] = clients.map((c) => ({
    value: c?.id,
    label: `${c?.firstname} ${c?.lastname}`,
    email: c?.email ?? "",
    image: c?.imageUrl || "",
    firstname: c?.firstname,
    lastname: c?.lastname,
  }));

  // portal container (inside sheet)
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(
    null,
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
  const MenuList = (props: any) => (
    <components.MenuList {...props}>
      {props.children}
      {isFetchingNextPage && (
        <div className="py-2 text-center text-xs text-muted-foreground">
          Loading more…
        </div>
      )}
    </components.MenuList>
  );
  /* --------- Custom components ---------- */

  const CarerOption = (props: OptionProps<Option, false>) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className="flex items-center p-2 cursor-pointer hover:bg-gray-50"
      >
        <Avatar
          className={`w-10 h-10 font-semibold mr-3  bg-white text-emerald-800
                    `}
        >
          {data.image ? (
            <AvatarImage src={data.image} alt={`${data.firstname} avatar`} />
          ) : null}
          <AvatarFallback className="font-semibold">
            {getInitials(data?.firstname || "N", data?.lastname || "A")}
          </AvatarFallback>
        </Avatar>

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
    <div ref={containerRef} className="mt-1">
      <Controller
        name="clientId"
        control={control}
        render={({ field }) => {
          const selected = options.find((o) => o.value === field.value) ?? null;

          return (
            <Select
              isMulti={false}
              options={options}
              isClearable
              isSearchable
              value={selected}
              onChange={(opt) => {
                const o = opt as Option | null;
                field.onChange(o?.value ?? "");
              }}
              placeholder={
                <span className="flex gap-2 items-center text-sm text-gray-400">
                  <Search className="w-4 h-4" />
                  Search client name
                </span>
              }
              styles={customStyles}
              components={{
                Option: CarerOption,
                SingleValue: ResponsibleSingleValue,
                ClearIndicator,
                MenuList,
                // DropdownIndicator,
              }}
              isLoading={isLoading || isFetchingNextPage}
              onMenuScrollToBottom={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
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
