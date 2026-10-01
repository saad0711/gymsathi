import { cache } from "react";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, type User } from "@/db/schema";
import { LANG_COOKIE, USER_COOKIE, type Lang } from "@/lib/constants";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return v === "bn" ? "bn" : "en";
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const id = (await cookies()).get(USER_COOKIE)?.value;
  if (!id || !UUID_RE.test(id)) return null;
  const [u] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return u ?? null;
});

export function isPremium(user: Pick<User, "premiumUntil">): boolean {
  return !!user.premiumUntil && user.premiumUntil.getTime() > Date.now();
}
