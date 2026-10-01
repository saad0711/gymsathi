import { redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { foodLogs, foods } from "@/db/schema";
import { FREE_LIMITS, pick } from "@/lib/constants";
import { todayDhaka } from "@/lib/dates";
import { nutritionTargets } from "@/lib/nutrition";
import { getCurrentUser, getLang, isPremium } from "@/lib/session";
import { Card, Disclaimer, Paywall, SectionTitle } from "@/components/ui";
import { FoodLogger, Hydration } from "@/components/food-logger";

const BUDGET_MEALS = [
  { en: "Egg bhuna + dal + bhat + shak", bn: "ডিম ভুনা + ডাল + ভাত + শাক", bdt: "~৳70", protein: "~28 g" },
  { en: "Soya chunk curry + 2 ruti", bn: "সয়াবিন তরকারি + ২ রুটি", bdt: "~৳50", protein: "~32 g" },
  { en: "Khichuri + boiled egg + salad", bn: "খিচুড়ি + সিদ্ধ ডিম + সালাদ", bdt: "~৳60", protein: "~20 g" },
  { en: "Chicken liver bhuna + bhat", bn: "কলিজা ভুনা + ভাত", bdt: "~৳80", protein: "~32 g" },
  { en: "Banana + 1 glass milk + peanuts", bn: "কলা + ১ গ্লাস দুধ + চিনাবাদাম", bdt: "~৳45", protein: "~16 g" },
  { en: "Chola + muri mix with onion", bn: "ছোলা + মুড়ি মাখা পেঁয়াজসহ", bdt: "~৳30", protein: "~12 g" },
];
const MYTHS = [
  { en: "You need whey protein to build muscle.", bn: "পেশি বানাতে হুই প্রোটিন লাগবেই।", aEn: "No. Protein is protein. Eggs, dal, fish, chicken and soya can cover your needs. Supplements are optional and never magic.", aBn: "না। প্রোটিন মানে প্রোটিন। ডিম, ডাল, মাছ, মুরগি ও সয়াবিনেই চাহিদা মেটে। সাপ্লিমেন্ট ঐচ্ছিক, জাদু নয়।" },
  { en: "Sweating more means burning more fat.", bn: "বেশি ঘামলে বেশি চর্বি ঝরে।", aEn: "Sweat is cooling, not fat loss. Fat loss comes from a steady calorie deficit over weeks.", aBn: "ঘাম শরীর ঠান্ডা করে, চর্বি ঝরায় না। চর্বি কমে সপ্তাহের পর সপ্তাহ নিয়মিত ক্যালরি ঘাটতিতে।" },
  { en: "Skip rice completely to lose weight.", bn: "ওজন কমাতে ভাত পুরোপুরি বাদ দিতে হবে।", aEn: "No. Smaller portions of bhat with protein and vegetables work fine and are easier to keep up.", aBn: "না। প্রোটিন ও সবজির সাথে ভাতের পরিমাণ কমালেই চলে, আর এটি ধরে রাখা সহজ।" },
  { en: "Mass gainer / “fat burner” products are essential.", bn: "মাস গেইনার / “ফ্যাট বার্নার” অপরিহার্য।", aEn: "They aren't. Many are overpriced, and some unregistered products contain unsafe ingredients. Skip anything that promises fast results, and check with a doctor.", aBn: "নয়। অনেকগুলোর দাম বেশি, আর কিছু নিবন্ধনহীন পণ্যে অনিরাপদ উপাদান থাকে। দ্রুত ফলের প্রতিশ্রুতি দেয় এমন কিছু এড়িয়ে চলুন এবং ডাক্তারের পরামর্শ নিন।" },
];

export default async function NutritionPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  const lang = await getLang();
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const premium = isPremium(user);
  const t = nutritionTargets(user);

  const today = todayDhaka();
  const allFoods = await db.select().from(foods).orderBy(asc(foods.nameEn));
  const logs = await db
    .select()
    .from(foodLogs)
    .where(and(eq(foodLogs.userId, user.id), eq(foodLogs.loggedOn, today)))
    .orderBy(asc(foodLogs.id));
  const byId = new Map(allFoods.map((f) => [f.id, f]));
  let kcal = 0, protein = 0;
  for (const l of logs) {
    const f = byId.get(l.foodId);
    if (f) { kcal += f.calories * l.servings; protein += f.protein * l.servings; }
  }
  kcal = Math.round(kcal); protein = Math.round(protein);

  const bar = (v: number, max: number) => (
    <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-lime-400" style={{ width: `${Math.min(100, (v / max) * 100)}%` }} /></div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">🍛 {T("Nutrition", "পুষ্টি")}</h1>
        <p className="text-sm text-slate-400">{T("Local foods, real portions (bati, plate, piece).", "দেশি খাবার, আসল পরিমাপ (বাটি, প্লেট, পিস)।")}</p>
      </div>

      <Card>
        <div className="flex justify-between text-sm"><span>{T("Calories", "ক্যালরি")}</span><span className="text-slate-300">{kcal} / {t.calories} kcal</span></div>
        {bar(kcal, t.calories)}
        <div className="mt-3 flex justify-between text-sm"><span>{T("Protein", "প্রোটিন")}</span><span className="text-slate-300">{protein} / {t.protein} g</span></div>
        {bar(protein, t.protein)}
        <p className="mt-3 text-xs text-slate-500">
          {T(`Targets are estimates from your stats and goal (≈ ${t.carbs} g carbs, ${t.fat} g fat). They're a starting point, not medical advice.`, `লক্ষ্যগুলো আপনার তথ্য ও লক্ষ্য থেকে অনুমান (≈ ${t.carbs} গ্রাম কার্ব, ${t.fat} গ্রাম ফ্যাট)। এগুলো শুরুর ধারণা, চিকিৎসা পরামর্শ নয়।`)}
        </p>
      </Card>

      <SectionTitle>{T("Today's food", "আজকের খাবার")}</SectionTitle>
      <FoodLogger
        lang={lang}
        limit={premium ? null : FREE_LIMITS.foodLogsPerDay}
        foods={allFoods.map((f) => ({ id: f.id, nameEn: f.nameEn, nameBn: f.nameBn, portionEn: f.portionEn, portionBn: f.portionBn, calories: f.calories, protein: f.protein }))}
        logs={logs.map((l) => ({ id: l.id, foodId: l.foodId, servings: l.servings }))}
      />

      <SectionTitle>{T("Hydration", "পানি পান")}</SectionTitle>
      <Card><Hydration lang={lang} glasses={t.glasses} /><p className="mt-2 text-xs text-slate-500">{T(`About ${t.waterL} L a day for your weight. Drink more when it's hot or you sweat a lot.`, `আপনার ওজনে দিনে প্রায় ${t.waterL} লিটার। গরমে বা বেশি ঘামলে আরও পান করুন।`)}</p></Card>

      <SectionTitle>{T("High-protein on a budget", "কম খরচে বেশি প্রোটিন")}</SectionTitle>
      <ul className="space-y-2">
        {BUDGET_MEALS.filter((m) => !(user.dietPref === "veg" && /egg|chicken|liver|ডিম|কলিজা/i.test(m.en + m.bn))).map((m) => (
          <li key={m.en} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-sm">
            <span>{pick(lang, m.en, m.bn)}</span>
            <span className="text-right text-xs text-slate-400">{m.bdt}<br />{m.protein}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-500">{T("Prices are rough estimates and vary by area and season.", "দাম আনুমানিক; এলাকা ও মৌসুমভেদে বদলায়।")}</p>
      {!premium && <Paywall lang={lang} title={T("Weekly meal planner & grocery list", "সাপ্তাহিক মিল প্ল্যানার ও বাজারের তালিকা")} body={T("Budget slider, cutting/bulking variants, full Ramadan plan and unlimited logging are in Premium.", "বাজেট স্লাইডার, কাটিং/বাল্কিং ভ্যারিয়েন্ট, পূর্ণ রমজান প্ল্যান ও আনলিমিটেড লগিং প্রিমিয়ামে।")} />}

      <SectionTitle>{T("Myths & supplements", "ভুল ধারণা ও সাপ্লিমেন্ট")}</SectionTitle>
      <div className="space-y-2">
        {MYTHS.map((m) => (
          <details key={m.en} className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <summary className="font-medium">❌ {pick(lang, m.en, m.bn)}</summary>
            <p className="mt-2 text-sm text-slate-300">{pick(lang, m.aEn, m.aBn)}</p>
          </details>
        ))}
        <details className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <summary className="font-medium">🌙 {T("Training during Ramadan", "রমজানে ব্যায়াম")}</summary>
          <p className="mt-2 text-sm text-slate-300">{T("Train 1–2 hours after iftar, or just before iftar if it's a light session. Drop the volume by about a third, prioritise protein at iftar and sahri, and hydrate well between iftar and sleep. The full Ramadan plan is in Premium.", "ইফতারের ১–২ ঘণ্টা পর, অথবা হালকা সেশন হলে ইফতারের ঠিক আগে ব্যায়াম করুন। ভলিউম প্রায় এক-তৃতীয়াংশ কমান, ইফতার ও সাহরিতে প্রোটিনকে গুরুত্ব দিন এবং ইফতার থেকে ঘুম পর্যন্ত পর্যাপ্ত পানি পান করুন। পূর্ণ রমজান প্ল্যান প্রিমিয়ামে।")}</p>
        </details>
      </div>
      <Disclaimer lang={lang} />
    </div>
  );
}
