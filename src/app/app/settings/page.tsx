import { redirect } from "next/navigation";
import { EQUIPMENT_LABELS, GOAL_LABELS, INJURY_LABELS, LEVEL_LABELS, pick, type Equip } from "@/lib/constants";
import { getCurrentUser, getLang } from "@/lib/session";
import { Card, Disclaimer, SectionTitle } from "@/components/ui";
import { DeleteDataButton } from "@/components/progress-forms";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  const lang = await getLang();
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const row = (k: string, v: string) => (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <span className="text-slate-400">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  );
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{T("Settings & privacy", "সেটিংস ও গোপনীয়তা")}</h1>
      <Card className="divide-y divide-white/10 !py-2">
        {row(T("Goal", "লক্ষ্য"), pick(lang, GOAL_LABELS[user.goal]?.en ?? "", GOAL_LABELS[user.goal]?.bn ?? ""))}
        {row(T("Experience", "অভিজ্ঞতা"), pick(lang, LEVEL_LABELS[user.level]?.en ?? "", LEVEL_LABELS[user.level]?.bn ?? ""))}
        {row(T("Schedule", "সময়সূচি"), `${user.daysPerWeek} ${T("days", "দিন")} · ${user.sessionMinutes} ${T("min", "মিনিট")}`)}
        {row(T("Train at", "ব্যায়ামের স্থান"), user.location === "gym" ? T("Gym", "জিম") : T("Home", "বাসা"))}
        {row(T("Body", "শরীর"), `${user.age}y · ${user.heightCm} cm · ${user.weightKg} kg`)}
        {row(T("Equipment", "যন্ত্রপাতি"), user.equipment.map((e) => pick(lang, EQUIPMENT_LABELS[e as Equip]?.en.split(" (")[0] ?? e, EQUIPMENT_LABELS[e as Equip]?.bn.split(" (")[0] ?? e)).join(", "))}
        {row(T("Injuries", "আঘাত"), user.injuries.length ? user.injuries.map((i) => pick(lang, INJURY_LABELS[i]?.en ?? i, INJURY_LABELS[i]?.bn ?? i)).join(", ") : T("None", "নেই"))}
      </Card>
      <SectionTitle>{T("Your data", "আপনার ডেটা")}</SectionTitle>
      <p className="text-sm text-slate-400">
        {T(
          "We store only what's needed to build your plan and track progress. There's no sign-up: your data is tied to this device. You can delete everything at any time.",
          "আপনার প্ল্যান বানাতে ও অগ্রগতি দেখাতে যতটুকু দরকার শুধু ততটুকুই রাখা হয়। সাইন-আপ নেই: আপনার ডেটা এই ডিভাইসের সাথে যুক্ত। যেকোনো সময় সব মুছে ফেলতে পারবেন।",
        )}
      </p>
      <DeleteDataButton lang={lang} />
      <Disclaimer lang={lang} />
    </div>
  );
}
