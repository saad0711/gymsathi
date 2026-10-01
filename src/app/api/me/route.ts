import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { USER_COOKIE } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Right to deletion: removes the profile and everything linked to it. */
export async function DELETE() {
  const user = await getCurrentUser();
  if (user) await db.delete(users).where(eq(users.id, user.id));
  (await cookies()).delete(USER_COOKIE);
  return Response.json({ ok: true });
}
