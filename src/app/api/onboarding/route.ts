import { cookies } from "next/headers";
import { db } from "@/db";
import { users, weightLogs } from "@/db/schema";
import { USER_COOKIE } from "@/lib/constants";
import { createPlan } from "@/lib/plan-generator";
import { parseProfile } from "@/lib/profile";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = parseProfile(body);
  if ("error" in parsed) return Response.json({ error: parsed.error }, { status: 400 });
  const p = parsed.data;

  await ensureSeeded();
  const [user] = await db.insert(users).values(p).returning();
  if (!user) return Response.json({ error: "Could not create profile" }, { status: 500 });
  await db.insert(weightLogs).values({ userId: user.id, weightKg: p.weightKg });
  await createPlan(user.id, p);

  (await cookies()).set(USER_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 2,
  });
  return Response.json({ ok: true });
}
