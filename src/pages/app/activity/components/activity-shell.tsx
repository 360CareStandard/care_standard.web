// src/components/activity/ActivityShell.tsx

import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityShellProps {
  controls: ReactNode;
  children: ReactNode;
}

export function ActivityShell({ controls, children }: ActivityShellProps) {
  return (
    <Card className="mt-4 rounded-lg border shadow-none">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
        <CardTitle className="text-sm font-medium">Activity Logs</CardTitle>

        {controls}
      </CardHeader>

      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
