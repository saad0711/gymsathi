"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pick, type Lang } from "@/lib/constants";

const ITEMS = [
  { href: "/app", mark: "01", en: "Today", bn: "আজ" },
  { href: "/app/plan", mark: "02", en: "Plan", bn: "প্ল্যান" },
  { href: "/app/library", mark: "03", en: "Library", bn: "লাইব্রেরি" },
  { href: "/app/progress", mark: "04", en: "Progress", bn: "অগ্রগতি" },
  { href: "/app/more", mark: "05", en: "More", bn: "আরও" },
];

export function BottomNav({ lang }: { lang: Lang }) {
  const path = usePathname();
  if (path.startsWith("/app/session")) return null;
  return <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#07100f]/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden"><ul className="mx-auto flex max-w-md">
    {ITEMS.map((it) => { const active = it.href === "/app" ? path === "/app" : path.startsWith(it.href); return <li key={it.href} className="flex-1"><Link href={it.href} className={"flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-bold transition " + (active ? "bg-[#c7f36b]/10 text-[#c7f36b]" : "text-[#6f7b76] hover:text-white")}><span className={"text-[9px] tracking-[0.16em] " + (active ? "text-[#c7f36b]" : "text-[#6f7b76]")}>{it.mark}</span>{pick(lang, it.en, it.bn)}</Link></li>; })}
  </ul></nav>;
}
