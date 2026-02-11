import React from "react";
import Select, {
  OptionProps,
  MultiValueProps,
  StylesConfig,
} from "react-select";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { customSelectStyles as userCustomStyles } from "@/styles/react-select";
import { Search, User, X } from "lucide-react";
import { useStaff } from "@/hooks/staff/useStaff";
import { Staff } from "@/types/staff";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VisitScheduleForm } from "@/pages/app/clients/schemas/visit-schedule";

/**
 * CarerSelector with clearer visual difference for already-picked carers
 */
type CarerOption = {
  value: string;
  label: string;
  email: string;
  firstname: string;
  lastname: string;
  profileImage: string;
};

export default function CarerSelector() {
  const { control } = useFormContext<VisitScheduleForm>();
  const { data, isLoading } = useStaff();
  const carers = data ? data.staffs : [];

  // watch both naming variants (avoidCarers vs avoidedCarers) so this works with either form shape
  const preferredIds = useWatch({ control, name: "preferredCarers" }) as
    | string[]
    | undefined;

  // portal target for menus (if used inside sheet)
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(
    null,
  );
  React.useLayoutEffect(() => {
    if (containerRef.current) setPortalTarget(containerRef.current);
    else if (typeof document !== "undefined") setPortalTarget(document.body);
  }, []);

  const getInitials = (firstname: string, lastname: string) =>
    `${firstname[0]}${lastname[0]}`.toUpperCase();

  // build options
  const baseOptions: CarerOption[] = React.useMemo(
    () =>
      carers.map((c: Staff) => ({
        value: c.id,
        label: `${c.user.firstname} ${c.user.lastname}`,
        email: c.user.email,
        firstname: c.user.firstname,
        lastname: c.user.lastname,
        profileImage: c.profilePicture || "",
      })),
    [carers],
  );

  const preferredOptions = baseOptions;

  // merge user styles and ensure menu portal z-index
  const customStyles: StylesConfig<any, true> = {
    ...(userCustomStyles as StylesConfig<any, true>),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  /* -----------------------
     Custom Components
     ----------------------- */

  // Option component: will show badge + dim the row if disabled (already selected in the other list)
  const CarerOption = (props: OptionProps<CarerOption, true>) => {
    const { data, innerRef, innerProps, isDisabled } = props;

    // determine if this option is already chosen in preferred/avoid lists
    const inPreferred = (preferredIds ?? []).includes(data.value);

    // show "Preferred" badge when inPreferred and we're inside avoid list's menu (so user knows)
    // isDisabled will be true when we disable via isOptionDisabled below
    return (
      <div
        ref={innerRef}
        {...innerProps}
        className={`flex items-center p-3 cursor-pointer ${
          isDisabled ? "opacity-60 pointer-events-none" : "hover:bg-gray-50"
        }`}
      >
        <Avatar
          className={`w-10 h-10 font-semibold mr-3 border  border-emerald-100 text-primary `}
        >
          {data.profileImage ? (
            <AvatarImage
              src={data.profileImage}
              alt={`${data.firstname} avatar`}
            />
          ) : null}
          <AvatarFallback className="font-semibold">
            {getInitials(data.firstname, data.lastname)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate font-semibold text-sm">{data.label}</div>
            {inPreferred && (
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  inPreferred
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {inPreferred ? "Preferred" : "Avoid"}
              </span>
            )}
          </div>

          <div className="text-xs text-muted-foreground truncate">
            {data.email}
          </div>
        </div>
      </div>
    );
  };

  // MultiValue for Preferred: avatar + label styled green
  const PreferredMultiValue = (props: MultiValueProps<CarerOption, true>) => {
    const { data, removeProps } = props;
    return (
      <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-1 rounded-lg mr-2 ">
        <User size={15} />
        <span className="font-medium text-xs truncate">{data.label}</span>
        <div
          onClick={removeProps?.onClick}
          aria-label={`Remove ${data.label}`}
          className="hover:bg-black/10 cursor-pointer rounded-full p-0.5"
        >
          <X className="w-3 h-3" />
        </div>
      </div>
    );
  };

  /* -----------------------
     Render Controllers
     ----------------------- */

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Preferred Carers */}
      <Controller
        name="preferredCarers"
        control={control}
        render={({ field }) => {
          const value = (field.value ?? []) as string[];
          const selected = preferredOptions.filter((o) =>
            value.includes(o.value),
          );

          return (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Preferred Carers
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                Select carers who should be prioritised for this client
              </p>

              <Select
                isMulti
                options={preferredOptions}
                value={selected}
                isLoading={isLoading}
                onChange={(opts) =>
                  field.onChange((opts ?? []).map((o: any) => o.value))
                }
                placeholder={
                  <span className="flex gap-2 items-center">
                    <Search className=" text-gray-400 w-4 h-4" /> Search for
                    preferred carers...
                  </span>
                }
                styles={customStyles}
                components={{
                  Option: CarerOption,
                  MultiValue: PreferredMultiValue as any,
                }}
                menuPortalTarget={portalTarget}
                menuPosition="fixed"
                menuShouldScrollIntoView={false}
                closeMenuOnScroll={false}
                classNamePrefix="react-select"
              />
            </div>
          );
        }}
      />
    </div>
  );
}
