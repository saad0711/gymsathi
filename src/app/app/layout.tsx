import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { LangToggle } from "@/components/lang-toggle";
import { SyncPending } from "@/components/sync-pending";
import { ensureSeeded } from "@/lib/seed";
import { getCurrentUser, getLang } from "@/lib/session";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/app", label: "Today", mark: "01" },
  { href: "/app/plan", label: "My plan", mark: "02" },
  { href: "/app/library", label: "Library", mark: "03" },
  { href: "/app/progress", label: "Progress", mark: "04" },
];

function Brand() {
  return <Link href="/app" className="flex items-center gap-2.5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#c7f36b] text-xs font-black text-[#08100f]">GS</span><span className="font-semibold tracking-[-0.03em]">Gym<span className="text-[#c7f36b]">Sathi</span></span></Link>;
}

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/onboarding");
  await ensureSeeded();
  const lang = await getLang();
  return <div className="min-h-screen"><SyncPending /><div className="mx-auto flex min-h-screen max-w-7xl">
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/8 px-5 py-6 lg:flex"><Brand /><div className="mt-12"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f7b76]">Your space</p><nav className="space-y-1">{NAV.map((item) => <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#8f9b96] transition hover:bg-white/5 hover:text-white"><span className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 text-[10px] font-bold text-[#6f7b76] transition group-hover:border-[#c7f36b]/40 group-hover:text-[#c7f36b]">{item.mark}</span>{item.label}</Link>)}</nav></div><div className="mt-auto rounded-2xl border border-[#c7f36b]/20 bg-[#c7f36b]/[0.07] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c7f36b]">Closed pilot</p><p className="mt-2 text-sm font-semibold">One plan. One next step.</p><p className="mt-1 text-xs leading-5 text-[#8f9b96]">Everything in this pilot is free while we validate the workout loop.</p></div></aside>
    <div className="min-w-0 flex-1"><header className="sticky top-0 z-20 border-b border-white/8 bg-[#07100f]/80 backdrop-blur-xl"><div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 lg:px-10"><div className="lg:hidden"><Brand /></div><div className="hidden items-center gap-2 text-xs text-[#8f9b96] lg:flex"><span className="h-2 w-2 rounded-full bg-[#c7f36b]" />Pilot mode <span className="text-white/20">/</span> guest profile</div><div className="ml-auto flex items-center gap-3"><span className="hidden text-xs text-[#8f9b96] sm:inline">Saved locally</span><LangToggle lang={lang} /><Link href="/app/more" className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-xs text-[#8f9b96] transition hover:border-white/20 hover:text-white" aria-label="More settings">•••</Link></div></div></header><main className="mx-auto max-w-5xl px-5 pb-28 pt-8 lg:px-10 lg:pb-12">{children}</main></div>
  </div><BottomNav lang={lang} /></div>;
}
