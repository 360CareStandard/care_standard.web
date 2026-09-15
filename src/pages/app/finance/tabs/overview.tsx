import { useFinanceOverview } from "@/hooks/finance/useFinance";
import StatCard from "../components/stat-card";
import {
  OutstandingIcon,
  OverdueIcon,
  PaidIcon,
  TotalBilledIcon,
} from "../components/icons";
import { DataTable } from "../components/overview-table/data-table";
import { overviewFinancecolumns } from "../components/overview-table/column";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { FinanceApi } from "@/api/finance";

const OverviewTab = () => {
  const { data: overviewData, isLoading, isError } = useFinanceOverview();
  // const { data: exportData, isLoading: isExportLoading } = useExportInvoices();
  const handleExport = async () => {
    try {
      const response = await FinanceApi.exportInvoice();

      const blob = new Blob([response?.data]);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "invoices.xlsx";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting invoices:", error);
    }
  };

  const recentInvoices = Array.isArray(overviewData?.recentInvoices)
    ? overviewData?.recentInvoices
    : [];
  const stats = [
    {
      title: "Total Billed",
      value: overviewData?.analytics.totalBilled ?? 0,

      description: "All time",
      icon: <TotalBilledIcon />,
    },
    {
      title: "Outstanding",
      value: overviewData?.analytics.outstanding ?? 0,
      description: "Awaiting payment",
      icon: <OutstandingIcon />,
    },
    {
      title: "Paid",
      value: overviewData?.analytics.paid ?? 0,
      description: "Received",
      icon: <PaidIcon />,
    },
    {
      title: "Overdue",
      value: overviewData?.analytics.overdue ?? 0,
      description: "Needs attention",
      icon: <OverdueIcon />,
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            {...stat}
            isLoading={isLoading}
            isError={isError}
          />
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center gap-4 justify-between">
          <h2 className="text-xl font-semibold">Recent Invoices</h2>
          <Button
            variant="outline"
            onClick={() => handleExport()}
            // disabled={isExportLoading}
            className=" mb-2 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="overflow-auto rounded-lg mt-4 bg-white pb-4 shadow">
          <DataTable
            columns={overviewFinancecolumns}
            data={recentInvoices}
            loading={isLoading}
          />
        </div>
      </div>
    </>
  );
};

export default OverviewTab;
