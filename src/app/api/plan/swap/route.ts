import { and, count, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { exercises, planDays, planExercises, plans, swaps } from "@/db/schema";
import { FREE_LIMITS } from "@/lib/constants";
import { findAlternatives, getUsableExercises } from "@/lib/exercises";
import { getCurrentUser, isPremium } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as { planExerciseId?: unknown } | null;
  const peId = Number(body?.planExerciseId);
  if (!Number.isInteger(peId)) return Response.json({ error: "Invalid id" }, { status: 400 });

  const premium = isPremium(user);
  const since = new Date(Date.now() - 7 * 86400000);
  const [used] = await db
    .select({ n: count() })
    .from(swaps)
    .where(and(eq(swaps.userId, user.id), gte(swaps.createdAt, since)));
  const usedN = used?.n ?? 0;
  if (!premium && usedN >= FREE_LIMITS.swapsPerWeek) {
    return Response.json({ error: "limit", limit: FREE_LIMITS.swapsPerWeek }, { status: 402 });
  }

  const [row] = await db
    .select({ pe: planExercises, ex: exercises })
    .from(planExercises)
    .innerJoin(planDays, eq(planExercises.planDayId, planDays.id))
    .innerJoin(plans, eq(planDays.planId, plans.id))
    .innerJoin(exercises, eq(planExercises.exerciseId, exercises.id))
    .where(and(eq(planExercises.id, peId), eq(plans.userId, user.id)))
    .limit(1);
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  const sameDay = await db
    .select({ exerciseId: planExercises.exerciseId })
    .from(planExercises)
    .where(eq(planExercises.planDayId, row.pe.planDayId));
  const usable = await getUsableExercises(user);
  const alts = findAlternatives(usable, row.ex, sameDay.map((s) => s.exerciseId));
  if (!alts.length) return Response.json({ error: "no_alternative" }, { status: 404 });
  const bestType = alts.filter((a) => a.type === row.ex.type);
  const pool = bestType.length ? bestType : alts;
  const chosen = pool[Math.floor(Math.random() * pool.length)]!;

  await db.update(planExercises).set({ exerciseId: chosen.id }).where(eq(planExercises.id, peId));
  await db.insert(swaps).values({ userId: user.id });
  return Response.json({
    ok: true,
    remaining: premium ? null : Math.max(0, FREE_LIMITS.swapsPerWeek - usedN - 1),
  });
}
