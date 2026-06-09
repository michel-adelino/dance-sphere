"use client";

import { Download } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

type Participant = {
  firstName: string;
  lastName: string;
  email: string;
  quantity: number;
  createdAt: Date;
  eventTitle: string;
};

export function ExportCsvButton({ data }: { data: Participant[] }) {
  function exportCsv() {
    const headers = ["Name", "Email", "Event", "Tickets", "Purchased"];
    const rows = data.map((p) => [
      `${p.firstName} ${p.lastName}`,
      p.email,
      p.eventTitle,
      p.quantity,
      format(p.createdAt, "yyyy-MM-dd"),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participants-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (data.length === 0) return null;

  return (
    <Button variant="outline" onClick={exportCsv} className="gap-2">
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
