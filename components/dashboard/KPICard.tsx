import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function KPICard({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
}) {
  return (
    <Card className="border-border bg-surface">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="font-display text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
