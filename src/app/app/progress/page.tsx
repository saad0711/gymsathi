import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq, and, isNotNull, inArray, count } from "drizzle-orm";
import { db } from "@/db";
import { planDays, setLogs, weightLogs, workouts } from "@/db/schema";
import { BADGES, MUSCLES, MUSCLE_LABELS, pick } from "@/lib/constants";
import { formatShort } from "@/lib/dates";
import { getCurrentUser, getLang, isPremium } from "@/lib/session";
import { getStats } from "@/lib/stats";
import { Card, Paywall, SectionTitle, btnGhost } from "@/components/ui";
import { WeightForm } from "@/components/progress-forms";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  const lang = await getLang();
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const premium = isPremium(user);
  const stats = await getStats(user.id, user.daysPerWeek);

  const wl = await db.select().from(weightLogs).where(eq(weightLogs.userId, user.id)).orderBy(desc(weightLogs.loggedAt)).limit(30);
  const series = [...wl].reverse();

  const recent = await db
    .select({ w: workouts, dayEn: planDays.nameEn, dayBn: planDays.nameBn })
    .from(workouts)
    .leftJoin(planDays, eq(workouts.planDayId, planDays.id))
    .where(and(eq(workouts.userId, user.id), isNotNull(workouts.finishedAt)))
    .orderBy(desc(workouts.finishedAt))
    .limit(8);
  const setCounts = recent.length
    ? await db
        .select({ workoutId: setLogs.workoutId, n: count() })
        .from(setLogs)
        .where(inArray(setLogs.workoutId, recent.map((r) => r.w.id)))
        .groupBy(setLogs.workoutId)
    : [];
  const counts = new Map(setCounts.map((c) => [c.workoutId, c.n]));

  // weight sparkline
  const W = 300, H = 80;
  let path = "";
  if (series.length >= 2) {
    const vals = series.map((s) => s.weightKg);
    const min = Math.min(...vals), max = Math.max(...vals);
    const span = Math.max(0.5, max - min);
    path = series.map((s, i) => `${(i / (series.length - 1)) * W},${H - 6 - ((s.weightKg - min) / span) * (H - 12)}`).join(" ");
  }
  const first = series[0]?.weightKg;
  const lastW = series[series.length - 1]?.weightKg;
  const maxWeekly = Math.max(1, user.daysPerWeek, ...stats.weeklyCounts.map((w) => w.count));
  const maxMuscle = Math.max(1, ...Object.values(stats.muscleSets));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{T("Your progress", "আপনার অগ্রগতি")}</h1>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Card className="!p-3"><div className="text-2xl font-bold">{stats.total}</div><div className="text-xs text-slate-400">{T("workouts", "ওয়ার্কআউট")}</div></Card>
        <Card className="!p-3"><div className="text-2xl font-bold">🔥 {stats.streakWeeks}</div><div className="text-xs text-slate-400">{T("week streak", "সপ্তাহ স্ট্রিক")}</div></Card>
        <Card className="!p-3"><div className="text-2xl font-bold">{stats.prEvents}</div><div className="text-xs text-slate-400">{T("PRs", "PR")}</div></Card>
      </div>

      <Card>
        <div className="mb-1 flex justify-between text-sm"><span className="font-medium">Lv {stats.level}</span><span className="text-slate-400">{stats.xp} XP</span></div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-lime-400" style={{ width: `${stats.levelProgress}%` }} /></div>
      </Card>

      <SectionTitle>{T("Weekly consistency", "সাপ্তাহিক ধারাবাহিকতা")}</SectionTitle>
      <Card>
        <div className="flex h-24 items-end gap-1.5">
          {stats.weeklyCounts.map((w) => (
            <div key={w.week} className="flex flex-1 flex-col items-center justify-end gap-1">
              <div className={`w-full rounded-t ${w.count >= user.daysPerWeek ? "bg-lime-400" : "bg-lime-400/40"}`} style={{ height: `${(w.count / maxWeekly) * 100}%`, minHeight: w.count ? 4 : 2 }} />
              <span className="text-[10px] text-slate-500">{w.count}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">{T(`Last 8 weeks. Bright bars hit your ${user.daysPerWeek}-day target.`, `শেষ ৮ সপ্তাহ। উজ্জ্বল বার মানে ${user.daysPerWeek} দিনের লক্ষ্য পূরণ।`)}</p>
      </Card>

      <SectionTitle>{T("Body weight", "শরীরের ওজন")}</SectionTitle>
      <Card>
        {series.length >= 2 ? (
          <>
            <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full"><polyline points={path} fill="none" stroke="#a3e635" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" /></svg>
            <p className="mb-3 text-xs text-slate-400">
              {first?.toFixed(1)} → {lastW?.toFixed(1)} kg ({lastW !== undefined && first !== undefined ? (lastW - first > 0 ? "+" : "") + (lastW - first).toFixed(1) : ""} kg)
            </p>
          </>
        ) : (
          <p className="mb-3 text-sm text-slate-400">{T("Log your weight weekly to see the trend.", "প্রবণতা দেখতে সপ্তাহে একবার ওজন লগ করুন।")}</p>
        )}
        <WeightForm lang={lang} current={user.weightKg} />
        <p className="mt-2 text-xs text-slate-500">{T("Progress photos stay on your phone only (local storage coming with the mobile app).", "প্রোগ্রেস ছবি শুধু আপনার ফোনেই থাকবে (মোবাইল অ্যাপে লোকাল স্টোরেজ আসছে)।")}</p>
      </Card>

      <SectionTitle>{T("Personal records", "ব্যক্তিগত রেকর্ড")}</SectionTitle>
      {stats.bests.length === 0 ? (
        <p className="text-sm text-slate-400">{T("Finish a workout to set your first baselines.", "প্রথম বেসলাইন সেট করতে একটি ওয়ার্কআউট শেষ করুন।")}</p>
      ) : (
        <Card>
          <ul className="divide-y divide-white/10 text-sm">
            {stats.bests.slice(0, 8).map((b) => (
              <li key={b.exerciseId} className="flex justify-between py-2">
                <span>{pick(lang, b.nameEn, b.nameBn)}</span>
                <span className="text-slate-300">
                  {b.weightKg > 0 ? `${b.weightKg} kg × ${b.reps}` : `${b.reps} ${T("reps", "রেপ")}`}
                  {premium && b.e1rm > 0 && <span className="ml-2 text-lime-300">1RM≈{b.e1rm}</span>}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <SectionTitle>{T("Advanced analytics", "উন্নত অ্যানালিটিক্স")}</SectionTitle>
      {premium ? (
        <>
          <Card>
            <p className="mb-2 text-sm font-medium">{T("Sets per muscle (last 4 weeks)", "প্রতি পেশির সেট (শেষ ৪ সপ্তাহ)")}</p>
            <ul className="space-y-2 text-sm">
              {MUSCLES.map((m) => {
                const n = stats.muscleSets[m] ?? 0;
                return (
                  <li key={m} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 text-slate-300">{pick(lang, MUSCLE_LABELS[m].en, MUSCLE_LABELS[m].bn)}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-lime-400" style={{ width: `${(n / maxMuscle) * 100}%` }} /></div>
                    <span className="w-6 text-right tabular-nums">{n}</span>
                  </li>
                );
              })}
            </ul>
          </Card>
          <a href="/api/export" className={`${btnGhost} w-full`}>⬇ {T("Export all workouts (CSV)", "সব ওয়ার্কআউট এক্সপোর্ট (CSV)")}</a>
        </>
      ) : (
        <Paywall lang={lang} title={T("Volume per muscle, estimated 1RM, data export", "পেশিভিত্তিক ভলিউম, আনুমানিক 1RM, ডেটা এক্সপোর্ট")} body={T("See where your training is going and export everything.", "আপনার ট্রেনিং কোথায় যাচ্ছে দেখুন এবং সব এক্সপোর্ট করুন।")} />
      )}

      <SectionTitle>{T("Badges", "ব্যাজ")}</SectionTitle>
      <div className="grid grid-cols-3 gap-2">
        {BADGES.map((b) => {
          const got = stats.badges.includes(b.id);
          return (
            <div key={b.id} className={`rounded-2xl border p-3 text-center ${got ? "border-lime-400/40 bg-lime-400/10" : "border-white/10 bg-white/5 opacity-50"}`}>
              <div className="text-2xl">{got ? b.icon : "🔒"}</div>
              <div className="mt-1 text-xs font-semibold">{pick(lang, b.en, b.bn)}</div>
              <div className="text-[10px] text-slate-400">{pick(lang, b.descEn, b.descBn)}</div>
            </div>
          );
        })}
      </div>

      <SectionTitle>{T("Recent workouts", "সাম্প্রতিক ওয়ার্কআউট")}</SectionTitle>
      {recent.length === 0 ? (
        <p className="text-sm text-slate-400">{T("No workouts yet.", "এখনও কোনো ওয়ার্কআউট নেই।")} <Link href="/app" className="text-lime-400 underline">{T("Start one", "শুরু করুন")}</Link></p>
      ) : (
        <ul className="space-y-2">
          {recent.map((r) => (
            <li key={r.w.id} className="flex justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
              <span>{r.w.finishedAt ? formatShort(r.w.finishedAt, lang) : ""} · {pick(lang, r.dayEn ?? "Workout", r.dayBn ?? "ওয়ার্কআউট")}</span>
              <span className="text-slate-400">{counts.get(r.w.id) ?? 0} {T("sets", "সেট")} · {Math.max(1, Math.round(r.w.durationSec / 60))} {T("min", "মি")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
