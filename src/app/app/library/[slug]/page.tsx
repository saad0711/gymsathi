import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { exercises } from "@/db/schema";
import { EQUIPMENT_LABELS, MUSCLE_LABELS, pick, type Equip, type Muscle } from "@/lib/constants";
import { findAlternatives, getUsableExercises } from "@/lib/exercises";
import { getActivePlan } from "@/lib/plan-queries";
import { getCurrentUser, getLang, isPremium } from "@/lib/session";
import { Card, Paywall, SectionTitle } from "@/components/ui";

export default async function ExercisePage({ params }: { params: Promise<{ slug: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  const lang = await getLang();
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const { slug } = await params;
  const [e] = await db.select().from(exercises).where(eq(exercises.slug, slug)).limit(1);
  if (!e) notFound();

  const premium = isPremium(user);
  const active = await getActivePlan(user.id);
  const inPlan = active?.days.some((d) => d.items.some((i) => i.ex.id === e.id)) ?? false;
  const locked = !e.isFree && !premium && !inPlan;
  const muscle = MUSCLE_LABELS[e.primaryMuscle as Muscle];

  const usable = await getUsableExercises(user);
  const alts = findAlternatives(usable, e).slice(0, 3);

  return (
    <div className="space-y-3">
      <Link href="/app/library" className="text-sm text-slate-400">← {T("Library", "লাইব্রেরি")}</Link>
      <h1 className="text-3xl font-bold">{pick(lang, e.nameEn, e.nameBn)}</h1>
      <p className="text-sm text-slate-400">
        {lang === "en" ? e.nameBn : e.nameEn}
      </p>
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-lime-400/15 px-3 py-1 text-lime-200">{pick(lang, muscle.en, muscle.bn)}</span>
        {e.secondaryMuscles.map((s) => (
          <span key={s} className="rounded-full bg-white/10 px-3 py-1 text-slate-300">{pick(lang, MUSCLE_LABELS[s as Muscle].en, MUSCLE_LABELS[s as Muscle].bn)}</span>
        ))}
        <span className="rounded-full bg-white/10 px-3 py-1 text-slate-300">{e.type === "compound" ? T("Compound", "কম্পাউন্ড") : T("Isolation", "আইসোলেশন")}</span>
      </div>
      <p className="text-sm text-slate-400">
        🧰 {e.equipment.map((q) => pick(lang, EQUIPMENT_LABELS[q as Equip].en, EQUIPMENT_LABELS[q as Equip].bn)).join(" + ")}
      </p>

      {locked ? (
        <Paywall lang={lang} title={T("Premium exercise guide", "প্রিমিয়াম ব্যায়াম গাইড")} body={T("Variations and progressions are part of the full 300+ library. Exercises in your own plan are always unlocked.", "ভ্যারিয়েশন ও প্রগ্রেশন ৩০০+ পূর্ণ লাইব্রেরির অংশ। আপনার প্ল্যানের ব্যায়াম সবসময় খোলা থাকে।")} />
      ) : (
        <>
          <SectionTitle>{T("How to do it", "কীভাবে করবেন")}</SectionTitle>
          <Card>
            <ol className="list-decimal space-y-2 pl-5">
              {(lang === "bn" ? e.stepsBn : e.stepsEn).map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </Card>
          <SectionTitle>{T("Common mistakes", "সাধারণ ভুল")}</SectionTitle>
          <Card className="border-rose-400/20">
            <ul className="list-disc space-y-1 pl-5 text-slate-300">
              {(lang === "bn" ? e.mistakesBn : e.mistakesEn).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </Card>
          {(lang === "bn" ? e.tipBn : e.tipEn) && (
            <Card className="border-lime-400/30 bg-lime-400/10">💡 {lang === "bn" ? e.tipBn : e.tipEn}</Card>
          )}
          {alts.length > 0 && (
            <>
              <SectionTitle>{T("Alternatives", "বিকল্প")}</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {alts.map((a) => (
                  <Link key={a.id} href={`/app/library/${a.slug}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm">
                    {pick(lang, a.nameEn, a.nameBn)}
                  </Link>
                ))}
              </div>
            </>
          )}
        </>
      )}
      <p className="pt-2 text-xs text-slate-500">
        {T("Stop if you feel sharp pain. Soreness is normal; pain is not.", "তীব্র ব্যথা হলে থামুন। মাংসপেশি টনটন করা স্বাভাবিক, ব্যথা নয়।")}
      </p>
    </div>
  );
}
