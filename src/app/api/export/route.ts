import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { exercises, setLogs, workouts } from "@/db/schema";
import { getCurrentUser, isPremium } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return new Response("Not signed in", { status: 401 });
  if (!isPremium(user)) return new Response("Premium required", { status: 402 });

  const rows = await db
    .select({
      date: workouts.finishedAt,
      exercise: exercises.nameEn,
      setNumber: setLogs.setNumber,
      weightKg: setLogs.weightKg,
      reps: setLogs.reps,
    })
    .from(setLogs)
    .innerJoin(workouts, eq(setLogs.workoutId, workouts.id))
    .innerJoin(exercises, eq(setLogs.exerciseId, exercises.id))
    .where(eq(workouts.userId, user.id))
    .orderBy(asc(workouts.finishedAt), asc(setLogs.setNumber));

  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const csv = [
    "date,exercise,set,weight_kg,reps",
    ...rows.map((r) => [r.date?.toISOString() ?? "", esc(r.exercise), r.setNumber, r.weightKg, r.reps].join(",")),
  ].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="gymsathi-workouts.csv"',
    },
  });
}
