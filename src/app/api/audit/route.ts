import { count, eq } from "drizzle-orm";
import { db } from "@/db";
import { audits, exercises } from "@/db/schema";
import { auditRoutine } from "@/lib/auditor";
import { FREE_LIMITS, GOALS } from "@/lib/constants";
import { ensureSeeded } from "@/lib/seed";
import { getCurrentUser, isPremium } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { text?: unknown; goal?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (text.length < 5) return Response.json({ error: "Please paste your routine first." }, { status: 400 });
  if (text.length > 4000) return Response.json({ error: "Routine is too long (max 4000 characters)." }, { status: 400 });
  const goal = GOALS.includes(body?.goal as (typeof GOALS)[number]) ? (body!.goal as string) : user.goal;

  const [used] = await db.select({ n: count() }).from(audits).where(eq(audits.userId, user.id));
  if (!isPremium(user) && (used?.n ?? 0) >= FREE_LIMITS.audits) {
    return Response.json({ error: "limit" }, { status: 402 });
  }

  await ensureSeeded();
  const all = await db.select().from(exercises);
  const result = auditRoutine(text, goal, all);
  const [row] = await db
    .insert(audits)
    .values({ userId: user.id, inputText: text, goal, score: result.score, result })
    .returning();
  return Response.json({ ok: true, id: row?.id });
}
