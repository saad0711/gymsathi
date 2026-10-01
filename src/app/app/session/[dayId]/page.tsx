import { notFound, redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { exercises, planDays, planExercises, plans } from "@/db/schema";
import { getCurrentUser, getLang, isPremium } from "@/lib/session";
import { getLastSets, progression, roundToStep } from "@/lib/stats";
import { GymMode, type SessionExercise } from "@/components/gym-mode";

const WARMUP_EN = ["5 minutes easy cardio (bike, brisk walk or skipping)", "Arm circles and shoulder rolls × 10", "10 bodyweight squats", "10 hip hinges (push hips back, back flat)"];
const WARMUP_BN = ["৫ মিনিট হালকা কার্ডিও (সাইকেল, দ্রুত হাঁটা বা স্কিপিং)", "হাত ঘোরানো ও কাঁধ রোল × ১০", "১০টি বডিওয়েট স্কোয়াট", "১০টি হিপ হিঞ্জ (কোমর পেছনে, পিঠ সোজা)"];
const COOLDOWN_EN = ["Walk slowly for 3 minutes", "Chest stretch: 30 seconds each side", "Quad and hamstring stretch: 30 seconds each leg", "Drink water and eat some protein within 1–2 hours"];
const COOLDOWN_BN = ["৩ মিনিট ধীরে হাঁটুন", "বুকের স্ট্রেচ: প্রতি পাশে ৩০ সেকেন্ড", "সামনের ও পেছনের উরুর স্ট্রেচ: প্রতি পায়ে ৩০ সেকেন্ড", "পানি পান করুন এবং ১–২ ঘণ্টার মধ্যে প্রোটিন খান"];

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ dayId: string }>;
  searchParams: Promise<{ lite?: string; min?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  const lang = await getLang();
  const { dayId } = await params;
  const sp = await searchParams;
  const id = Number(dayId);
  if (!Number.isInteger(id)) notFound();

  const [found] = await db
    .select({ day: planDays })
    .from(planDays)
    .innerJoin(plans, eq(planDays.planId, plans.id))
    .where(and(eq(planDays.id, id), eq(plans.userId, user.id)))
    .limit(1);
  if (!found) notFound();

  let rows = await db
    .select({ pe: planExercises, ex: exercises })
    .from(planExercises)
    .innerJoin(exercises, eq(planExercises.exerciseId, exercises.id))
    .where(eq(planExercises.planDayId, id))
    .orderBy(asc(planExercises.position));
  if (!rows.length) notFound();

  const premium = isPremium(user);
  const lite = sp.lite === "1";
  let setsAdj = lite ? -1 : 0;
  const minutes = Number(sp.min);
  if (premium && Number.isFinite(minutes) && minutes >= 15 && minutes <= 90) {
    rows = rows.slice(0, Math.max(3, Math.floor((minutes - 5) / 7)));
    setsAdj = -1; // time-crunch mode trims volume
  }

  const last = await getLastSets(user.id, rows.map((r) => r.ex.id));
  const list: SessionExercise[] = rows.map(({ pe, ex }) => {
    const l = last.get(ex.id) ?? null;
    const prog = progression(l, pe.repMax, premium, ex.movement === "legs");
    const start = lite && prog.startWeight > 0 ? roundToStep(prog.startWeight * 0.8) : prog.startWeight;
    return {
      key: String(pe.id),
      exerciseId: ex.id,
      slug: ex.slug,
      nameEn: ex.nameEn,
      nameBn: ex.nameBn,
      sets: Math.max(2, pe.sets + setsAdj),
      repMin: pe.repMin,
      repMax: pe.repMax,
      restSec: pe.restSec,
      rir: pe.rir,
      last: l,
      startWeight: start,
      noteEn: prog.noteEn,
      noteBn: prog.noteBn,
      stepsEn: ex.stepsEn,
      stepsBn: ex.stepsBn,
      tipEn: ex.tipEn,
      tipBn: ex.tipBn,
      bodyweight: ex.equipment.length === 1 && ex.equipment[0] === "bodyweight",
    };
  });

  return (
    <GymMode
      dayId={id}
      dayNameEn={found.day.nameEn}
      dayNameBn={found.day.nameBn}
      lang={lang}
      exercises={list}
      isPremium={premium}
      lite={lite}
      warmupEn={WARMUP_EN}
      warmupBn={WARMUP_BN}
      cooldownEn={COOLDOWN_EN}
      cooldownBn={COOLDOWN_BN}
    />
  );
}
