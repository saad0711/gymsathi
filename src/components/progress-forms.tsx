"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pick, type Lang } from "@/lib/constants";
import { btnPrimary, inputCls } from "@/components/ui";

export function WeightForm({ lang, current }: { lang: Lang; current: number }) {
  const router = useRouter();
  const [w, setW] = useState(String(current));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const T = (en: string, bn: string) => pick(lang, en, bn);

  async function save() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/weight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weightKg: Number(w) }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) setError(data.error ?? "Error");
    else router.refresh();
  }

  return (
    <div>
      <div className="flex gap-2">
        <input type="number" inputMode="decimal" step="0.1" value={w} onChange={(e) => setW(e.target.value)} className={inputCls} aria-label="Weight in kg" />
        <button onClick={save} disabled={busy} className={btnPrimary}>{T("Log", "লগ")}</button>
      </div>
      {error && <p className="mt-1 text-sm text-rose-400">{error}</p>}
    </div>
  );
}

export function DeleteDataButton({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const T = (en: string, bn: string) => pick(lang, en, bn);
  async function del() {
    if (!confirm(T("Delete your profile, plans and all workout history? This cannot be undone.", "আপনার প্রোফাইল, প্ল্যান ও সব ওয়ার্কআউট ইতিহাস মুছে ফেলবেন? এটি ফেরানো যাবে না।"))) return;
    setBusy(true);
    await fetch("/api/me", { method: "DELETE" });
    Object.keys(localStorage).filter((k) => k.startsWith("gs_")).forEach((k) => localStorage.removeItem(k));
    router.push("/");
    router.refresh();
  }
  return (
    <button onClick={del} disabled={busy} className="w-full rounded-xl border border-rose-400/40 bg-rose-400/10 py-3 text-sm font-medium text-rose-300">
      🗑 {T("Delete all my data", "আমার সব ডেটা মুছুন")}
    </button>
  );
}
