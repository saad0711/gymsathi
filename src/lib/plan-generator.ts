import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { exercises, planDays, planExercises, plans, type Exercise } from "@/db/schema";
import { GOAL_LABELS, INJURY_LABELS, type Muscle } from "@/lib/constants";
import { filterUsable } from "@/lib/exercises";

export type PlanProfile = {
  goal: string;
  level: string;
  daysPerWeek: number;
  sessionMinutes: number;
  equipment: string[];
  injuries: string[];
};

type Slot = { muscles: Muscle[]; type: "compound" | "isolation" };
const c = (...muscles: Muscle[]): Slot => ({ muscles, type: "compound" });
const i = (...muscles: Muscle[]): Slot => ({ muscles, type: "isolation" });

const FULL: Slot[] = [c("quads"), c("chest"), c("back"), c("hamstrings", "glutes"), c("shoulders"), i("biceps", "triceps"), i("core")];
const UPPER: Slot[] = [c("chest"), c("back"), c("shoulders"), c("back"), i("biceps"), i("triceps")];
const LOWER: Slot[] = [c("quads"), c("hamstrings", "glutes"), c("glutes", "hamstrings"), i("quads", "hamstrings"), i("calves"), i("core")];
const PUSH: Slot[] = [c("chest"), c("shoulders"), c("chest"), i("shoulders"), i("triceps"), i("triceps")];
const PULL: Slot[] = [c("back"), c("back"), i("back"), i("biceps"), i("biceps"), i("core")];

type Blueprint = { key: string; nameEn: string; nameBn: string; slots: Slot[]; variant: number };

function blueprints(days: number): { split: string; list: Blueprint[] } {
  const b = (key: string, nameEn: string, nameBn: string, slots: Slot[], variant = 0): Blueprint => ({ key, nameEn, nameBn, slots, variant });
  if (days <= 3) {
    const A = b("FBA", "Full Body A", "পূর্ণ শরীর A", FULL, 0);
    const B = b("FBB", "Full Body B", "পূর্ণ শরীর B", FULL, 1);
    const list = days === 1 ? [A] : days === 2 ? [A, B] : [A, B, A];
    return { split: "full_body", list };
  }
  if (days === 4) {
    return {
      split: "upper_lower",
      list: [
        b("UA", "Upper Body A", "উপরের শরীর A", UPPER, 0),
        b("LA", "Lower Body A", "নিচের শরীর A", LOWER, 0),
        b("UB", "Upper Body B", "উপরের শরীর B", UPPER, 1),
        b("LB", "Lower Body B", "নিচের শরীর B", LOWER, 1),
      ],
    };
  }
  if (days === 5) {
    return {
      split: "ppl_upper_lower",
      list: [
        b("PUSH", "Push", "পুশ (ঠেলা)", PUSH, 0),
        b("PULL", "Pull", "পুল (টানা)", PULL, 0),
        b("LEGS", "Legs", "লেগস (পা)", LOWER, 0),
        b("UP", "Upper Body", "উপরের শরীর", UPPER, 1),
        b("LOW", "Lower Body", "নিচের শরীর", LOWER, 1),
      ],
    };
  }
  return {
    split: "ppl",
    list: [
      b("PUSH", "Push A", "পুশ A", PUSH, 0),
      b("PULL", "Pull A", "পুল A", PULL, 0),
      b("LEGS", "Legs A", "লেগস A", LOWER, 0),
      b("PUSH2", "Push B", "পুশ B", PUSH, 1),
      b("PULL2", "Pull B", "পুল B", PULL, 1),
      b("LEGS2", "Legs B", "লেগস B", LOWER, 1),
    ],
  };
}

function prescription(goal: string, level: string, type: "compound" | "isolation") {
  const beginner = level === "never";
  let repMin: number, repMax: number, rest: number;
  if (goal === "strength") {
    if (type === "compound") { repMin = beginner ? 6 : 5; repMax = beginner ? 10 : 8; rest = 150; }
    else { repMin = 8; repMax = 12; rest = 75; }
  } else if (goal === "fat_loss") {
    if (type === "compound") { repMin = 10; repMax = 15; rest = 75; }
    else { repMin = 12; repMax = 15; rest = 45; }
  } else if (goal === "muscle_gain") {
    if (type === "compound") { repMin = 8; repMax = 12; rest = 120; }
    else { repMin = 10; repMax = 15; rest = 60; }
  } else {
    if (type === "compound") { repMin = 8; repMax = 12; rest = 90; }
    else { repMin = 12; repMax = 15; rest = 60; }
  }
  let sets: number;
  if (type === "compound") sets = beginner ? 3 : goal === "strength" || level === "intermediate" ? 4 : 3;
  else sets = beginner ? 2 : 3;
  return { sets, repMin, repMax, restSec: rest, rir: beginner ? 3 : 2 };
}

function rank(e: Exercise, slot: Slot, muscleIdx: number, beginner: boolean, hasGear: boolean): number {
  let s = muscleIdx * 10;
  if (e.type !== slot.type) s += 100;
  // when the user has real equipment, prefer it over bodyweight-only fallbacks
  if (hasGear && e.equipment.length === 1 && e.equipment[0] === "bodyweight") s += 12;
  const heavyMachine = e.equipment.some((q) => ["machines", "lat_pulldown", "leg_press"].includes(q));
  if (beginner && e.equipment.includes("barbell")) s += 30;
  if (beginner && heavyMachine) s -= 5;
  if (!beginner && e.equipment.includes("barbell")) s -= 5;
  if (!e.isFree) s += 15;
  return s;
}

function chooseExercise(
  usable: Exercise[],
  slot: Slot,
  muscles: Muscle[],
  used: Set<number>,
  dayUsed: Set<number>,
  beginner: boolean,
  offset: number,
  hasGear: boolean,
): Exercise | null {
  const cands: { e: Exercise; s: number }[] = [];
  muscles.forEach((m, idx) => {
    usable.filter((e) => e.primaryMuscle === m).forEach((e) => cands.push({ e, s: rank(e, slot, idx, beginner, hasGear) }));
  });
  cands.sort((a, b) => a.s - b.s);
  const list = cands.map((x) => x.e);
  const fresh = list.filter((e) => !used.has(e.id));
  if (fresh.length) return fresh[0]!;
  const notToday = list.filter((e) => !dayUsed.has(e.id));
  if (notToday.length) return notToday[offset % notToday.length]!;
  return null;
}

export async function createPlan(userId: string, profile: PlanProfile): Promise<number> {
  const all = await db.select().from(exercises);
  const usable = filterUsable(all, profile);
  const beginner = profile.level === "never";
  const hasGear = profile.equipment.some((q) => q !== "bodyweight");

  const cap = profile.level === "never" ? 3 : profile.level === "under6" ? 4 : 6;
  const days = Math.min(Math.max(profile.daysPerWeek, 1), cap);
  const { split, list } = blueprints(days);
  const n = Math.min(7, Math.max(4, Math.floor((profile.sessionMinutes - 5) / 7)));

  const used = new Set<number>();
  const built = new Map<string, { id: number; slot: Slot }[]>();
  for (const bp of list) {
    if (built.has(bp.key)) continue;
    const dayUsed = new Set<number>();
    const picks: { id: number; slot: Slot }[] = [];
    bp.slots.slice(0, n).forEach((slot, idx) => {
      let muscles = [...slot.muscles];
      if (bp.variant % 2 === 1) muscles = muscles.reverse();
      if (profile.goal === "posture" && slot.type === "isolation" && muscles.includes("biceps")) muscles = ["back"];
      const e = chooseExercise(usable, slot, muscles, used, dayUsed, beginner, bp.variant + idx, hasGear);
      if (e) {
        used.add(e.id);
        dayUsed.add(e.id);
        picks.push({ id: e.id, slot });
      }
    });
    built.set(bp.key, picks);
  }

  // rationale
  const goalLabel = GOAL_LABELS[profile.goal] ?? GOAL_LABELS.general!;
  const en: string[] = [];
  const bn: string[] = [];
  if (days < profile.daysPerWeek) {
    en.push(`You asked for ${profile.daysPerWeek} days, but we start you at ${days}. Beginners grow best with enough recovery, and you can add days later.`);
    bn.push(`আপনি সপ্তাহে ${profile.daysPerWeek} দিন চেয়েছেন, কিন্তু আমরা ${days} দিন দিয়ে শুরু করছি। নতুনদের জন্য পর্যাপ্ত বিশ্রাম জরুরি, পরে দিন বাড়ানো যাবে।`);
  }
  if (split === "full_body") {
    en.push("Full-body sessions train every major muscle 2–3 times a week. This is the fastest way for a beginner to learn movements and build a base.");
    bn.push("ফুল-বডি সেশনে প্রতিটি বড় মাংসপেশি সপ্তাহে ২–৩ বার কাজ করে। নতুনদের জন্য মুভমেন্ট শেখা ও ভিত্তি গড়ার দ্রুততম উপায় এটি।");
  } else if (split === "upper_lower") {
    en.push("An upper/lower split trains each muscle twice a week with more volume per session while leaving time to recover.");
    bn.push("আপার/লোয়ার স্প্লিটে প্রতিটি পেশি সপ্তাহে দুইবার কাজ করে, প্রতি সেশনে বেশি ভলিউম থাকে আর বিশ্রামের সময়ও মেলে।");
  } else {
    en.push("A push/pull/legs style split groups similar muscles together so each one gets enough volume and rest.");
    bn.push("পুশ/পুল/লেগস স্প্লিটে একই ধরনের পেশি একসাথে কাজ করে, ফলে প্রতিটি পেশি যথেষ্ট ভলিউম ও বিশ্রাম পায়।");
  }
  const cp = prescription(profile.goal, profile.level, "compound");
  const ip = prescription(profile.goal, profile.level, "isolation");
  en.push(`Goal: ${goalLabel.en}. Big lifts use ${cp.repMin}–${cp.repMax} reps and smaller lifts ${ip.repMin}–${ip.repMax} reps. We do not use 20 reps for everything because different rep ranges train different qualities.`);
  bn.push(`লক্ষ্য: ${goalLabel.bn}। বড় ব্যায়ামে ${cp.repMin}–${cp.repMax} রেপ এবং ছোট ব্যায়ামে ${ip.repMin}–${ip.repMax} রেপ রাখা হয়েছে। সবকিছুতে ২০ রেপ নয়, কারণ ভিন্ন রেপ রেঞ্জ ভিন্ন ফল দেয়।`);
  en.push(`Each exercise is ${cp.sets} sets (big lifts) or ${ip.sets} sets (small lifts), stopping about ${cp.rir} reps before failure (RIR ${cp.rir}). You should finish feeling worked, not wrecked.`);
  bn.push(`বড় ব্যায়ামে ${cp.sets} সেট, ছোট ব্যায়ামে ${ip.sets} সেট করুন এবং ব্যর্থতার প্রায় ${cp.rir} রেপ আগে থামুন (RIR ${cp.rir})। শেষে ক্লান্ত নয়, পরিশ্রান্ত অনুভব করা উচিত।`);
  en.push("Progressive overload: when you hit the top of the rep range on every set, add a small amount of weight (2.5 kg, or 5 kg for legs). Otherwise try for one more rep next time.");
  bn.push("প্রগ্রেসিভ ওভারলোড: সব সেটে রেপ রেঞ্জের সর্বোচ্চ সংখ্যায় পৌঁছালে সামান্য ওজন বাড়ান (২.৫ কেজি, পায়ের জন্য ৫ কেজি)। না হলে পরের বার আরেকটি রেপ বেশি করার চেষ্টা করুন।");
  en.push("Only exercises that use equipment your gym has are included. If a machine is busy, use the swap button.");
  bn.push("আপনার জিমে যে যন্ত্র আছে শুধু সেগুলো দিয়ে বানানো ব্যায়াম রাখা হয়েছে। মেশিন ব্যস্ত থাকলে সোয়াপ বাটন ব্যবহার করুন।");
  if (profile.injuries.length) {
    const namesEn = profile.injuries.map((k) => INJURY_LABELS[k]?.en ?? k).join(", ");
    const namesBn = profile.injuries.map((k) => INJURY_LABELS[k]?.bn ?? k).join(", ");
    en.push(`You flagged: ${namesEn}. We left out exercises that commonly load those areas. This is not medical advice. Stop if anything hurts and see a professional.`);
    bn.push(`আপনি যা উল্লেখ করেছেন: ${namesBn}। ওই অংশে বেশি চাপ দেয় এমন ব্যায়াম বাদ দেওয়া হয়েছে। এটি চিকিৎসা পরামর্শ নয়। ব্যথা হলে থামুন এবং বিশেষজ্ঞ দেখান।`);
  }
  en.push("Week 4 is a deload: keep the same exercises but do one fewer set and use about 10% less weight, so your body recovers and comes back stronger.");
  bn.push("৪র্থ সপ্তাহ ডিলোড: একই ব্যায়াম কিন্তু এক সেট কম এবং প্রায় ১০% হালকা ওজনে করুন, যেন শরীর সেরে উঠে আরও শক্তিশালী হয়।");

  await db.update(plans).set({ active: false }).where(and(eq(plans.userId, userId), eq(plans.active, true)));
  const [plan] = await db
    .insert(plans)
    .values({ userId, goal: profile.goal, splitKey: split, weeks: 4, rationaleEn: en, rationaleBn: bn, active: true })
    .returning();
  if (!plan) throw new Error("Failed to create plan");

  for (let d = 0; d < list.length; d++) {
    const bp = list[d]!;
    const [day] = await db
      .insert(planDays)
      .values({ planId: plan.id, dayIndex: d, nameEn: bp.nameEn, nameBn: bp.nameBn })
      .returning();
    if (!day) continue;
    const picks = built.get(bp.key) ?? [];
    if (picks.length) {
      await db.insert(planExercises).values(
        picks.map((p, pos) => ({
          planDayId: day.id,
          exerciseId: p.id,
          position: pos,
          ...prescription(profile.goal, profile.level, p.slot.type),
        })),
      );
    }
  }
  return plan.id;
}
