"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRoleAction } from "@/lib/actions/auth";
import { toast } from "sonner";

export function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const router = useRouter();

  async function handleChange(role: string) {
    const result = await updateUserRoleAction(
      userId,
      role as "dancer" | "organizer" | "admin"
    );
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Role updated");
      router.refresh();
    }
  }

  return (
    <Select value={currentRole} onValueChange={handleChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="dancer">Dancer</SelectItem>
        <SelectItem value="organizer">Organizer</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
