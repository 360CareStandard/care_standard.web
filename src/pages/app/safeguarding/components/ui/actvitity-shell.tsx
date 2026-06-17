import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ActivityShell({
  children,
  controls,
}: {
  children: React.ReactNode;
  controls: React.ReactNode;
}) {
  return (
    <Card className="mt-4 rounded-lg border shadow-none">
      <CardHeader className="flex flex-row items-center  border-b pb-3">
        {/* <CardTitle className="text-sm font-medium">{""}</CardTitle> */}
        {controls}
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
