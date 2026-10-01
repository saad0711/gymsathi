import Link from "next/link";
import type { ReactNode } from "react";
import { pick, type Lang } from "@/lib/constants";

export const btnPrimary =
  "shine inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c7f36b] px-5 py-3 text-sm font-bold tracking-[-0.01em] text-[#08100f] shadow-[0_10px_30px_rgba(199,243,107,.16)] transition hover:-translate-y-0.5 hover:bg-[#d5fb82] active:translate-y-0 disabled:opacity-50";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.045] px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.09] active:translate-y-0 disabled:opacity-50";
export const inputCls =
  "w-full rounded-2xl border border-white/12 bg-[#0b1513] px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 transition focus:border-[#c7f36b] focus:ring-4 focus:ring-[#c7f36b]/10";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={"glass rounded-[1.5rem] p-5 " + className}>{children}</div>;
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 mt-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8f9b96]"><span className="h-1.5 w-1.5 rounded-full bg-[#c7f36b]" />{children}</h2>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#c7f36b]"><span className="h-1.5 w-1.5 rounded-full bg-[#c7f36b]" />{children}</div>;
}

export function Paywall({ lang, title, body }: { lang: Lang; title: string; body: string }) {
  return <div className="rounded-[1.5rem] border border-[#c7f36b]/30 bg-[#c7f36b]/[0.08] p-5"><p className="font-semibold text-[#c7f36b]"><span className="mr-2 text-[10px] font-bold tracking-[0.2em]">ROADMAP</span>{title}</p><p className="mt-1 text-sm text-slate-300">{body}</p><Link href="/app/premium" className={btnPrimary + " mt-3 !py-2 text-sm"}>{pick(lang, "View roadmap", "রোডম্যাপ দেখুন")}</Link></div>;
}

export function Disclaimer({ lang }: { lang: Lang }) {
  return <p className="mt-8 border-t border-white/8 pt-5 text-xs leading-relaxed text-slate-500">{pick(lang, "GymSathi gives general fitness information, not medical advice. If you have a health condition, feel pain, dizziness or chest discomfort, stop and talk to a doctor.", "GymSathi সাধারণ ফিটনেস তথ্য দেয়, চিকিৎসা পরামর্শ নয়। ব্যথা, মাথা ঘোরা বা বুকে অস্বস্তি হলে ব্যায়াম থামিয়ে চিকিৎসকের সঙ্গে কথা বলুন।")}</p>;
}
