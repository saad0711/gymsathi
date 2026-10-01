import { redirect } from "next/navigation";
import { and, count, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { pick } from "@/lib/constants";
import { getCurrentUser, getLang, isPremium } from "@/lib/session";
import { Card } from "@/components/ui";
import { PremiumActions } from "@/components/premium-actions";

export default async function PremiumPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  const lang = await getLang();
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const premium = isPremium(user);
  const [w] = await db
    .select({ n: count() })
    .from(workouts)
    .where(and(eq(workouts.userId, user.id), isNotNull(workouts.finishedAt)));
  const n = w?.n ?? 0;

  const perks = [
    T("Adaptive plans & multi-phase blocks (hypertrophy, strength, cut)", "অ্যাডাপটিভ প্ল্যান ও বহু-ফেজ ব্লক (হাইপারট্রফি, স্ট্রেংথ, কাট)"),
    T("Unlimited exercise swaps", "আনলিমিটেড ব্যায়াম সোয়াপ"),
    T("Auto weight & rep progression, smart rest times, 30-min time-crunch mode", "অটো ওজন ও রেপ প্রগ্রেশন, স্মার্ট বিশ্রাম, ৩০ মিনিট টাইম-ক্রাঞ্চ মোড"),
    T("Unlimited Trainer Checks with full breakdown and “fix my plan”", "পূর্ণ বিশ্লেষণ ও “প্ল্যান ঠিক করুন” সহ আনলিমিটেড ট্রেনার চেক"),
    T("Advanced analytics, estimated 1RM, CSV export", "উন্নত অ্যানালিটিক্স, আনুমানিক 1RM, CSV এক্সপোর্ট"),
    T("Unlimited food logging", "আনলিমিটেড খাবার লগিং"),
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">⭐ GymSathi Premium</h1>
        <p className="text-sm text-slate-400">{T("Free stays genuinely useful. Premium adds personalisation and depth.", "ফ্রি সত্যিই কাজের থাকবে। প্রিমিয়াম যোগ করে ব্যক্তিগতকরণ ও গভীরতা।")}</p>
      </div>

      {premium && user.premiumUntil && (
        <div className="rounded-2xl border border-lime-400/40 bg-lime-400/10 p-4">
          <p className="font-semibold text-lime-300">✅ {T("Premium is active", "প্রিমিয়াম চালু আছে")}</p>
          <p className="text-sm text-slate-300">{T("Until", "মেয়াদ")} {new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", { dateStyle: "long", timeZone: "Asia/Dhaka" }).format(user.premiumUntil)}</p>
        </div>
      )}

      <Card>
        <ul className="space-y-2 text-sm">
          {perks.map((p) => <li key={p}>✔ {p}</li>)}
        </ul>
        <p className="mt-3 text-xs text-slate-500">{T("Always free: logging, rest timer, gym orientation, safety guidance, streaks, PRs and badges.", "সবসময় ফ্রি: লগিং, রেস্ট টাইমার, জিম পরিচিতি, নিরাপত্তা গাইড, স্ট্রিক, PR ও ব্যাজ।")}</p>
      </Card>

      <PremiumActions lang={lang} trialReady={!user.trialUsed && n >= 3} workouts={n} trialUsed={user.trialUsed} />
    </div>
  );
}
