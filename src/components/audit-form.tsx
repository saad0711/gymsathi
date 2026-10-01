"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GOALS, GOAL_LABELS, pick, type Lang } from "@/lib/constants";
import { btnPrimary, inputCls } from "@/components/ui";

export function AuditForm({ lang, defaultGoal, blocked }: { lang: Lang; defaultGoal: string; blocked: boolean }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [goal, setGoal] = useState(defaultGoal);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(blocked);
  const T = (en: string, bn: string) => pick(lang, en, bn);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, goal }),
      });
      const data = await res.json();
      if (res.status === 402) setLimit(true);
      else if (!res.ok) setError(data.error ?? "Error");
      else {
        setText("");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  if (limit) {
    return (
      <div className="rounded-2xl border border-lime-400/30 bg-lime-400/10 p-4">
        <p className="font-semibold text-lime-300">🔒 {T("You've used your free audit", "আপনার ফ্রি অডিট ব্যবহার হয়ে গেছে")}</p>
        <p className="mt-1 text-sm text-slate-300">{T("Premium gives unlimited audits with a full breakdown and a one-tap “fix my plan”.", "প্রিমিয়ামে আনলিমিটেড অডিট, পূর্ণ বিশ্লেষণ এবং এক ট্যাপে “আমার প্ল্যান ঠিক করুন” পাবেন।")}</p>
        <Link href="/app/premium" className={`${btnPrimary} mt-3 !py-2 text-sm`}>{T("See Premium", "প্রিমিয়াম দেখুন")}</Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder={T("Paste your whole week, one exercise per line:\nBench press 4x10\nLat pulldown 3x20\nSquat 3x8-12\nBicep curl 3 sets of 12", "পুরো সপ্তাহের রুটিন, প্রতি লাইনে একটি ব্যায়াম:\nBench press 4x10\nLat pulldown 3x20\nSquat 3x8-12\nBicep curl 3 sets of 12")}
        className={`${inputCls} font-mono text-sm`}
      />
      <label className="block text-sm text-slate-400">
        {T("Your goal", "আপনার লক্ষ্য")}
        <select value={goal} onChange={(e) => setGoal(e.target.value)} className={`${inputCls} mt-1`}>
          {GOALS.map((g) => (
            <option key={g} value={g}>{pick(lang, GOAL_LABELS[g]!.en, GOAL_LABELS[g]!.bn)}</option>
          ))}
        </select>
      </label>
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <button onClick={run} disabled={busy || text.trim().length < 5} className={`${btnPrimary} w-full`}>
        {busy ? T("Checking…", "যাচাই হচ্ছে…") : T("Get a second opinion", "দ্বিতীয় মতামত নিন")}
      </button>
    </div>
  );
}

export function FixPlanButton({ lang, goal }: { lang: Lang; goal: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const T = (en: string, bn: string) => pick(lang, en, bn);
  async function go() {
    setBusy(true);
    const res = await fetch("/api/plan/regenerate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal }),
    });
    setBusy(false);
    if (res.ok) router.push("/app/plan");
  }
  return (
    <button onClick={go} disabled={busy} className={`${btnPrimary} w-full`}>
      {busy ? "…" : `✨ ${T("Fix my plan: build an improved version", "আমার প্ল্যান ঠিক করুন: উন্নত সংস্করণ বানান")}`}
    </button>
  );
}
