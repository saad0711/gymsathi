/* eslint-disable react-hooks/purity */
import Link from "next/link";
import { redirect } from "next/navigation";
import { count, eq, and, gte } from "drizzle-orm";
import { db } from "@/db";
import { swaps } from "@/db/schema";
import { FREE_LIMITS, GOAL_LABELS, pick } from "@/lib/constants";
import { getActivePlan } from "@/lib/plan-queries";
import { getCurrentUser, getLang, isPremium } from "@/lib/session";
import { Card, Paywall, SectionTitle } from "@/components/ui";
import { RegenerateButtons, SwapButton } from "@/components/plan-actions";

export default async function PlanPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  const lang = await getLang();
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const premium = isPremium(user);
  const active = await getActivePlan(user.id);
  if (!active) return <p>{T("No plan yet.", "à¦à¦–à¦¨à¦“ à¦•à§‹à¦¨à§‹ à¦ªà§à¦²à§à¦¯à¦¾à¦¨ à¦¨à§‡à¦‡à¥¤")}</p>;
  const { plan, days } = active;

  const [used] = await db
    .select({ n: count() })
    .from(swaps)
    .where(and(eq(swaps.userId, user.id), gte(swaps.createdAt, new Date(Date.now() - 7 * 86400000))));
  const left = Math.max(0, FREE_LIMITS.swapsPerWeek - (used?.n ?? 0));

  const weekNo = Math.min(plan.weeks, Math.floor((Date.now() - plan.createdAt.getTime()) / (7 * 86400000)) + 1);
  const isDeload = weekNo >= plan.weeks;
  const goal = GOAL_LABELS[plan.goal] ?? GOAL_LABELS.general!;
  const splitLabel: Record<string, [string, string]> = {
    full_body: ["Full body", "à¦«à§à¦² à¦¬à¦¡à¦¿"],
    upper_lower: ["Upper / Lower", "à¦†à¦ªà¦¾à¦° / à¦²à§‹à¦¯à¦¼à¦¾à¦°"],
    ppl_upper_lower: ["Push / Pull / Legs + Upper / Lower", "à¦ªà§à¦¶ / à¦ªà§à¦² / à¦²à§‡à¦—à¦¸ + à¦†à¦ªà¦¾à¦° / à¦²à§‹à¦¯à¦¼à¦¾à¦°"],
    ppl: ["Push / Pull / Legs", "à¦ªà§à¦¶ / à¦ªà§à¦² / à¦²à§‡à¦—à¦¸"],
  };
  const sl = splitLabel[plan.splitKey] ?? ["Custom", "à¦•à¦¾à¦¸à§à¦Ÿà¦®"];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{pick(lang, goal.en, goal.bn)} Â· {days.length} {T("days/week", "à¦¦à¦¿à¦¨/à¦¸à¦ªà§à¦¤à¦¾à¦¹")}</h1>
        <p className="text-sm text-slate-400">{pick(lang, sl[0], sl[1])} Â· {T("Week", "à¦¸à¦ªà§à¦¤à¦¾à¦¹")} {weekNo}/{plan.weeks}</p>
      </div>

      {isDeload && (
        <div className="rounded-2xl border border-sky-400/40 bg-sky-400/10 p-3 text-sm text-sky-100">
          ðŸ›Œ <b>{T("Deload week.", "à¦¡à¦¿à¦²à§‹à¦¡ à¦¸à¦ªà§à¦¤à¦¾à¦¹à¥¤")}</b> {T("Do one fewer set per exercise and use ~10% lighter weights. You'll come back stronger.", "à¦ªà§à¦°à¦¤à¦¿ à¦¬à§à¦¯à¦¾à¦¯à¦¼à¦¾à¦®à§‡ à¦à¦• à¦¸à§‡à¦Ÿ à¦•à¦® à¦“ ~à§§à§¦% à¦¹à¦¾à¦²à¦•à¦¾ à¦“à¦œà¦¨à§‡ à¦•à¦°à§à¦¨à¥¤ à¦†à¦°à¦“ à¦¶à¦•à§à¦¤à¦¿à¦¶à¦¾à¦²à§€ à¦¹à¦¯à¦¼à§‡ à¦«à¦¿à¦°à¦¬à§‡à¦¨à¥¤")}
        </div>
      )}

      <details className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <summary className="font-semibold text-lime-300">ðŸ’¡ {T("Why this plan?", "à¦•à§‡à¦¨ à¦à¦‡ à¦ªà§à¦²à§à¦¯à¦¾à¦¨?")}</summary>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          {(lang === "bn" ? plan.rationaleBn : plan.rationaleEn).map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </details>

      <p className="text-xs text-slate-400">
        ðŸ” {premium ? T("Unlimited swaps (Premium)", "à¦†à¦¨à¦²à¦¿à¦®à¦¿à¦Ÿà§‡à¦¡ à¦¸à§‹à¦¯à¦¼à¦¾à¦ª (à¦ªà§à¦°à¦¿à¦®à¦¿à¦¯à¦¼à¦¾à¦®)") : `${left}/${FREE_LIMITS.swapsPerWeek} ${T("free swaps left this week", "à¦Ÿà¦¿ à¦«à§à¦°à¦¿ à¦¸à§‹à¦¯à¦¼à¦¾à¦ª à¦¬à¦¾à¦•à¦¿ à¦à¦‡ à¦¸à¦ªà§à¦¤à¦¾à¦¹à§‡")}`}
      </p>

      {days.map(({ day, items }) => (
        <Card key={day.id}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{T("Day", "à¦¦à¦¿à¦¨")} {day.dayIndex + 1}: {pick(lang, day.nameEn, day.nameBn)}</h2>
            <Link href={`/app/session/${day.id}`} className="rounded-lg bg-lime-400 px-3 py-1.5 text-sm font-semibold text-slate-950">â–¶</Link>
          </div>
          <ul className="mt-3 divide-y divide-white/10">
            {items.map(({ pe, ex }) => (
              <li key={pe.id} className="flex items-start justify-between gap-2 py-2.5">
                <div>
                  <Link href={`/app/library/${ex.slug}`} className="font-medium">{pick(lang, ex.nameEn, ex.nameBn)}</Link>
                  <p className="text-xs text-slate-400">
                    {pe.sets} Ã— {pe.repMin}â€“{pe.repMax} Â· {T("rest", "à¦¬à¦¿à¦¶à§à¦°à¦¾à¦®")} {pe.restSec}s Â· RIR {pe.rir}
                  </p>
                </div>
                <SwapButton planExerciseId={pe.id} lang={lang} />
              </li>
            ))}
          </ul>
        </Card>
      ))}

      <SectionTitle>{T("Phases & regeneration", "à¦«à§‡à¦œ à¦“ à¦¨à¦¤à§à¦¨ à¦ªà§à¦²à§à¦¯à¦¾à¦¨")}</SectionTitle>
      {premium ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">{T("Start a new block with a different focus:", "à¦­à¦¿à¦¨à§à¦¨ à¦«à§‹à¦•à¦¾à¦¸à§‡ à¦¨à¦¤à§à¦¨ à¦¬à§à¦²à¦• à¦¶à§à¦°à§ à¦•à¦°à§à¦¨:")}</p>
          <RegenerateButtons lang={lang} />
        </div>
      ) : (
        <Paywall lang={lang} title={T("Adaptive, multi-phase plans", "à¦…à§à¦¯à¦¾à¦¡à¦¾à¦ªà¦Ÿà¦¿à¦­, à¦¬à¦¹à§-à¦«à§‡à¦œ à¦ªà§à¦²à§à¦¯à¦¾à¦¨")} body={T("Switch between hypertrophy, strength and cutting blocks, with unlimited swaps.", "à¦¹à¦¾à¦‡à¦ªà¦¾à¦°à¦Ÿà§à¦°à¦«à¦¿, à¦¸à§à¦Ÿà§à¦°à§‡à¦‚à¦¥ à¦“ à¦•à¦¾à¦Ÿà¦¿à¦‚ à¦¬à§à¦²à¦•à§‡à¦° à¦®à¦§à§à¦¯à§‡ à¦¬à¦¦à¦²à¦¾à¦¨, à¦†à¦¨à¦²à¦¿à¦®à¦¿à¦Ÿà§‡à¦¡ à¦¸à§‹à¦¯à¦¼à¦¾à¦ªà¦¸à¦¹à¥¤")} />
      )}
    </div>
  );
}

