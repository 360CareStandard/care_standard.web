import React, { useId, useMemo } from "react";

export type BodyRegionId =
  | "head"
  | "neck"
  | "chest"
  | "abdomen"
  | "pelvis"
  | "left_shoulder"
  | "right_shoulder"
  | "left_upper_arm"
  | "right_upper_arm"
  | "left_forearm"
  | "right_forearm"
  | "left_hand"
  | "right_hand"
  | "left_thigh"
  | "right_thigh"
  | "left_knee"
  | "right_knee"
  | "left_lower_leg"
  | "right_lower_leg"
  | "left_foot"
  | "right_foot";

export type BodyMapView = "front" | "back";

export interface BodyMapProps {
  /** Saved API value, e.g. "Abdomen", "Left Arm", or "Right Leg". */
  bodyPart?: string | null;
  instruction?: string | null;
  /** The supplied artwork only contains a front view. */
  view?: BodyMapView;
  interactive?: boolean;
  onBodyPartChange?: (bodyPart: string) => void;
  className?: string;
  /** Optional accessible label for the illustration. */
  ariaLabel?: string;
}

interface Region {
  id: BodyRegionId;
  label: string;
  d: string;
}

const LABELS: Record<BodyRegionId, string> = {
  head: "Head",
  neck: "Neck",
  chest: "Chest",
  abdomen: "Abdomen",
  pelvis: "Pelvic area",
  left_shoulder: "Left Shoulder",
  right_shoulder: "Right Shoulder",
  left_upper_arm: "Left Upper Arm",
  right_upper_arm: "Right Upper Arm",
  left_forearm: "Left Forearm",
  right_forearm: "Right Forearm",
  left_hand: "Left Hand",
  right_hand: "Right Hand",
  left_thigh: "Left Thigh",
  right_thigh: "Right Thigh",
  left_knee: "Left Knee",
  right_knee: "Right Knee",
  left_lower_leg: "Left Lower Leg",
  right_lower_leg: "Right Lower Leg",
  left_foot: "Left Foot",
  right_foot: "Right Foot",
};

const REGIONS: Region[] = [
  {
    id: "head",
    label: LABELS.head,
    d: "M61 1 L87 1 L94 12 L93 27 L86 38 L62 38 L55 27 L54 12 Z",
  },
  { id: "neck", label: LABELS.neck, d: "M68 35 L80 35 L84 54 L64 54 Z" },
  {
    id: "right_shoulder",
    label: LABELS.right_shoulder,
    d: "M62 49 L69 53 L68 76 L48 84 L43 67 Z",
  },
  {
    id: "left_shoulder",
    label: LABELS.left_shoulder,
    d: "M80 49 L85 67 L100 84 L79 76 Z",
  },
  {
    id: "chest",
    label: LABELS.chest,
    d: "M48 54 L64 50 L84 50 L100 54 L105 105 L43 105 Z",
  },
  {
    id: "abdomen",
    label: LABELS.abdomen,
    d: "M43 105 L105 105 L108 143 L40 143 Z",
  },
  {
    id: "pelvis",
    label: LABELS.pelvis,
    d: "M40 143 L108 143 L105 166 L74 178 L43 166 Z",
  },
  {
    id: "right_upper_arm",
    label: LABELS.right_upper_arm,
    d: "M31 83 L48 87 L40 125 L23 123 Z",
  },
  {
    id: "right_forearm",
    label: LABELS.right_forearm,
    d: "M23 123 L40 125 L31 166 L13 164 Z",
  },
  {
    id: "right_hand",
    label: LABELS.right_hand,
    d: "M13 164 L31 166 L25 198 L2 198 Z",
  },
  {
    id: "left_upper_arm",
    label: LABELS.left_upper_arm,
    d: "M100 87 L117 83 L125 123 L108 125 Z",
  },
  {
    id: "left_forearm",
    label: LABELS.left_forearm,
    d: "M108 125 L125 123 L135 164 L117 166 Z",
  },
  {
    id: "left_hand",
    label: LABELS.left_hand,
    d: "M117 166 L135 164 L146 198 L123 198 Z",
  },
  {
    id: "right_thigh",
    label: LABELS.right_thigh,
    d: "M43 162 L74 174 L73 222 L48 222 Z",
  },
  {
    id: "right_knee",
    label: LABELS.right_knee,
    d: "M48 222 L73 222 L73 240 L50 240 Z",
  },
  {
    id: "right_lower_leg",
    label: LABELS.right_lower_leg,
    d: "M50 240 L73 240 L76 294 L56 294 Z",
  },
  {
    id: "right_foot",
    label: LABELS.right_foot,
    d: "M56 294 L76 294 L79 318 L46 318 Z",
  },
  {
    id: "left_thigh",
    label: LABELS.left_thigh,
    d: "M74 174 L105 162 L100 222 L75 222 Z",
  },
  {
    id: "left_knee",
    label: LABELS.left_knee,
    d: "M75 222 L100 222 L98 240 L75 240 Z",
  },
  {
    id: "left_lower_leg",
    label: LABELS.left_lower_leg,
    d: "M75 240 L98 240 L92 294 L72 294 Z",
  },
  {
    id: "left_foot",
    label: LABELS.left_foot,
    d: "M72 294 L92 294 L102 318 L69 318 Z",
  },
];

const NORMALIZED_LABELS: Record<string, BodyRegionId> = Object.entries(
  LABELS,
).reduce(
  (acc, [id, label]) => {
    acc[normalize(label)] = id as BodyRegionId;
    acc[normalize(id)] = id as BodyRegionId;
    return acc;
  },
  {} as Record<string, BodyRegionId>,
);

function normalize(value: string) {
  return value.toLowerCase().trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

const ALIASES: Record<string, BodyRegionId[]> = {
  "left arm": ["left_shoulder", "left_upper_arm", "left_forearm", "left_hand"],
  "right arm": [
    "right_shoulder",
    "right_upper_arm",
    "right_forearm",
    "right_hand",
  ],
  "left leg": ["left_thigh", "left_knee", "left_lower_leg", "left_foot"],
  "right leg": ["right_thigh", "right_knee", "right_lower_leg", "right_foot"],
  arm: [
    "left_shoulder",
    "right_shoulder",
    "left_upper_arm",
    "right_upper_arm",
    "left_forearm",
    "right_forearm",
  ],
  leg: [
    "left_thigh",
    "right_thigh",
    "left_knee",
    "right_knee",
    "left_lower_leg",
    "right_lower_leg",
  ],
  pelvis: ["pelvis"],
  "pelvic area": ["pelvis"],
};

function resolveRegions(value?: string | null): BodyRegionId[] {
  if (!value) return [];
  const key = normalize(value);
  if (ALIASES[key]) return ALIASES[key];
  const exact = NORMALIZED_LABELS[key];
  if (exact) return [exact];

  if (key === "left upper limb") return ALIASES["left arm"];
  if (key === "right upper limb") return ALIASES["right arm"];
  if (key === "left lower limb") return ALIASES["left leg"];
  if (key === "right lower limb") return ALIASES["right leg"];
  return [];
}

const BODY_PATH =
  "M79 54.282H68.824c.038 4.586-1.385 8.232-6.538 11.407-7.58 4.67-9.766 1.589-16.504 5.364-7.18 4.022-9.839 16.322-12.894 25.27-2.701 7.914-3.117 16.702-4.642 24.654-.96 5.011-3.727 6.429-4.641 12.172-1.757 11.036-3.522 24.117-4.596 34.05-.276 2.561-2.591 3.421-3.874 4.538-1.219 1.06-2.22 1.889-3.999 3.642-.543.535-.672 1.678-1.192 2.751-.444.915-1.52 1.539-1.807 2.352-.817 2.305-3.163 3.662-2.55 4.548.571.823 2.963-.165 4.11-.981.735-.523 1.362-1.352 1.457-2.282.916-.331 2.108-2.771 2.696-2.658.255.049.358 4.46-.575 7.508-.363 1.188-.67 1.746-.674 2.528-.006 1.006-.16 3.338-.28 4.41-.178 1.575.308 3.032 1.256 3.104.221.017 1.34-.282 1.348-2.017.003-.633.08-1.127.196-1.94.2-1.41 1.494-4.138 1.725-5.36.073-.386.352-1.376.62-1.344.082.01-.405 2.901-.686 4.113-.311 1.344.145 2.27-.003 5.033-.129 2.425.035 3.81 1.266 3.857.389.015 1.558.013 1.588-3.536.01-1.045.366-2.909.633-4.717.196-1.328.213-2.719 1.035-4.298-.045 1.672-.144 1.89-.228 3.518-.052 1-.405 6.609-.105 4.25.126-.994-1.25 4.052.94 4.15.731.033 1.703-.889 2.127-7.134.124-1.828.436-4.288.92-5.66.278 1.198.342 1.72.34 2.309 0 .417.182 1.77-.008 3.119-.275 1.938-.424 3.24.59 3.353.563.063 1.243-.686 1.658-2.026.144-.468.1-1.138.254-1.678.516-1.826.189-3.734.364-4.958.24-1.666.536-2.492.768-3.213.238-.741.558-2.94.586-5.338.029-2.398-.968-2.465-.583-8.918.384-6.453 8.154-18.314 9.738-27.921.473-2.867 1.92-5.448 2.661-8.237 1.276-4.802 1.526-9.863 3.064-14.587 1.138-3.498 4.521-10.065 4.521-10.065s3.182 11.689 3.818 15.85c1.985 12.977-3.566 24.173-6.04 38.02-1.97 11.022-4.033 18.866-3.904 33.362.153 17.179 3.793 32.78 4.084 42.012.037 1.167-1.263 5.772-1.05 10.691.214 4.919-.912 11.933-.846 18.338.154 15.018 4.941 26.356 6.856 33.113.94 3.315 2.014 8.499 2.072 11.147.078 3.488-1.054 3.863-1.29 5.849-.171 1.447 1.404 3.98 1.432 4.53 0 0-1.043 1.238-1.213 2-.24 1.068.41 2.044-.065 2.763-.95 1.44-.887.8-1.376 1.576-.506.802-3.655 4.06-4.223 5.238-.448.93-.328 1.605-.152 2.641.244 1.439.81 2.807 2.358 2.398.478.321 1.065 1.026 1.485.333.117.795 1.684.863 2.444.514 1.09.992 3.102.854 4.167-.008 1.423 1.224 5.613.643 5.96-1.689 1.357-.592 1.717-1.758 1.496-3.055-.37-2.172-.335-4.06-.712-6.231-.295-1.69-.157-4.057.783-5.499 1.485-2.278.777-6.197.323-6.985-.453-.787-.22-15.214.078-23.764.276-7.938 2.694-15.697 3.063-23.632.157-3.378-.512-6.76-.365-10.138.199-4.552 1.255-9.03 1.678-13.566.389-4.172.263-8.388.79-12.545 1.88-14.845 6.893-16.859 8.44-44.09m0 0c1.548 27.231 6.56 29.245 8.441 44.09.527 4.157.401 8.374.79 12.545.423 4.537 1.48 9.014 1.678 13.566.147 3.379-.522 6.76-.365 10.138.37 7.935 2.787 15.693 3.063 23.632.298 8.551.531 22.976.078 23.764-.454.788-1.162 4.707.323 6.985.94 1.442 1.078 3.808.783 5.499-.377 2.17-.343 4.059-.712 6.23-.22 1.298.139 2.464 1.496 3.056.347 2.332 4.537 2.913 5.96 1.689 1.065.862 3.078 1 4.167.008.76.349 2.327.28 2.444-.514.42.693 1.007-.012 1.485-.333 1.548.409 2.114-.96 2.358-2.398.176-1.036.296-1.712-.152-2.64-.568-1.18-3.717-4.437-4.223-5.239-.489-.776-.426-.136-1.376-1.576-.475-.72.174-1.695-.065-2.763-.17-.762-1.213-2-1.213-2 .028-.55 1.603-3.083 1.432-4.53-.236-1.986-1.368-2.36-1.29-5.849.058-2.648 1.132-7.832 2.072-11.147 1.915-6.758 6.702-18.096 6.856-33.113.066-6.406-1.06-13.419-.847-18.338s-1.086-9.524-1.05-10.691c.292-9.231 3.932-24.833 4.085-42.012.13-14.497-1.933-22.34-3.903-33.362-2.475-13.847-8.026-25.043-6.041-38.02.636-4.161 3.818-15.85 3.818-15.85s3.383 6.567 4.521 10.065c1.538 4.725 1.788 9.786 3.064 14.587.74 2.789 2.188 5.37 2.66 8.237 1.585 9.607 9.355 21.468 9.74 27.921s-.613 6.52-.584 8.918c.028 2.397.348 4.597.586 5.338.232.721.529 1.547.768 3.213.176 1.224-.152 3.132.365 4.958.152.54.109 1.21.254 1.678.414 1.34 1.094 2.089 1.657 2.026 1.014-.114.865-1.415.59-3.353-.19-1.348-.008-2.702-.009-3.119-.002-.59.063-1.111.341-2.31.484 1.373.796 3.833.92 5.661.424 6.245 1.396 7.167 2.128 7.134 2.189-.098.813-5.144.94-4.15.299 2.359-.054-3.25-.106-4.25-.084-1.628-.183-1.846-.228-3.518.822 1.58.839 2.97 1.035 4.298.267 1.808.624 3.672.633 4.717.03 3.549 1.2 3.551 1.588 3.536 1.23-.047 1.395-1.432 1.266-3.857-.148-2.764.308-3.689-.003-5.033-.281-1.212-.768-4.103-.685-4.113.267-.032.546.958.619 1.344.231 1.222 1.524 3.95 1.726 5.36.116.813.192 1.307.195 1.94.008 1.735 1.127 2.034 1.348 2.017.948-.072 1.434-1.53 1.257-3.104-.12-1.072-.275-3.404-.28-4.41-.006-.782-.312-1.34-.675-2.528-.933-3.047-.83-7.46-.575-7.508.588-.113 1.78 2.327 2.696 2.658.095.93.722 1.759 1.457 2.282 1.147.816 3.539 1.804 4.11.98.613-.885-1.733-2.242-2.55-4.547-.287-.813-1.363-1.437-1.807-2.352-.52-1.073-.649-2.216-1.192-2.751-1.78-1.753-2.78-2.582-3.999-3.642-1.283-1.117-3.598-1.977-3.874-4.537-1.074-9.934-2.839-23.014-4.596-34.051-.914-5.743-3.68-7.16-4.641-12.172-1.525-7.951-1.94-16.74-4.642-24.653-3.055-8.95-5.714-21.25-12.894-25.271-6.738-3.775-8.923-.693-16.504-5.364-5.153-3.175-6.576-6.821-6.538-11.407H78.998";
const HEAD_PATH =
  "M79 59.397c-3.914 0-7.324-2.644-10.175-5.115-.86-.746-1.197-4.034-1.914-4.866-.748.224-2.416-.196-2.946-1.32-.736-1.56-2.257-4.293-2.194-7.266.03-1.354.961-3.111 2.909-3.104-.284-9.913 5.816-16.699 14.317-16.7 8.5 0 14.6 6.786 14.319 16.7 1.947-.009 2.88 1.748 2.909 3.103.063 2.973-1.457 5.705-2.193 7.266-.53 1.124-2.199 1.544-2.946 1.32-.717.833-1.053 4.12-1.914 4.866-2.85 2.472-6.26 5.116-10.173 5.117-3.914 0-7.323-2.645-10.173-5.117-.86-.746-1.197-4.033-1.914-4.866-.747.224-2.415-.196-2.946-1.32-.735-1.56-2.256-4.293-2.192-7.266.029-1.355.96-3.112 2.908-3.104-.282-9.913 5.819-16.699 14.32-16.699 8.5.001 14.6 6.787 14.316 16.7 1.948-.007 2.88 1.75 2.909 3.104.063 2.973-1.458 5.705-2.194 7.266-.53 1.125-2.198 1.544-2.946 1.32-.717.832-1.053 4.12-1.914 4.866-2.85 2.47-6.26 5.115-10.174 5.115";

export const BODY_PART_LABEL_TO_ID: Record<string, BodyRegionId> = {
  ...(Object.fromEntries(
    Object.entries(LABELS).map(([id, label]) => [label, id]),
  ) as Record<string, BodyRegionId>),
  Pelvis: "pelvis",
  "Left Arm": "left_upper_arm",
  "Right Arm": "right_upper_arm",
  "Left Leg": "left_thigh",
  "Right Leg": "right_thigh",
};

export const BODY_PART_ID_TO_LABEL = LABELS;

export const BodyMap: React.FC<BodyMapProps> = ({
  bodyPart,
  instruction,
  view = "front",
  interactive = false,
  onBodyPartChange,
  className = "",
  ariaLabel = "Human body map, front view",
}) => {
  // Sanitize useId() colons so it works reliably inside SVG clipPath attributes
  const rawId = useId();
  const clipId = useMemo(() => `bodymap-${rawId.replace(/[:]/g, "")}`, [rawId]);

  const selectedIds = useMemo(
    () => new Set(resolveRegions(bodyPart)),
    [bodyPart],
  );
  const canSelect = interactive && typeof onBodyPartChange === "function";

  if (view === "back") {
    return (
      <div className={`w-full ${className}`}>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          A back-view illustration was not included in the supplied SVG. The
          back view is therefore not rendered; provide a posterior-view SVG
          before enabling back-region selection.
        </div>
      </div>
    );
  }

  const selectRegion = (region: Region) => {
    if (canSelect) onBodyPartChange?.(region.label);
  };

  return (
    <div className={`flex w-full flex-col items-center ${className}`}>
      <div className="w-full max-w-[280px] rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <svg
          viewBox="0 0 147.998 318.455"
          className="block h-auto max-h-[560px] w-full"
          role="group"
          aria-label={ariaLabel}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
              <path d={BODY_PATH} transform="translate(-5 -20.526)" />
              <path d={HEAD_PATH} transform="translate(-5 -20.526)" />
            </clipPath>
          </defs>

          {/* Original uploaded silhouette, kept as the neutral base artwork. */}
          <g transform="translate(-5 -20.526)">
            <path
              d={BODY_PATH}
              fill="#f8fafc"
              stroke="#334155"
              strokeWidth=".65"
              strokeLinejoin="round"
            />
            <path
              d={HEAD_PATH}
              fill="#f8fafc"
              stroke="#334155"
              strokeWidth=".65"
              strokeLinejoin="round"
            />
          </g>

          {/* Region hit areas are clipped so they never spill outside the artwork. */}
          <g clipPath={`url(#${clipId})`}>
            {REGIONS.map((region) => {
              const selected = selectedIds.has(region.id);
              return (
                <path
                  key={region.id}
                  d={region.d}
                  fill={
                    selected ? "#3b82f6" : canSelect ? "#cbd5e1" : "transparent"
                  }
                  fillOpacity={selected ? 0.82 : 0.025}
                  stroke={
                    selected ? "#1d4ed8" : canSelect ? "#94a3b8" : "transparent"
                  }
                  strokeWidth={selected ? 1.15 : 0.45}
                  strokeOpacity={selected ? 1 : canSelect ? 0.7 : 0}
                  strokeLinejoin="round"
                  className={
                    canSelect
                      ? "cursor-pointer transition-colors duration-150 hover:fill-blue-300 hover:fill-opacity-60 focus:outline-none"
                      : ""
                  }
                  role={canSelect ? "button" : "img"}
                  tabIndex={canSelect ? 0 : -1}
                  aria-label={region.label}
                  aria-pressed={canSelect ? selected : undefined}
                  onClick={() => selectRegion(region)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selectRegion(region);
                    }
                  }}
                >
                  <title>{region.label}</title>
                </path>
              );
            })}
          </g>

          {/* Re-stroke the original contour above the interactive overlays. */}
          <g transform="translate(-5 -20.526)" pointerEvents="none">
            <path
              d={BODY_PATH}
              fill="none"
              stroke="#334155"
              strokeWidth=".65"
              strokeLinejoin="round"
            />
            <path
              d={HEAD_PATH}
              fill="none"
              stroke="#334155"
              strokeWidth=".65"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {/* <div className="mt-3 w-full max-w-[280px]" aria-live="polite">
        {bodyPart ? (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-center">
            <p className="text-sm font-semibold text-blue-900">
              Selected region: <span className="text-blue-700">{bodyPart}</span>
            </p>
            {instruction ? (
              <p className="mt-0.5 text-xs text-slate-600">
                Instruction:{" "}
                <span className="font-medium text-slate-800">
                  {instruction}
                </span>
              </p>
            ) : null}
            {resolveRegions(bodyPart).length === 0 ? (
              <p className="mt-1 text-xs text-amber-700">
                This value is not mapped to a front-view region.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs text-slate-500">
            {interactive ? "Select a body region" : "No body region specified"}
          </p>
        )}
      </div> */}
    </div>
  );
};

export default BodyMap;
