"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { pick, type Lang } from "@/lib/constants";

export function SwapButton({ planExerciseId, lang }: { planExerciseId: number; lang: Lang }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const T = (en: string, bn: string) => pick(lang, en, bn);

  async function swap() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/plan/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planExerciseId }),
      });
      const data = await res.json();
      if (res.status === 402) {
        setLocked(true);
        setMsg(T("You've used your 3 free swaps this week.", "এই সপ্তাহের ৩টি ফ্রি সোয়াপ শেষ।"));
      } else if (!res.ok) {
        setMsg(data.error === "no_alternative" ? T("No alternative with your equipment.", "আপনার যন্ত্রে বিকল্প নেই।") : T("Couldn't swap.", "সোয়াপ হয়নি।"));
      } else {
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="text-right">
      <button onClick={swap} disabled={busy} className="rounded-lg border border-white/15 px-2.5 py-1 text-xs text-slate-300 disabled:opacity-50">
        🔁 {T("Swap", "বদলান")}
      </button>
      {msg && (
        <p className="mt-1 text-xs text-amber-300">
          {msg}{" "}
          {locked && (
            <Link href="/app/premium" className="underline">
              {T("Unlimited swaps →", "আনলিমিটেড সোয়াপ →")}
            </Link>
          )}
        </p>
      )}
    </div>
  );
}

export function RegenerateButtons({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const phases = [
    { goal: "muscle_gain", en: "Hypertrophy", bn: "পেশি বৃদ্ধি" },
    { goal: "strength", en: "Strength", bn: "শক্তি" },
    { goal: "fat_loss", en: "Cut", bn: "কাট (চর্বি কমানো)" },
  ];
  async function go(goal: string) {
    if (!confirm(T("Create a new plan for this phase? Your current plan is kept in history.", "এই ফেজের জন্য নতুন প্ল্যান বানাবেন? বর্তমান প্ল্যান ইতিহাসে থাকবে।"))) return;
    setBusy(goal);
    await fetch("/api/plan/regenerate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal }),
    });
    setBusy(null);
    router.refresh();
  }
  return (
    <div className="flex flex-wrap gap-2">
      {phases.map((p) => (
        <button
          key={p.goal}
          onClick={() => go(p.goal)}
          disabled={busy !== null}
          className="rounded-xl border border-lime-400/40 bg-lime-400/10 px-3 py-2 text-sm text-lime-200 disabled:opacity-50"
        >
          {busy === p.goal ? "…" : pick(lang, p.en, p.bn)}
        </button>
      ))}
    </div>
  );
}
