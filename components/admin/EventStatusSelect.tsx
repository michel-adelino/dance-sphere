"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { moderateEventAction } from "@/lib/actions/events";
import { toast } from "sonner";

export function EventStatusSelect({
  eventId,
  currentStatus,
}: {
  eventId: string;
  currentStatus: string;
}) {
  const router = useRouter();

  async function handleChange(status: string) {
    const result = await moderateEventAction(
      eventId,
      status as "draft" | "published" | "cancelled"
    );
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Event status updated");
      router.refresh();
    }
  }

  return (
    <Select value={currentStatus} onValueChange={handleChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="draft">Draft</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
}
