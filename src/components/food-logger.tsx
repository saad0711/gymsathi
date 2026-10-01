/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { pick, type Lang } from "@/lib/constants";
import { btnPrimary, inputCls } from "@/components/ui";

export type FoodItem = {
  id: number;
  nameEn: string;
  nameBn: string;
  portionEn: string;
  portionBn: string;
  calories: number;
  protein: number;
};
export type LogItem = { id: number; foodId: number; servings: number };

export function FoodLogger({
  lang,
  foods,
  logs,
  limit,
}: {
  lang: Lang;
  foods: FoodItem[];
  logs: LogItem[];
  limit: number | null;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [locked, setLocked] = useState(false);
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const reached = limit !== null && logs.length >= limit;

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return foods.slice(0, 8);
    return foods.filter((f) => f.nameEn.toLowerCase().includes(s) || f.nameBn.includes(s)).slice(0, 12);
  }, [q, foods]);

  async function add(foodId: number) {
    setBusy(true);
    const res = await fetch("/api/food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foodId, servings: 1 }),
    });
    setBusy(false);
    if (res.status === 402) setLocked(true);
    else if (res.ok) router.refresh();
  }

  async function remove(id: number) {
    await fetch(`/api/food?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  const byId = new Map(foods.map((f) => [f.id, f]));

  return (
    <div>
      <ul className="space-y-2">
        {logs.length === 0 && <li className="text-sm text-slate-500">{T("Nothing logged yet today.", "à¦†à¦œ à¦à¦–à¦¨à¦“ à¦•à¦¿à¦›à§ à¦²à¦— à¦•à¦°à¦¾ à¦¹à¦¯à¦¼à¦¨à¦¿à¥¤")}</li>}
        {logs.map((l) => {
          const f = byId.get(l.foodId);
          if (!f) return null;
          return (
            <li key={l.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
              <span>
                {pick(lang, f.nameEn, f.nameBn)} <span className="text-slate-500">Â· {pick(lang, f.portionEn, f.portionBn)}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="text-slate-400">{Math.round(f.calories * l.servings)} kcal Â· {Math.round(f.protein * l.servings)}g P</span>
                <button onClick={() => remove(l.id)} aria-label="remove" className="text-slate-500">âœ•</button>
              </span>
            </li>
          );
        })}
      </ul>

      {limit !== null && (
        <p className="mt-2 text-xs text-slate-500">
          {logs.length}/{limit} {T("free entries today", "à¦Ÿà¦¿ à¦«à§à¦°à¦¿ à¦à¦¨à§à¦Ÿà§à¦°à¦¿ à¦†à¦œ")}
        </p>
      )}

      {reached || locked ? (
        <div className="mt-3 rounded-2xl border border-lime-400/30 bg-lime-400/10 p-4">
          <p className="font-semibold text-lime-300">ðŸ”’ {T("Daily free limit reached", "à¦†à¦œà¦•à§‡à¦° à¦«à§à¦°à¦¿ à¦¸à§€à¦®à¦¾ à¦¶à§‡à¦·")}</p>
          <p className="mt-1 text-sm text-slate-300">{T("Premium has unlimited logging and a full weekly meal planner.", "à¦ªà§à¦°à¦¿à¦®à¦¿à¦¯à¦¼à¦¾à¦®à§‡ à¦†à¦¨à¦²à¦¿à¦®à¦¿à¦Ÿà§‡à¦¡ à¦²à¦—à¦¿à¦‚ à¦“ à¦¸à¦¾à¦ªà§à¦¤à¦¾à¦¹à¦¿à¦• à¦®à¦¿à¦² à¦ªà§à¦²à§à¦¯à¦¾à¦¨à¦¾à¦° à¦†à¦›à§‡à¥¤")}</p>
          <Link href="/app/premium" className={`${btnPrimary} mt-3 !py-2 text-sm`}>{T("See Premium", "à¦ªà§à¦°à¦¿à¦®à¦¿à¦¯à¦¼à¦¾à¦® à¦¦à§‡à¦–à§à¦¨")}</Link>
        </div>
      ) : (
        <div className="mt-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={T("Search food: bhat, dal, egg, rutiâ€¦", "à¦–à¦¾à¦¬à¦¾à¦° à¦–à§à¦à¦œà§à¦¨: à¦­à¦¾à¦¤, à¦¡à¦¾à¦², à¦¡à¦¿à¦®, à¦°à§à¦Ÿà¦¿â€¦")} className={inputCls} />
          <ul className="mt-2 max-h-72 space-y-1.5 overflow-y-auto">
            {results.map((f) => (
              <li key={f.id}>
                <button
                  disabled={busy}
                  onClick={() => add(f.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 px-3 py-2 text-left text-sm active:bg-white/10"
                >
                  <span>
                    {pick(lang, f.nameEn, f.nameBn)}
                    <span className="block text-xs text-slate-500">{pick(lang, f.portionEn, f.portionBn)}</span>
                  </span>
                  <span className="text-right text-xs text-slate-400">
                    {f.calories} kcal
                    <br />
                    {f.protein}g P <span className="ml-1 text-lime-400">ï¼‹</span>
                  </span>
                </button>
              </li>
            ))}
            {results.length === 0 && <li className="text-sm text-slate-500">{T("No match.", "à¦•à¦¿à¦›à§ à¦ªà¦¾à¦“à¦¯à¦¼à¦¾ à¦¯à¦¾à¦¯à¦¼à¦¨à¦¿à¥¤")}</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

export function Hydration({ lang, glasses }: { lang: Lang; glasses: number }) {
  const key = `gs_water_${new Date().toISOString().slice(0, 10)}`;
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(Number(localStorage.getItem(key) ?? 0));
  }, [key]);
  const set = (v: number) => {
    const x = Math.max(0, v);
    setN(x);
    localStorage.setItem(key, String(x));
  };
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">
          ðŸ’§ {n}/{glasses}
        </p>
        <p className="text-xs text-slate-400">{pick(lang, "glasses (250 ml)", "à¦—à§à¦²à¦¾à¦¸ (à§¨à§«à§¦ à¦®à¦¿.à¦²à¦¿.)")}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => set(n - 1)} className="h-11 w-11 rounded-xl bg-white/10 text-xl">âˆ’</button>
        <button onClick={() => set(n + 1)} className="h-11 w-11 rounded-xl bg-lime-400 text-xl font-bold text-slate-950">ï¼‹</button>
      </div>
    </div>
  );
}
