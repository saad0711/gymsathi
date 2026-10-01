import { and, asc, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { exercises, setLogs, workouts } from "@/db/schema";
import { addDays, dhakaDate, todayDhaka, weekStart } from "@/lib/dates";

export type Best = {
  exerciseId: number;
  nameEn: string;
  nameBn: string;
  weightKg: number;
  reps: number;
  e1rm: number;
  key: number;
  date: string;
};

export type Stats = {
  total: number;
  weekCount: number;
  streakWeeks: number;
  lastWorkoutAt: Date | null;
  prEvents: number;
  bests: Best[];
  muscleSets: Record<string, number>;
  weeklyCounts: { week: string; count: number }[];
  badges: string[];
  xp: number;
  level: number;
  levelProgress: number;
};

const keyOf = (w: number, r: number) => w * 1000 + r;

export async function getStats(userId: string, target: number): Promise<Stats> {
  const ws = await db
    .select({ id: workouts.id, finishedAt: workouts.finishedAt })
    .from(workouts)
    .where(and(eq(workouts.userId, userId), isNotNull(workouts.finishedAt)))
    .orderBy(asc(workouts.finishedAt));

  const sets = await db
    .select({
      workoutId: setLogs.workoutId,
      exerciseId: setLogs.exerciseId,
      weightKg: setLogs.weightKg,
      reps: setLogs.reps,
      muscle: exercises.primaryMuscle,
      nameEn: exercises.nameEn,
      nameBn: exercises.nameBn,
      finishedAt: workouts.finishedAt,
    })
    .from(setLogs)
    .innerJoin(workouts, eq(setLogs.workoutId, workouts.id))
    .innerJoin(exercises, eq(setLogs.exerciseId, exercises.id))
    .where(and(eq(workouts.userId, userId), isNotNull(workouts.finishedAt)))
    .orderBy(asc(workouts.finishedAt));

  // weekly consistency
  const counts = new Map<string, number>();
  for (const w of ws) {
    if (!w.finishedAt) continue;
    const wk = weekStart(dhakaDate(w.finishedAt));
    counts.set(wk, (counts.get(wk) ?? 0) + 1);
  }
  const cur = weekStart(todayDhaka());
  let streak = 0;
  let w = cur;
  if ((counts.get(w) ?? 0) >= target) streak = 1;
  w = addDays(w, -7);
  while ((counts.get(w) ?? 0) >= target) {
    streak++;
    w = addDays(w, -7);
  }
  const weeklyCounts: { week: string; count: number }[] = [];
  for (let k = 7; k >= 0; k--) {
    const wk = addDays(cur, -7 * k);
    weeklyCounts.push({ week: wk, count: counts.get(wk) ?? 0 });
  }

  // PRs: best (weight, then reps) per exercise per workout; compare to running best
  const perEx = new Map<number, Map<number, { w: number; r: number; date: Date | null }>>();
  const meta = new Map<number, { nameEn: string; nameBn: string }>();
  for (const s of sets) {
    meta.set(s.exerciseId, { nameEn: s.nameEn, nameBn: s.nameBn });
    let byW = perEx.get(s.exerciseId);
    if (!byW) perEx.set(s.exerciseId, (byW = new Map()));
    const prev = byW.get(s.workoutId);
    if (!prev || keyOf(s.weightKg, s.reps) > keyOf(prev.w, prev.r)) {
      byW.set(s.workoutId, { w: s.weightKg, r: s.reps, date: s.finishedAt });
    }
  }
  let prEvents = 0;
  const bests: Best[] = [];
  for (const [exerciseId, byW] of perEx) {
    let running = -1;
    let best: { w: number; r: number; date: Date | null } | null = null;
    for (const v of byW.values()) {
      const k = keyOf(v.w, v.r);
      if (running >= 0 && k > running) prEvents++;
      if (k > running) {
        running = k;
        best = v;
      }
    }
    const m = meta.get(exerciseId);
    if (best && m) {
      bests.push({
        exerciseId,
        nameEn: m.nameEn,
        nameBn: m.nameBn,
        weightKg: best.w,
        reps: best.r,
        e1rm: best.w > 0 ? Math.round(best.w * (1 + best.r / 30) * 10) / 10 : 0,
        key: running,
        date: best.date ? dhakaDate(best.date) : "",
      });
    }
  }

  // muscle volume (sets) in the last 28 days
  const since = Date.now() - 28 * 86400000;
  const muscleSets: Record<string, number> = {};
  for (const s of sets) {
    if (s.finishedAt && s.finishedAt.getTime() >= since) muscleSets[s.muscle] = (muscleSets[s.muscle] ?? 0) + 1;
  }

  const total = ws.length;
  const weekCount = counts.get(cur) ?? 0;
  const hitWeek = Array.from(counts.values()).some((n) => n >= target);
  const badges: string[] = [];
  if (total >= 1) badges.push("first_workout");
  if (hitWeek) badges.push("first_week");
  if (total >= 10) badges.push("ten_workouts");
  if (prEvents >= 1) badges.push("first_pr");
  if (streak >= 4) badges.push("streak_4");
  if (total >= 25) badges.push("twenty_five");

  const xp = total * 50 + prEvents * 25;
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const lo = (level - 1) ** 2 * 100;
  const hi = level ** 2 * 100;

  return {
    total,
    weekCount,
    streakWeeks: streak,
    lastWorkoutAt: ws.length ? (ws[ws.length - 1]!.finishedAt ?? null) : null,
    prEvents,
    bests: bests.sort((a, b) => b.weightKg - a.weightKg),
    muscleSets,
    weeklyCounts,
    badges,
    xp,
    level,
    levelProgress: Math.round(((xp - lo) / (hi - lo)) * 100),
  };
}

export type LastSet = { weightKg: number; reps: number };

/** Sets from the most recent finished workout for each exercise. */
export async function getLastSets(userId: string, exerciseIds: number[]): Promise<Map<number, LastSet[]>> {
  const out = new Map<number, LastSet[]>();
  if (!exerciseIds.length) return out;
  const rows = await db
    .select({
      exerciseId: setLogs.exerciseId,
      workoutId: setLogs.workoutId,
      setNumber: setLogs.setNumber,
      weightKg: setLogs.weightKg,
      reps: setLogs.reps,
    })
    .from(setLogs)
    .innerJoin(workouts, eq(setLogs.workoutId, workouts.id))
    .where(and(eq(workouts.userId, userId), isNotNull(workouts.finishedAt), inArray(setLogs.exerciseId, exerciseIds)))
    .orderBy(desc(workouts.finishedAt), asc(setLogs.setNumber));
  const latestWorkout = new Map<number, number>();
  for (const r of rows) {
    if (!latestWorkout.has(r.exerciseId)) latestWorkout.set(r.exerciseId, r.workoutId);
    if (latestWorkout.get(r.exerciseId) === r.workoutId) {
      const arr = out.get(r.exerciseId) ?? [];
      arr.push({ weightKg: r.weightKg, reps: r.reps });
      out.set(r.exerciseId, arr);
    }
  }
  return out;
}

export function roundToStep(n: number, step = 2.5) {
  return Math.round(n / step) * step;
}

export function progression(
  last: LastSet[] | null | undefined,
  repMax: number,
  premium: boolean,
  isLower: boolean,
): { startWeight: number; noteEn: string | null; noteBn: string | null } {
  if (!last || !last.length) return { startWeight: 0, noteEn: null, noteBn: null };
  const top = Math.max(...last.map((s) => s.weightKg));
  if (!premium) return { startWeight: top, noteEn: null, noteBn: null };
  const hitTop = last.every((s) => s.reps >= repMax);
  const step = isLower ? 5 : 2.5;
  if (hitTop && top > 0) {
    return {
      startWeight: top + step,
      noteEn: `You hit ${repMax} reps on every set last time. Go up to ${top + step} kg.`,
      noteBn: `গতবার সব সেটে ${repMax} রেপ করেছেন। এবার ${top + step} কেজি চেষ্টা করুন।`,
    };
  }
  if (hitTop) {
    return {
      startWeight: 0,
      noteEn: "You hit the top of the range. Slow the tempo or try a harder variation.",
      noteBn: "রেঞ্জের সর্বোচ্চে পৌঁছেছেন। ধীরে করুন বা কঠিন ভ্যারিয়েশন চেষ্টা করুন।",
    };
  }
  return {
    startWeight: top,
    noteEn: `Stay at ${top} kg and aim for one more rep on each set.`,
    noteBn: `${top} কেজিতেই থাকুন এবং প্রতি সেটে আরও ১ রেপ করার চেষ্টা করুন।`,
  };
}
