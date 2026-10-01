/* eslint-disable react-hooks/purity */
import Link from "next/link";
import { redirect } from "next/navigation";
import { and, count, eq, inArray, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { GOAL_LABELS, pick } from "@/lib/constants";
import { getActivePlan } from "@/lib/plan-queries";
import { getCurrentUser, getLang } from "@/lib/session";
import { getStats } from "@/lib/stats";
import { Card, Disclaimer, Eyebrow, SectionTitle, btnGhost, btnPrimary } from "@/components/ui";

export default async function TodayPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  const lang = await getLang();
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const stats = await getStats(user.id, user.daysPerWeek);
  const active = await getActivePlan(user.id);
  let nextDay = active?.days[0];
  if (active && active.days.length) {
    const [done] = await db.select({ n: count() }).from(workouts).where(and(eq(workouts.userId, user.id), isNotNull(workouts.finishedAt), inArray(workouts.planDayId, active.days.map((d) => d.day.id))));
    nextDay = active.days[(done?.n ?? 0) % active.days.length];
  }
  const daysSince = stats.lastWorkoutAt ? Math.floor((Date.now() - stats.lastWorkoutAt.getTime()) / 86400000) : null;
  const missed = daysSince !== null && daysSince >= 7;
  const target = user.daysPerWeek;
  const toTwelve = Math.min(100, Math.round((stats.total / 12) * 100));
  const minutes = nextDay ? Math.max(20, nextDay.items.length * 7 + 5) : 0;
  const goal = GOAL_LABELS[user.goal] ?? GOAL_LABELS.general!;
  return <div className="space-y-8">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><Eyebrow>{stats.total === 0 ? T("Your first week starts here", "à¦†à¦ªà¦¨à¦¾à¦° à¦ªà§à¦°à¦¥à¦® à¦¸à¦ªà§à¦¤à¦¾à¦¹ à¦à¦–à¦¾à¦¨à§‡à¦‡ à¦¶à§à¦°à§") : T("Your training home", "à¦†à¦ªà¦¨à¦¾à¦° à¦Ÿà§à¦°à§‡à¦¨à¦¿à¦‚ à¦¹à§‹à¦®")}</Eyebrow><h1 className="text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">{stats.total === 0 ? T("Ready when you are.", "à¦ªà§à¦°à¦¸à§à¦¤à§à¦¤ à¦¤à§‹?") : T("Good to see you back.", "à¦†à¦¬à¦¾à¦°à¦“ à¦¸à§à¦¬à¦¾à¦—à¦¤à¦®à¥¤")}</h1><p className="mt-3 text-sm text-[#8f9b96]">{T("Goal", "à¦²à¦•à§à¦·à§à¦¯")}: <span className="text-white">{pick(lang, goal.en, goal.bn)}</span><span className="mx-2 text-white/20">Â·</span>{user.daysPerWeek} days / week</p></div><Link href="/app/guide" className={btnGhost}>First-day guide <span aria-hidden>â†—</span></Link></div>
    {user.parqFlags.length > 0 && <div className="rounded-2xl border border-[#ffbd73]/30 bg-[#ffbd73]/[0.08] p-4 text-sm text-[#ffd7a6]"><span className="mr-2 font-bold">SAFETY</span>{T("You flagged a health concern. Talk to a doctor before training hard.", "à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¸à¦‚à¦•à§à¦°à¦¾à¦¨à§à¦¤ à¦¬à¦¿à¦·à¦¯à¦¼à§‡ à¦•à¦ à¦¿à¦¨ à¦¬à§à¦¯à¦¾à¦¯à¦¼à¦¾à¦®à§‡à¦° à¦†à¦—à§‡ à¦šà¦¿à¦•à¦¿à§Žà¦¸à¦•à§‡à¦° à¦¸à¦™à§à¦—à§‡ à¦•à¦¥à¦¾ à¦¬à¦²à§à¦¨à¥¤")}</div>}
    {missed && <div className="rounded-2xl border border-[#8cebd9]/25 bg-[#8cebd9]/[0.07] p-5"><p className="font-semibold text-[#8cebd9]">{T("Welcome back. Ease in.", "à¦†à¦¬à¦¾à¦° à¦¶à§à¦°à§ à¦•à¦°à§à¦¨, à¦§à§€à¦°à§‡à¥¤")}</p><p className="mt-1 max-w-xl text-sm leading-6 text-[#aab5b0]">{T("It has been " + daysSince + " days. Your next session is lighter by design.", daysSince + " à¦¦à¦¿à¦¨ à¦¹à¦¯à¦¼à§‡ à¦—à§‡à¦›à§‡à¥¤ à¦†à¦œà¦•à§‡à¦° à¦¸à§‡à¦¶à¦¨ à¦¹à¦¾à¦²à¦•à¦¾ à¦°à¦¾à¦–à¦¾ à¦¹à¦¯à¦¼à§‡à¦›à§‡à¥¤")}</p>{nextDay && <Link href={"/app/session/" + nextDay.day.id + "?lite=1"} className={btnGhost + " mt-4"}>Start lighter session <span aria-hidden>â†—</span></Link>}</div>}
    <div className="grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
      {nextDay ? <Card className="relative overflow-hidden border-[#c7f36b]/25 bg-[#c7f36b]/[0.06]"><div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#c7f36b]/10 blur-3xl" /><div className="relative"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c7f36b]">Next up</p><h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{pick(lang, nextDay.day.nameEn, nextDay.day.nameBn)}</h2><p className="mt-2 text-sm text-[#8f9b96]">{nextDay.items.length} exercises <span className="mx-1 text-white/20">Â·</span>about {minutes} minutes</p></div><span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#c7f36b]/30 text-sm font-bold text-[#c7f36b]">GO</span></div><ul className="mt-6 grid gap-2 sm:grid-cols-2">{nextDay.items.slice(0, 4).map((i, index) => <li key={i.pe.id} className="flex items-center justify-between rounded-xl border border-white/8 bg-black/10 px-3 py-2.5 text-sm"><span><span className="mr-2 text-[10px] text-[#c7f36b]">0{index + 1}</span>{pick(lang, i.ex.nameEn, i.ex.nameBn)}</span><span className="text-xs text-[#8f9b96]">{i.pe.sets}Ã—{i.pe.repMin}â€“{i.pe.repMax}</span></li>)}</ul><Link href={"/app/session/" + nextDay.day.id} className={btnPrimary + " mt-6 w-full py-3.5"}>Start Gym Mode <span aria-hidden>â†—</span></Link><p className="mt-3 text-center text-[11px] text-[#8f9b96]">Works offline Â· syncs when you are back online</p></div></Card> : <Card><Eyebrow>First step</Eyebrow><h2 className="text-2xl font-semibold">Build your plan.</h2><p className="mt-2 text-sm leading-6 text-[#8f9b96]">Tell us what you want to achieve and we will create a beginner-friendly week.</p><Link href="/onboarding" className={btnPrimary + " mt-5"}>Start onboarding <span aria-hidden>â†—</span></Link></Card>}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-1"><Card className="!p-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f9b96]">This week</p><div className="mt-2 flex items-end justify-between"><p className="text-3xl font-semibold tracking-[-0.05em]">{stats.weekCount}<span className="text-base text-[#8f9b96]">/{target}</span></p><span className="text-xs text-[#c7f36b]">{stats.weekCount >= target ? "Target hit" : "In motion"}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#c7f36b]" style={{ width: Math.min(100, (stats.weekCount / target) * 100) + "%" }} /></div></Card><Card className="!p-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f9b96]">Streak</p><p className="mt-2 text-3xl font-semibold tracking-[-0.05em]">{stats.streakWeeks}<span className="ml-1 text-base text-[#8f9b96]">weeks</span></p><p className="mt-1 text-xs text-[#8f9b96]">{stats.total} completed sessions</p></Card></div>
    </div>
    <Card><div className="flex items-center justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8f9b96]">Habit runway</p><h2 className="mt-2 text-xl font-semibold">Road to 12 workouts</h2></div><span className="text-sm font-semibold text-[#c7f36b]">{Math.min(stats.total, 12)}/12</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#c7f36b]" style={{ width: toTwelve + "%" }} /></div><p className="mt-3 text-sm text-[#8f9b96]">{T("Consistency beats the perfect plan. Keep showing up.", "à¦¨à¦¿à¦–à§à¦à¦¤ à¦ªà§à¦²à§à¦¯à¦¾à¦¨à§‡à¦° à¦šà§‡à¦¯à¦¼à§‡ à¦¨à¦¿à¦¯à¦¼à¦®à¦¿à¦¤ à¦†à¦¸à¦¾ à¦¬à§‡à¦¶à¦¿ à¦—à§à¦°à§à¦¤à§à¦¬à¦ªà§‚à¦°à§à¦£à¥¤")}</p></Card>
    <div><SectionTitle>Quick access</SectionTitle><div className="grid gap-3 sm:grid-cols-3"><Link href="/app/plan" className="glass shine rounded-2xl p-4 transition hover:-translate-y-1"><span className="text-xs font-bold text-[#c7f36b]">01</span><h3 className="mt-5 font-semibold">View plan</h3><p className="mt-1 text-xs leading-5 text-[#8f9b96]">See every session and why it is here.</p></Link><Link href="/app/audit" className="glass shine rounded-2xl p-4 transition hover:-translate-y-1"><span className="text-xs font-bold text-[#c7f36b]">02</span><h3 className="mt-5 font-semibold">Plan Auditor</h3><p className="mt-1 text-xs leading-5 text-[#8f9b96]">Get a structured second opinion.</p></Link><Link href="/app/library" className="glass shine rounded-2xl p-4 transition hover:-translate-y-1"><span className="text-xs font-bold text-[#c7f36b]">03</span><h3 className="mt-5 font-semibold">Exercise library</h3><p className="mt-1 text-xs leading-5 text-[#8f9b96]">Read cues before you train.</p></Link></div></div>
    <Disclaimer lang={lang} />
  </div>;
}
