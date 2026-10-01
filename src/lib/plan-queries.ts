import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { exercises, planDays, planExercises, plans } from "@/db/schema";

export async function getActivePlan(userId: string) {
  const [plan] = await db
    .select()
    .from(plans)
    .where(and(eq(plans.userId, userId), eq(plans.active, true)))
    .orderBy(desc(plans.createdAt))
    .limit(1);
  if (!plan) return null;
  const days = await db.select().from(planDays).where(eq(planDays.planId, plan.id)).orderBy(asc(planDays.dayIndex));
  const items = days.length
    ? await db
        .select({ pe: planExercises, ex: exercises })
        .from(planExercises)
        .innerJoin(exercises, eq(planExercises.exerciseId, exercises.id))
        .where(inArray(planExercises.planDayId, days.map((d) => d.id)))
        .orderBy(asc(planExercises.position))
    : [];
  return {
    plan,
    days: days.map((d) => ({ day: d, items: items.filter((i) => i.pe.planDayId === d.id) })),
  };
}
