"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteEventAction } from "@/lib/actions/events";
import { toast } from "sonner";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Cancel this event?")) return;
    const result = await deleteEventAction(eventId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Event cancelled");
      router.refresh();
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
