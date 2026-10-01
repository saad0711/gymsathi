import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { planDays, plans, setLogs, workouts } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { getStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

type SetIn = { exerciseId: number; setNumber: number; weightKg: number; reps: number };

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    planDayId?: unknown;
    startedAt?: unknown;
    sets?: unknown;
  } | null;
  if (!body || !Array.isArray(body.sets)) return Response.json({ error: "Invalid body" }, { status: 400 });

  const sets: SetIn[] = [];
  for (const s of body.sets.slice(0, 200) as Record<string, unknown>[]) {
    const exerciseId = Number(s.exerciseId);
    const setNumber = Number(s.setNumber);
    const weightKg = Number(s.weightKg);
    const reps = Number(s.reps);
    if (
      !Number.isInteger(exerciseId) ||
      !Number.isInteger(setNumber) ||
      !Number.isFinite(weightKg) ||
      !Number.isInteger(reps) ||
      weightKg < 0 ||
      weightKg > 1000 ||
      reps < 0 ||
      reps > 500
    ) {
      return Response.json({ error: "Invalid set data" }, { status: 400 });
    }
    sets.push({ exerciseId, setNumber, weightKg, reps });
  }
  if (!sets.length) return Response.json({ error: "No sets logged" }, { status: 400 });

  let planDayId: number | null = null;
  if (body.planDayId !== null && body.planDayId !== undefined) {
    const id = Number(body.planDayId);
    if (Number.isInteger(id)) {
      const [d] = await db
        .select({ id: planDays.id })
        .from(planDays)
        .innerJoin(plans, eq(planDays.planId, plans.id))
        .where(and(eq(planDays.id, id), eq(plans.userId, user.id)))
        .limit(1);
      planDayId = d?.id ?? null;
    }
  }

  const now = new Date();
  let startedAt = typeof body.startedAt === "number" ? new Date(body.startedAt) : now;
  if (Number.isNaN(startedAt.getTime()) || startedAt > now) startedAt = now;
  const durationSec = Math.min(6 * 3600, Math.max(0, Math.round((now.getTime() - startedAt.getTime()) / 1000)));

  const before = await getStats(user.id, user.daysPerWeek);
  const [w] = await db
    .insert(workouts)
    .values({ userId: user.id, planDayId, startedAt, finishedAt: now, durationSec })
    .returning();
  if (!w) return Response.json({ error: "Could not save" }, { status: 500 });
  try {
    await db.insert(setLogs).values(sets.map((s) => ({ ...s, workoutId: w.id })));
  } catch {
    await db.delete(workouts).where(eq(workouts.id, w.id));
    return Response.json({ error: "Unknown exercise in session" }, { status: 400 });
  }
  const after = await getStats(user.id, user.daysPerWeek);

  const beforeBest = new Map(before.bests.map((b) => [b.exerciseId, b.key]));
  const prs = after.bests
    .filter((b) => beforeBest.has(b.exerciseId) && b.key > (beforeBest.get(b.exerciseId) ?? 0))
    .map((b) => ({ exerciseId: b.exerciseId, nameEn: b.nameEn, nameBn: b.nameBn, weightKg: b.weightKg, reps: b.reps }));
  const newBadges = after.badges.filter((b) => !before.badges.includes(b));

  return Response.json({ ok: true, workoutId: w.id, prs, newBadges, total: after.total, weekCount: after.weekCount });
}
