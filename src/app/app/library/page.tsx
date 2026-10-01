import Link from "next/link";
import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { exercises } from "@/db/schema";
import { EQUIPMENT_LABELS, MUSCLES, MUSCLE_LABELS, pick, type Equip, type Muscle } from "@/lib/constants";
import { getActivePlan } from "@/lib/plan-queries";
import { getCurrentUser, getLang, isPremium } from "@/lib/session";
import { inputCls } from "@/components/ui";

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ q?: string; m?: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  const lang = await getLang();
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().toLowerCase();
  const m = sp.m && MUSCLES.includes(sp.m as Muscle) ? sp.m : "";
  const premium = isPremium(user);

  const all = await db.select().from(exercises).orderBy(asc(exercises.primaryMuscle), asc(exercises.nameEn));
  const active = await getActivePlan(user.id);
  const inPlan = new Set(active?.days.flatMap((d) => d.items.map((i) => i.ex.id)) ?? []);

  const list = all.filter(
    (e) =>
      (!m || e.primaryMuscle === m) &&
      (!q || e.nameEn.toLowerCase().includes(q) || e.nameBn.includes(q) || e.aliases.some((a) => a.includes(q))),
  );
  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full border px-3 py-1.5 text-sm ${active ? "border-lime-400 bg-lime-400/15 text-lime-200" : "border-white/10 bg-white/5 text-slate-300"}`;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{T("Exercise library", "ব্যায়াম লাইব্রেরি")}</h1>
        <p className="text-sm text-slate-400">{all.length} {T("exercises with Bangla + English guides", "টি ব্যায়াম, বাংলা + ইংরেজি গাইডসহ")}</p>
      </div>
      <form className="flex gap-2">
        <input name="q" defaultValue={sp.q ?? ""} placeholder={T("Search exercises…", "ব্যায়াম খুঁজুন…")} className={inputCls} />
        {m && <input type="hidden" name="m" value={m} />}
      </form>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Link href={q ? `/app/library?q=${encodeURIComponent(q)}` : "/app/library"} className={chip(!m)}>{T("All", "সব")}</Link>
        {MUSCLES.map((x) => (
          <Link key={x} href={`/app/library?m=${x}${q ? `&q=${encodeURIComponent(q)}` : ""}`} className={chip(m === x)}>
            {pick(lang, MUSCLE_LABELS[x].en, MUSCLE_LABELS[x].bn)}
          </Link>
        ))}
      </div>
      <ul className="space-y-2">
        {list.map((e) => {
          const locked = !e.isFree && !premium && !inPlan.has(e.id);
          return (
            <li key={e.id}>
              <Link href={`/app/library/${e.slug}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="font-semibold">{pick(lang, e.nameEn, e.nameBn)}</p>
                  <p className="text-xs text-slate-400">
                    {pick(lang, MUSCLE_LABELS[e.primaryMuscle as Muscle].en, MUSCLE_LABELS[e.primaryMuscle as Muscle].bn)} ·{" "}
                    {e.equipment.map((q2) => pick(lang, EQUIPMENT_LABELS[q2 as Equip].en.split(" (")[0]!, EQUIPMENT_LABELS[q2 as Equip].bn.split(" (")[0]!)).join(" + ")}
                  </p>
                </div>
                <span className="text-lg">{locked ? "🔒" : "›"}</span>
              </Link>
            </li>
          );
        })}
        {list.length === 0 && <li className="text-sm text-slate-500">{T("No exercises found.", "কোনো ব্যায়াম পাওয়া যায়নি।")}</li>}
      </ul>
    </div>
  );
}
