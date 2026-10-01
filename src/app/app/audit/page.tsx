import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { audits } from "@/db/schema";
import { FREE_LIMITS, GOAL_LABELS, MUSCLES, MUSCLE_LABELS, pick } from "@/lib/constants";
import { getCurrentUser, getLang, isPremium } from "@/lib/session";
import { Card, Paywall, SectionTitle } from "@/components/ui";
import { AuditForm, FixPlanButton } from "@/components/audit-form";

const SEV = {
  high: { icon: "🔴", cls: "border-rose-400/30 bg-rose-400/10" },
  medium: { icon: "🟠", cls: "border-amber-400/30 bg-amber-400/10" },
  low: { icon: "🟡", cls: "border-yellow-300/20 bg-yellow-300/5" },
  good: { icon: "🟢", cls: "border-lime-400/30 bg-lime-400/10" },
} as const;

export default async function AuditPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  const lang = await getLang();
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const premium = isPremium(user);

  const past = await db.select().from(audits).where(eq(audits.userId, user.id)).orderBy(desc(audits.createdAt)).limit(5);
  const latest = past[0];
  const r = latest?.result;
  const blocked = !premium && past.length >= FREE_LIMITS.audits;
  const maxSets = r ? Math.max(1, ...Object.values(r.weeklySets)) : 1;
  const shown = r ? (premium ? r.findings : r.findings.slice(0, 3)) : [];
  const scoreColor = !r ? "" : r.score >= 80 ? "text-lime-400" : r.score >= 60 ? "text-amber-300" : "text-rose-400";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">🔍 {T("Trainer Check", "ট্রেনার চেক")}</h1>
        <p className="text-sm text-slate-400">
          {T("Got a routine from your trainer? Paste it for a friendly second opinion on volume, balance and rep ranges. It's a conversation-starter, not a verdict.", "ট্রেনারের দেওয়া রুটিন আছে? ভলিউম, ভারসাম্য ও রেপ রেঞ্জ নিয়ে বন্ধুত্বপূর্ণ দ্বিতীয় মতামতের জন্য পেস্ট করুন। এটি আলোচনার শুরু, রায় নয়।")}
        </p>
      </div>

      {r && latest && (
        <>
          <Card className="text-center">
            <p className="text-sm text-slate-400">{T("Plan score", "প্ল্যান স্কোর")}</p>
            <p className={`text-6xl font-extrabold ${scoreColor}`}>{r.score}<span className="text-2xl text-slate-500">/100</span></p>
            <p className="text-xs text-slate-500">{T("Goal", "লক্ষ্য")}: {pick(lang, GOAL_LABELS[r.goal]?.en ?? r.goal, GOAL_LABELS[r.goal]?.bn ?? r.goal)} · {r.lines.length} {T("exercises read", "টি ব্যায়াম পড়া হয়েছে")}</p>
          </Card>

          <SectionTitle>{T("Key findings", "মূল পর্যবেক্ষণ")}</SectionTitle>
          <ul className="space-y-2">
            {shown.map((f, i) => (
              <li key={i} className={`rounded-2xl border p-3 text-sm ${SEV[f.severity].cls}`}>
                {SEV[f.severity].icon} {pick(lang, f.en, f.bn)}
              </li>
            ))}
          </ul>
          {!premium && r.findings.length > 3 && (
            <Paywall lang={lang} title={T(`${r.findings.length - 3} more findings`, `আরও ${r.findings.length - 3}টি পর্যবেক্ষণ`)} body={T("Unlock the full breakdown, unlimited audits and one-tap “fix my plan”.", "পূর্ণ বিশ্লেষণ, আনলিমিটেড অডিট ও এক ট্যাপে “প্ল্যান ঠিক করুন” আনলক করুন।")} />
          )}

          {premium ? (
            <>
              <SectionTitle>{T("Weekly sets per muscle", "প্রতি পেশিতে সাপ্তাহিক সেট")}</SectionTitle>
              <Card>
                <ul className="space-y-2 text-sm">
                  {MUSCLES.map((m) => {
                    const n = r.weeklySets[m] ?? 0;
                    return (
                      <li key={m} className="flex items-center gap-3">
                        <span className="w-24 shrink-0 text-slate-300">{pick(lang, MUSCLE_LABELS[m].en, MUSCLE_LABELS[m].bn)}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-lime-400" style={{ width: `${(n / maxSets) * 100}%` }} /></div>
                        <span className="w-6 text-right tabular-nums">{n}</span>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-3 text-xs text-slate-400">
                  {T("Push", "পুশ")} {r.split.push} · {T("Pull", "পুল")} {r.split.pull} · {T("Legs", "লেগস")} {r.split.legs} · {T("Core", "কোর")} {r.split.core}
                </p>
              </Card>
              {r.unrecognized.length > 0 && (
                <p className="text-xs text-slate-500">{T("Couldn't read:", "পড়া যায়নি:")} {r.unrecognized.slice(0, 5).join("; ")}</p>
              )}
              <FixPlanButton lang={lang} goal={r.goal} />
            </>
          ) : (
            <Paywall lang={lang} title={T("Detailed breakdown & “Fix my plan”", "বিস্তারিত বিশ্লেষণ ও “প্ল্যান ঠিক করুন”")} body={T("See sets per muscle, push/pull/legs balance, and generate an improved plan with one tap.", "প্রতি পেশির সেট, পুশ/পুল/লেগস ভারসাম্য দেখুন এবং এক ট্যাপে উন্নত প্ল্যান বানান।")} />
          )}
        </>
      )}

      <SectionTitle>{r ? T("Check another routine", "আরেকটি রুটিন যাচাই করুন") : T("Paste a routine", "রুটিন পেস্ট করুন")}</SectionTitle>
      <AuditForm lang={lang} defaultGoal={user.goal} blocked={blocked} />
      <p className="text-xs text-slate-500">
        {T("Audits are rule-based and general. They can't see your form, injuries or context. A good trainer adds a lot we can't.", "অডিট নিয়ম-ভিত্তিক ও সাধারণ। এটি আপনার ফর্ম, আঘাত বা প্রেক্ষাপট দেখতে পায় না। একজন ভালো ট্রেনার এমন অনেক কিছু যোগ করেন যা আমরা পারি না।")}
      </p>
    </div>
  );
}
