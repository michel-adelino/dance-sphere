import { desc } from "drizzle-orm";
import { getCurrentProfile } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RoleSelect } from "@/components/admin/RoleSelect";
import { format } from "date-fns";

export const metadata = { title: "Manage Users" };

export default async function AdminUsersPage() {
  await getCurrentProfile();
  const users = await db
    .select()
    .from(profiles)
    .orderBy(desc(profiles.createdAt));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Users</h1>
      <p className="mt-2 text-muted">Manage user roles and access</p>

      <div className="mt-8 rounded-2xl border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <RoleSelect userId={user.id} currentRole={user.role} />
                </TableCell>
                <TableCell>{format(user.createdAt, "PP")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
