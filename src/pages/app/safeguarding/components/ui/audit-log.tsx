import { SafeguardingReportAudit } from "@/types/safeguarding";
import dayjs from "dayjs";
import { formatStatus } from "../../utils";

const AuditLogUi = ({ item }: { item: SafeguardingReportAudit[] }) => {
  return (
    <ul className="-mb-4">
      {item.map((i) => (
        <li key={i.id}>
          <div className="relative pb-4">
            <span
              className="absolute top-2 left-3.5 -ml-px h-full w-0.5 bg-gray-200"
              aria-hidden="true"
            />
            <div className="relative flex items-start space-x-3">
              <div>
                <div className="relative px-1">
                  <div className="h-5 w-5 bg-gray-500 rounded-full ring-8 ring-white flex items-center justify-center">
                    <span className="h-2 w-2 bg-white rounded-full" />
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1 py-0">
                <div className="text-md text-gray-500">
                  <div>
                    <p className="font-medium text-gray-900 text-sm mr-2">
                      {formatStatus(i.newValue || "")}
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-sm">
                    by {i.user.firstname} {i.user.lastname},{" "}
                    {i.createdAt
                      ? dayjs(i.createdAt).format("D MMM YYYY, hh:mm A")
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AuditLogUi;
