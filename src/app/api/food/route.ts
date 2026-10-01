import { and, count, eq } from "drizzle-orm";
import { db } from "@/db";
import { foodLogs, foods } from "@/db/schema";
import { FREE_LIMITS } from "@/lib/constants";
import { todayDhaka } from "@/lib/dates";
import { getCurrentUser, isPremium } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { foodId?: unknown; servings?: unknown } | null;
  const foodId = Number(body?.foodId);
  const servings = Number(body?.servings ?? 1);
  if (!Number.isInteger(foodId) || !Number.isFinite(servings) || servings <= 0 || servings > 20) {
    return Response.json({ error: "Invalid entry" }, { status: 400 });
  }
  const today = todayDhaka();
  if (!isPremium(user)) {
    const [n] = await db
      .select({ n: count() })
      .from(foodLogs)
      .where(and(eq(foodLogs.userId, user.id), eq(foodLogs.loggedOn, today)));
    if ((n?.n ?? 0) >= FREE_LIMITS.foodLogsPerDay) return Response.json({ error: "limit" }, { status: 402 });
  }
  const [f] = await db.select({ id: foods.id }).from(foods).where(eq(foods.id, foodId)).limit(1);
  if (!f) return Response.json({ error: "Food not found" }, { status: 404 });
  await db.insert(foodLogs).values({ userId: user.id, foodId, servings, loggedOn: today });
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return Response.json({ error: "Invalid id" }, { status: 400 });
  await db.delete(foodLogs).where(and(eq(foodLogs.id, id), eq(foodLogs.userId, user.id)));
  return Response.json({ ok: true });
}
