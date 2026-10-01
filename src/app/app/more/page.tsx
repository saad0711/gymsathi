import Link from "next/link";
import { redirect } from "next/navigation";
import { pick } from "@/lib/constants";
import { getCurrentUser, getLang, isPremium } from "@/lib/session";

export default async function MorePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  const lang = await getLang();
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const premium = isPremium(user);
  const items = [
    { href: "/app/audit", icon: "🔍", en: "Trainer Check", bn: "ট্রেনার চেক", dEn: "Second opinion on a routine", dBn: "রুটিনের দ্বিতীয় মতামত" },
    { href: "/app/nutrition", icon: "🍛", en: "Nutrition", bn: "পুষ্টি", dEn: "Local foods, targets, budget meals", dBn: "দেশি খাবার, লক্ষ্য, বাজেট মিল" },
    { href: "/app/guide", icon: "🧭", en: "Gym guide & safety", bn: "জিম গাইড ও নিরাপত্তা", dEn: "First day, etiquette, pain guidance", dBn: "প্রথম দিন, শিষ্টাচার, ব্যথার নির্দেশনা" },
    { href: "/app/premium", icon: "⭐", en: premium ? "Premium (active)" : "Go Premium", bn: premium ? "প্রিমিয়াম (চালু)" : "প্রিমিয়াম নিন", dEn: "Plans, trial, promo codes", dBn: "প্ল্যান, ট্রায়াল, প্রোমো কোড" },
    { href: "/app/settings", icon: "⚙️", en: "Settings & privacy", bn: "সেটিংস ও গোপনীয়তা", dEn: "Language, your data", dBn: "ভাষা, আপনার ডেটা" },
  ];
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-bold">{T("More", "আরও")}</h1>
      {items.map((it) => (
        <Link key={it.href} href={it.href} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <span className="text-3xl">{it.icon}</span>
          <span>
            <span className="block font-semibold">{pick(lang, it.en, it.bn)}</span>
            <span className="block text-xs text-slate-400">{pick(lang, it.dEn, it.dBn)}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
