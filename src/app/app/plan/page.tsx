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
  if (!active) return <p>{T("No plan yet.", "এখনও কোনো প্ল্যান নেই।")}</p>;
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
    full_body: ["Full body", "ফুল বডি"],
    upper_lower: ["Upper / Lower", "আপার / লোয়ার"],
    ppl_upper_lower: ["Push / Pull / Legs + Upper / Lower", "পুশ / পুল / লেগস + আপার / লোয়ার"],
    ppl: ["Push / Pull / Legs", "পুশ / পুল / লেগস"],
  };
  const sl = splitLabel[plan.splitKey] ?? ["Custom", "কাস্টম"];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{pick(lang, goal.en, goal.bn)} · {days.length} {T("days/week", "দিন/সপ্তাহ")}</h1>
        <p className="text-sm text-slate-400">{pick(lang, sl[0], sl[1])} · {T("Week", "সপ্তাহ")} {weekNo}/{plan.weeks}</p>
      </div>

      {isDeload && (
        <div className="rounded-2xl border border-sky-400/40 bg-sky-400/10 p-3 text-sm text-sky-100">
          🛌 <b>{T("Deload week.", "ডিলোড সপ্তাহ।")}</b> {T("Do one fewer set per exercise and use ~10% lighter weights. You'll come back stronger.", "প্রতি ব্যায়ামে এক সেট কম ও ~১০% হালকা ওজনে করুন। আরও শক্তিশালী হয়ে ফিরবেন।")}
        </div>
      )}

      <details className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <summary className="font-semibold text-lime-300">💡 {T("Why this plan?", "কেন এই প্ল্যান?")}</summary>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          {(lang === "bn" ? plan.rationaleBn : plan.rationaleEn).map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      </details>

      <p className="text-xs text-slate-400">
        🔁 {premium ? T("Unlimited swaps (Premium)", "আনলিমিটেড সোয়াপ (প্রিমিয়াম)") : `${left}/${FREE_LIMITS.swapsPerWeek} ${T("free swaps left this week", "টি ফ্রি সোয়াপ বাকি এই সপ্তাহে")}`}
      </p>

      {days.map(({ day, items }) => (
        <Card key={day.id}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{T("Day", "দিন")} {day.dayIndex + 1}: {pick(lang, day.nameEn, day.nameBn)}</h2>
            <Link href={`/app/session/${day.id}`} className="rounded-lg bg-lime-400 px-3 py-1.5 text-sm font-semibold text-slate-950">▶</Link>
          </div>
          <ul className="mt-3 divide-y divide-white/10">
            {items.map(({ pe, ex }) => (
              <li key={pe.id} className="flex items-start justify-between gap-2 py-2.5">
                <div>
                  <Link href={`/app/library/${ex.slug}`} className="font-medium">{pick(lang, ex.nameEn, ex.nameBn)}</Link>
                  <p className="text-xs text-slate-400">
                    {pe.sets} × {pe.repMin}–{pe.repMax} · {T("rest", "বিশ্রাম")} {pe.restSec}s · RIR {pe.rir}
                  </p>
                </div>
                <SwapButton planExerciseId={pe.id} lang={lang} />
              </li>
            ))}
          </ul>
        </Card>
      ))}

      <SectionTitle>{T("Phases & regeneration", "ফেজ ও নতুন প্ল্যান")}</SectionTitle>
      {premium ? (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">{T("Start a new block with a different focus:", "ভিন্ন ফোকাসে নতুন ব্লক শুরু করুন:")}</p>
          <RegenerateButtons lang={lang} />
        </div>
      ) : (
        <Paywall lang={lang} title={T("Adaptive, multi-phase plans", "অ্যাডাপটিভ, বহু-ফেজ প্ল্যান")} body={T("Switch between hypertrophy, strength and cutting blocks, with unlimited swaps.", "হাইপারট্রফি, স্ট্রেংথ ও কাটিং ব্লকের মধ্যে বদলান, আনলিমিটেড সোয়াপসহ।")} />
      )}
    </div>
  );
}
