import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, weightLogs } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { weightKg?: unknown } | null;
  const w = Number(body?.weightKg);
  if (!Number.isFinite(w) || w < 30 || w > 250) return Response.json({ error: "Enter a weight between 30 and 250 kg" }, { status: 400 });
  await db.insert(weightLogs).values({ userId: user.id, weightKg: w });
  await db.update(users).set({ weightKg: w }).where(eq(users.id, user.id));
  return Response.json({ ok: true });
}
