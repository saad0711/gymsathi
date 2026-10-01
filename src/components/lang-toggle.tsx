/* eslint-disable react-hooks/immutability */
"use client";

import { useRouter } from "next/navigation";
import { LANG_COOKIE, type Lang } from "@/lib/constants";

export function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter();
  function set(l: Lang) {
    document.cookie = LANG_COOKIE + "=" + l + "; path=/; max-age=31536000; samesite=lax";
    router.refresh();
  }
  return <div className="inline-flex items-center rounded-xl border border-white/12 bg-white/[0.035] p-1" role="group" aria-label="Language">
    {(["en", "bn"] as Lang[]).map((l) => <button key={l} onClick={() => set(l)} className={"rounded-lg px-2.5 py-1.5 text-[10px] font-bold tracking-[0.12em] transition " + (lang === l ? "bg-[#c7f36b] text-[#08100f]" : "text-[#8f9b96] hover:text-white")}>{l === "en" ? "EN" : "BN"}</button>)}
  </div>;
}

