/* eslint-disable react-hooks/set-state-in-effect, react-hooks/purity */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BADGES, pick, type Lang } from "@/lib/constants";
import { PENDING_KEY } from "@/components/sync-pending";

export type SessionExercise = {
  key: string;
  exerciseId: number;
  slug: string;
  nameEn: string;
  nameBn: string;
  sets: number;
  repMin: number;
  repMax: number;
  restSec: number;
  rir: number;
  last: { weightKg: number; reps: number }[] | null;
  startWeight: number;
  noteEn: string | null;
  noteBn: string | null;
  stepsEn: string[];
  stepsBn: string[];
  tipEn: string;
  tipBn: string;
  bodyweight: boolean;
};

type Logged = { weightKg: number; reps: number };
type Phase = "warmup" | "work" | "done";
type Result = {
  prs: { exerciseId: number; nameEn: string; nameBn: string; weightKg: number; reps: number }[];
  newBadges: string[];
  offline: boolean;
};

type Props = {
  dayId: number;
  dayNameEn: string;
  dayNameBn: string;
  lang: Lang;
  exercises: SessionExercise[];
  isPremium: boolean;
  lite: boolean;
  warmupEn: string[];
  warmupBn: string[];
  cooldownEn: string[];
  cooldownBn: string[];
};

function cue() {
  try {
    navigator.vibrate?.([300, 100, 300]);
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.15;
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    /* ignore */
  }
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
const big = "h-14 w-14 shrink-0 rounded-2xl bg-white/10 text-3xl font-bold text-slate-100 active:bg-white/20";

export function GymMode(p: Props) {
  const router = useRouter();
  const T = useCallback((en: string, bn: string) => pick(p.lang, en, bn), [p.lang]);
  const storeKey = `gs_session_${p.dayId}${p.lite ? "_lite" : ""}`;

  const [phase, setPhase] = useState<Phase>("warmup");
  const [idx, setIdx] = useState(0);
  const [list, setList] = useState<SessionExercise[]>(p.exercises);
  const [logged, setLogged] = useState<Record<string, Logged[]>>({});
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(10);
  const [restEnd, setRestEnd] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [howTo, setHowTo] = useState(false);
  const [busyOpen, setBusyOpen] = useState(false);
  const [alts, setAlts] = useState<Omit<SessionExercise, "key" | "sets" | "repMin" | "repMax" | "restSec" | "rir">[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [checked, setChecked] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const cued = useRef(false);

  const ex = list[idx];

  // restore an unfinished session (works offline)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) {
        const s = JSON.parse(raw) as { startedAt: number; phase: Phase; idx: number; list: SessionExercise[]; logged: Record<string, Logged[]> };
        if (s.phase !== "done" && Array.isArray(s.list) && s.list.length === p.exercises.length) {
          setStartedAt(s.startedAt);
          setPhase(s.phase);
          setIdx(Math.min(s.idx, s.list.length - 1));
          setList(s.list);
          setLogged(s.logged ?? {});
        }
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [storeKey, p.exercises.length]);

  useEffect(() => {
    if (!hydrated || phase === "done") return;
    localStorage.setItem(storeKey, JSON.stringify({ startedAt, phase, idx, list, logged }));
  }, [hydrated, storeKey, startedAt, phase, idx, list, logged]);

  // keep the screen awake
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    navigator.wakeLock?.request("screen").then((l) => (lock = l)).catch(() => undefined);
    return () => {
      lock?.release().catch(() => undefined);
    };
  }, []);

  // initial weight/reps for the current exercise
  const curKey = ex?.key;
  useEffect(() => {
    if (!ex) return;
    const done = logged[ex.key];
    const lastLogged = done?.[done.length - 1];
    setWeight(lastLogged?.weightKg ?? ex.startWeight);
    setReps(lastLogged?.reps ?? Math.round((ex.repMin + ex.repMax) / 2));
    setHowTo(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, curKey]);

  // rest timer
  useEffect(() => {
    if (restEnd === null) return;
    cued.current = false;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [restEnd]);
  const remaining = restEnd === null ? 0 : Math.max(0, Math.ceil((restEnd - now) / 1000));
  useEffect(() => {
    if (restEnd !== null && remaining === 0 && !cued.current) {
      cued.current = true;
      cue();
    }
  }, [remaining, restEnd]);

  const startRest = (sec: number) => {
    setNow(Date.now());
    setRestEnd(Date.now() + sec * 1000);
  };

  if (!ex && phase !== "done") return null;
  const doneSets = ex ? (logged[ex.key] ?? []) : [];
  const setsComplete = ex ? doneSets.length >= ex.sets : false;
  const isLast = idx === list.length - 1;
  const restSec = (e: SessionExercise) => (p.isPremium ? e.restSec : 90);
  const step = ex && !ex.bodyweight ? 2.5 : 1;

  function logSet() {
    if (!ex) return;
    const cur = logged[ex.key] ?? [];
    if (cur.length >= ex.sets + 2) return;
    setLogged({ ...logged, [ex.key]: [...cur, { weightKg: weight, reps }] });
    const finishedEx = cur.length + 1 >= ex.sets;
    if (!(finishedEx && isLast)) startRest(restSec(ex));
  }

  function undoSet() {
    if (!ex) return;
    const cur = logged[ex.key] ?? [];
    setLogged({ ...logged, [ex.key]: cur.slice(0, -1) });
  }

  async function openAlternatives() {
    if (!ex) return;
    setBusyOpen(true);
    setAlts(null);
    try {
      const res = await fetch(`/api/exercises/alternatives?exerciseId=${ex.exerciseId}&repMax=${ex.repMax}`);
      setAlts(res.ok ? await res.json() : []);
    } catch {
      setAlts([]);
    }
  }

  function substitute(a: NonNullable<typeof alts>[number]) {
    setList((l) => l.map((e, i) => (i === idx ? { ...e, ...a } : e)));
    setBusyOpen(false);
  }

  async function finish() {
    const sets = list.flatMap((e) =>
      (logged[e.key] ?? []).map((s, i) => ({ exerciseId: e.exerciseId, setNumber: i + 1, weightKg: s.weightKg, reps: s.reps })),
    );
    if (!sets.length) {
      setError(T("Log at least one set first.", "à¦†à¦—à§‡ à¦…à¦¨à§à¦¤à¦¤ à¦à¦•à¦Ÿà¦¿ à¦¸à§‡à¦Ÿ à¦²à¦— à¦•à¦°à§à¦¨à¥¤"));
      return;
    }
    setSaving(true);
    setError(null);
    const payload = { planDayId: p.dayId, startedAt, sets };
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setResult({ prs: data.prs ?? [], newBadges: data.newBadges ?? [], offline: false });
    } catch (e) {
      if (e instanceof TypeError) {
        // no signal: queue locally and sync later
        const q = JSON.parse(localStorage.getItem(PENDING_KEY) ?? "[]") as unknown[];
        q.push(payload);
        localStorage.setItem(PENDING_KEY, JSON.stringify(q));
        setResult({ prs: [], newBadges: [], offline: true });
      } else {
        setError(e instanceof Error ? e.message : "Error");
        setSaving(false);
        return;
      }
    }
    localStorage.removeItem(storeKey);
    setRestEnd(null);
    setPhase("done");
    setSaving(false);
  }

  const totalLogged = list.reduce((n, e) => n + (logged[e.key]?.length ?? 0), 0);
  const volume = list.reduce((n, e) => n + (logged[e.key] ?? []).reduce((a, s) => a + s.weightKg * s.reps, 0), 0);

  // ---------- WARM-UP ----------
  if (phase === "warmup") {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-6">
        <Link href="/app" className="text-sm text-slate-400">â† {T("Back", "à¦«à¦¿à¦°à§à¦¨")}</Link>
        <h1 className="mt-3 text-2xl font-bold">{pick(p.lang, p.dayNameEn, p.dayNameBn)}</h1>
        <p className="text-sm text-slate-400">
          {list.length} {T("exercises", "à¦Ÿà¦¿ à¦¬à§à¦¯à¦¾à¦¯à¦¼à¦¾à¦®")} {p.lite && `Â· ${T("lighter re-entry session", "à¦¹à¦¾à¦²à¦•à¦¾ à¦ªà§à¦¨à¦°à¦¾à¦¯à¦¼ à¦¶à§à¦°à§à¦° à¦¸à§‡à¦¶à¦¨")}`}
        </p>
        <h2 className="mb-2 mt-6 font-semibold text-lime-400">ðŸ”¥ {T("Warm-up (5 min)", "à¦“à¦¯à¦¼à¦¾à¦°à§à¦®-à¦†à¦ª (à§« à¦®à¦¿à¦¨à¦¿à¦Ÿ)")}</h2>
        <ul className="space-y-2">
          {pick(p.lang, p.warmupEn.join("|"), p.warmupBn.join("|")).split("|").map((w, i) => (
            <li key={i}>
              <button
                onClick={() => setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]))}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left ${
                  checked.includes(i) ? "border-lime-400/50 bg-lime-400/10 text-slate-400 line-through" : "border-white/10 bg-white/5"
                }`}
              >
                <span className="text-xl">{checked.includes(i) ? "âœ…" : "â¬œ"}</span>
                {w}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-slate-400">
          {T("Then do 1â€“2 light sets of your first exercise before the working sets.", "à¦¤à¦¾à¦°à¦ªà¦° à¦•à¦¾à¦œà§‡à¦° à¦¸à§‡à¦Ÿà§‡à¦° à¦†à¦—à§‡ à¦ªà§à¦°à¦¥à¦® à¦¬à§à¦¯à¦¾à¦¯à¦¼à¦¾à¦®à§‡à¦° à§§â€“à§¨à¦Ÿà¦¿ à¦¹à¦¾à¦²à¦•à¦¾ à¦¸à§‡à¦Ÿ à¦•à¦°à§à¦¨à¥¤")}
        </p>
        <button
          onClick={() => {
            setStartedAt(Date.now());
            setPhase("work");
          }}
          className="mt-auto rounded-2xl bg-lime-400 py-5 text-xl font-bold text-slate-950 active:scale-[0.98]"
        >
          {T("Start workout", "à¦“à¦¯à¦¼à¦¾à¦°à§à¦•à¦†à¦‰à¦Ÿ à¦¶à§à¦°à§ à¦•à¦°à§à¦¨")}
        </button>
      </div>
    );
  }

  // ---------- DONE ----------
  if (phase === "done") {
    return (
      <div className="mx-auto min-h-screen max-w-md px-4 py-8">
        <div className="text-center">
          <div className="text-6xl">ðŸŽ‰</div>
          <h1 className="mt-2 text-3xl font-bold text-lime-400">{T("Workout complete!", "à¦“à¦¯à¦¼à¦¾à¦°à§à¦•à¦†à¦‰à¦Ÿ à¦¸à¦®à§à¦ªà¦¨à§à¦¨!")}</h1>
          <p className="mt-1 text-slate-400">{T("Every session counts. You showed up.", "à¦ªà§à¦°à¦¤à¦¿à¦Ÿà¦¿ à¦¸à§‡à¦¶à¦¨à¦‡ à¦—à§à¦°à§à¦¤à§à¦¬à¦ªà§‚à¦°à§à¦£à¥¤ à¦†à¦ªà¦¨à¦¿ à¦¹à¦¾à¦œà¦¿à¦° à¦¹à¦¯à¦¼à§‡à¦›à§‡à¦¨à¥¤")}</p>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-white/5 p-3"><div className="text-2xl font-bold">{totalLogged}</div><div className="text-xs text-slate-400">{T("sets", "à¦¸à§‡à¦Ÿ")}</div></div>
          <div className="rounded-xl bg-white/5 p-3"><div className="text-2xl font-bold">{Math.round(volume)}</div><div className="text-xs text-slate-400">{T("kg volume", "à¦•à§‡à¦œà¦¿ à¦­à¦²à¦¿à¦‰à¦®")}</div></div>
          <div className="rounded-xl bg-white/5 p-3"><div className="text-2xl font-bold">{Math.max(1, Math.round((Date.now() - startedAt) / 60000))}</div><div className="text-xs text-slate-400">{T("min", "à¦®à¦¿à¦¨à¦¿à¦Ÿ")}</div></div>
        </div>
        {result?.offline && (
          <p className="mt-4 rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-200">
            {T("No signal. Your workout is saved on this phone and will sync automatically when you're online.", "à¦¸à¦¿à¦—à¦¨à§à¦¯à¦¾à¦² à¦¨à§‡à¦‡à¥¤ à¦†à¦ªà¦¨à¦¾à¦° à¦“à¦¯à¦¼à¦¾à¦°à§à¦•à¦†à¦‰à¦Ÿ à¦«à§‹à¦¨à§‡ à¦¸à§‡à¦­ à¦†à¦›à§‡, à¦…à¦¨à¦²à¦¾à¦‡à¦¨à§‡ à¦à¦²à§‡ à¦¨à¦¿à¦œà§‡ à¦¥à§‡à¦•à§‡à¦‡ à¦¸à¦¿à¦™à§à¦• à¦¹à¦¬à§‡à¥¤")}
          </p>
        )}
        {result && result.prs.length > 0 && (
          <div className="mt-4 rounded-xl border border-lime-400/40 bg-lime-400/10 p-4">
            <p className="font-semibold text-lime-300">ðŸ† {T("New personal records!", "à¦¨à¦¤à§à¦¨ à¦¬à§à¦¯à¦•à§à¦¤à¦¿à¦—à¦¤ à¦°à§‡à¦•à¦°à§à¦¡!")}</p>
            <ul className="mt-1 text-sm">
              {result.prs.map((r) => (
                <li key={r.exerciseId}>{pick(p.lang, r.nameEn, r.nameBn)}: {r.weightKg} kg Ã— {r.reps}</li>
              ))}
            </ul>
          </div>
        )}
        {result && result.newBadges.length > 0 && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="font-semibold">{T("Badges unlocked", "à¦¨à¦¤à§à¦¨ à¦¬à§à¦¯à¦¾à¦œ")}</p>
            <ul className="mt-1 space-y-1 text-sm">
              {result.newBadges.map((id) => {
                const b = BADGES.find((x) => x.id === id);
                return b ? <li key={id}>{b.icon} {pick(p.lang, b.en, b.bn)}</li> : null;
              })}
            </ul>
          </div>
        )}
        <h2 className="mb-2 mt-6 font-semibold text-lime-400">ðŸ§˜ {T("Cool-down", "à¦•à§à¦²-à¦¡à¦¾à¦‰à¦¨")}</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
          {pick(p.lang, p.cooldownEn.join("|"), p.cooldownBn.join("|")).split("|").map((c, i) => <li key={i}>{c}</li>)}
        </ul>
        <button
          onClick={() => {
            router.push("/app");
            router.refresh();
          }}
          className="mt-8 w-full rounded-2xl bg-lime-400 py-4 text-lg font-bold text-slate-950"
        >
          {T("Back to Today", "à¦†à¦œà¦•à§‡à¦° à¦ªà¦¾à¦¤à¦¾à¦¯à¦¼ à¦«à¦¿à¦°à§à¦¨")}
        </button>
      </div>
    );
  }

  // ---------- WORK ----------
  if (!ex) return null;
  const lastText = ex.last?.length ? ex.last.map((s) => `${s.weightKg > 0 ? s.weightKg + "kgÃ—" : ""}${s.reps}`).join(", ") : null;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-6 pt-4">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <button onClick={() => { if (confirm(T("Leave this workout? Your progress stays saved on this phone.", "à¦“à¦¯à¦¼à¦¾à¦°à§à¦•à¦†à¦‰à¦Ÿ à¦›à¦¾à¦¡à¦¼à¦¬à§‡à¦¨? à¦†à¦ªà¦¨à¦¾à¦° à¦…à¦—à§à¦°à¦—à¦¤à¦¿ à¦«à§‹à¦¨à§‡ à¦¸à§‡à¦­ à¦¥à¦¾à¦•à¦¬à§‡à¥¤"))) router.push("/app"); }}>
          âœ• {T("Exit", "à¦¬à§‡à¦° à¦¹à¦¨")}
        </button>
        <span>{T("Exercise", "à¦¬à§à¦¯à¦¾à¦¯à¦¼à¦¾à¦®")} {idx + 1}/{list.length}</span>
        <span>{totalLogged} {T("sets", "à¦¸à§‡à¦Ÿ")}</span>
      </div>
      <div className="mt-2 flex gap-1">
        {list.map((e, i) => (
          <div key={e.key} className={`h-1.5 flex-1 rounded-full ${i < idx || (logged[e.key]?.length ?? 0) >= e.sets ? "bg-lime-400" : i === idx ? "bg-lime-400/50" : "bg-white/10"}`} />
        ))}
      </div>

      <h1 className="mt-4 text-3xl font-bold leading-tight">{pick(p.lang, ex.nameEn, ex.nameBn)}</h1>
      <p className="mt-1 text-lg text-lime-300">
        {ex.sets} Ã— {ex.repMin}â€“{ex.repMax} {T("reps", "à¦°à§‡à¦ª")} Â· {T("leave", "à¦°à¦¾à¦–à§à¦¨")} {ex.rir} {T("in the tank", "à¦°à§‡à¦ª à¦¬à¦¾à¦•à¦¿")}
      </p>
      {(lastText || ex.noteEn) && (
        <div className="mt-2 rounded-xl bg-white/5 p-3 text-sm">
          {lastText && <p className="text-slate-300">ðŸŽ¯ {T("Beat last time:", "à¦—à¦¤à¦¬à¦¾à¦°à¦•à§‡ à¦›à¦¾à¦¡à¦¼à¦¾à¦¨:")} <b>{lastText}</b></p>}
          {ex.noteEn && <p className="mt-1 text-lime-300">âš¡ {pick(p.lang, ex.noteEn, ex.noteBn ?? ex.noteEn)}</p>}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button onClick={() => setHowTo((v) => !v)} className="flex-1 rounded-xl border border-white/15 py-2 text-sm">
          {howTo ? T("Hide how-to", "à¦²à§à¦•à¦¾à¦¨") : `ðŸ“– ${T("How to", "à¦•à§€à¦­à¦¾à¦¬à§‡ à¦•à¦°à¦¬à§‡à¦¨")}`}
        </button>
        {doneSets.length === 0 && (
          <button onClick={openAlternatives} className="flex-1 rounded-xl border border-amber-400/40 bg-amber-400/10 py-2 text-sm text-amber-200">
            ðŸ” {T("Machine busy?", "à¦®à§‡à¦¶à¦¿à¦¨ à¦¬à§à¦¯à¦¸à§à¦¤?")}
          </button>
        )}
      </div>
      {howTo && (
        <div className="mt-2 rounded-xl bg-white/5 p-3 text-sm">
          <ol className="list-decimal space-y-1 pl-5 text-slate-200">
            {(p.lang === "bn" ? ex.stepsBn : ex.stepsEn).map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          {(p.lang === "bn" ? ex.tipBn : ex.tipEn) && <p className="mt-2 text-lime-300">ðŸ’¡ {p.lang === "bn" ? ex.tipBn : ex.tipEn}</p>}
          <Link href={`/app/library/${ex.slug}`} className="mt-2 inline-block text-xs text-slate-400 underline">{T("Full guide", "à¦ªà§‚à¦°à§à¦£ à¦—à¦¾à¦‡à¦¡")}</Link>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from({ length: Math.max(ex.sets, doneSets.length) }).map((_, i) => {
          const s = doneSets[i];
          return (
            <div key={i} className={`rounded-xl px-3 py-2 text-sm ${s ? "bg-lime-400 font-semibold text-slate-950" : "border border-white/15 text-slate-400"}`}>
              {s ? `${s.weightKg > 0 ? s.weightKg + "kg Ã— " : ""}${s.reps}` : `${T("Set", "à¦¸à§‡à¦Ÿ")} ${i + 1}`}
            </div>
          );
        })}
        {doneSets.length > 0 && (
          <button onClick={undoSet} className="px-2 text-sm text-slate-400 underline">{T("undo", "à¦¬à¦¾à¦¤à¦¿à¦²")}</button>
        )}
      </div>

      {restEnd !== null && (
        <div className="mt-4 rounded-2xl border border-lime-400/40 bg-lime-400/10 p-4 text-center">
          <p className="text-sm text-lime-300">{remaining > 0 ? T("Rest", "à¦¬à¦¿à¦¶à§à¦°à¦¾à¦®") : T("Time's up. Go!", "à¦¸à¦®à¦¯à¦¼ à¦¶à§‡à¦·, à¦¶à§à¦°à§ à¦•à¦°à§à¦¨!")}</p>
          <p className="text-6xl font-bold tabular-nums">{fmt(remaining)}</p>
          <div className="mt-2 flex justify-center gap-2 text-sm">
            <button onClick={() => setRestEnd((r) => (r ?? Date.now()) - 15000)} className="rounded-lg bg-white/10 px-3 py-1.5">âˆ’15s</button>
            <button onClick={() => setRestEnd((r) => (r ?? Date.now()) + 15000)} className="rounded-lg bg-white/10 px-3 py-1.5">+15s</button>
            <button onClick={() => setRestEnd(null)} className="rounded-lg bg-white/10 px-3 py-1.5">{T("Skip", "à¦à¦¡à¦¼à¦¿à¦¯à¦¼à§‡ à¦¯à¦¾à¦¨")}</button>
          </div>
        </div>
      )}

      {!setsComplete && (
        <div className="mt-4 space-y-3">
          {!ex.bodyweight && (
            <div className="flex items-center justify-between gap-2">
              <button className={big} onClick={() => setWeight((w) => Math.max(0, w - step))} aria-label="less weight">âˆ’</button>
              <div className="text-center">
                <div className="text-5xl font-bold tabular-nums">{weight}</div>
                <div className="text-xs text-slate-400">kg</div>
              </div>
              <button className={big} onClick={() => setWeight((w) => w + step)} aria-label="more weight">+</button>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <button className={big} onClick={() => setReps((r) => Math.max(0, r - 1))} aria-label="fewer reps">âˆ’</button>
            <div className="text-center">
              <div className="text-5xl font-bold tabular-nums">{reps}</div>
              <div className="text-xs text-slate-400">{T("reps", "à¦°à§‡à¦ª")}</div>
            </div>
            <button className={big} onClick={() => setReps((r) => r + 1)} aria-label="more reps">+</button>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      <div className="mt-auto space-y-2 pt-6">
        {!setsComplete ? (
          <button onClick={logSet} className="w-full rounded-2xl bg-lime-400 py-5 text-xl font-bold text-slate-950 active:scale-[0.98]">
            âœ“ {T("Log set", "à¦¸à§‡à¦Ÿ à¦²à¦— à¦•à¦°à§à¦¨")} {doneSets.length + 1}
          </button>
        ) : isLast ? (
          <button onClick={finish} disabled={saving} className="w-full rounded-2xl bg-lime-400 py-5 text-xl font-bold text-slate-950 disabled:opacity-60">
            {saving ? T("Savingâ€¦", "à¦¸à§‡à¦­ à¦¹à¦šà§à¦›à§‡â€¦") : `ðŸ ${T("Finish workout", "à¦“à¦¯à¦¼à¦¾à¦°à§à¦•à¦†à¦‰à¦Ÿ à¦¶à§‡à¦· à¦•à¦°à§à¦¨")}`}
          </button>
        ) : (
          <button onClick={() => { setIdx(idx + 1); setRestEnd(null); }} className="w-full rounded-2xl bg-lime-400 py-5 text-xl font-bold text-slate-950">
            {T("Next exercise", "à¦ªà¦°à§‡à¦° à¦¬à§à¦¯à¦¾à¦¯à¦¼à¦¾à¦®")} â†’
          </button>
        )}
        <div className="flex gap-2">
          {idx > 0 && (
            <button onClick={() => setIdx(idx - 1)} className="flex-1 rounded-xl border border-white/15 py-3 text-sm">â† {T("Previous", "à¦†à¦—à§‡à¦°à¦Ÿà¦¿")}</button>
          )}
          {!isLast && !setsComplete && (
            <button onClick={() => setIdx(idx + 1)} className="flex-1 rounded-xl border border-white/15 py-3 text-sm">{T("Skip", "à¦à¦¡à¦¼à¦¿à¦¯à¦¼à§‡ à¦¯à¦¾à¦¨")} â†’</button>
          )}
          {!(isLast && setsComplete) && totalLogged > 0 && (
            <button onClick={finish} disabled={saving} className="flex-1 rounded-xl border border-lime-400/40 py-3 text-sm text-lime-300">
              {T("Finish early", "à¦†à¦—à§‡à¦‡ à¦¶à§‡à¦·")}
            </button>
          )}
        </div>
      </div>

      {busyOpen && (
        <div className="fixed inset-0 z-30 flex items-end bg-black/60" onClick={() => setBusyOpen(false)}>
          <div className="mx-auto max-h-[80vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-slate-900 p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{T("Try one of these instead", "à¦à¦° à¦¬à¦¦à¦²à§‡ à¦à¦—à§à¦²à§‹ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à§‡à¦¨")}</h3>
            {alts === null && <p className="mt-3 text-slate-400">{T("Finding alternativesâ€¦", "à¦¬à¦¿à¦•à¦²à§à¦ª à¦–à§‹à¦à¦œà¦¾ à¦¹à¦šà§à¦›à§‡â€¦")}</p>}
            {alts && alts.length === 0 && (
              <p className="mt-3 text-slate-400">{T("No equivalent exercise available with your equipment.", "à¦†à¦ªà¦¨à¦¾à¦° à¦¯à¦¨à§à¦¤à§à¦°à¦ªà¦¾à¦¤à¦¿ à¦¦à¦¿à¦¯à¦¼à§‡ à¦¸à¦®à¦¤à§à¦²à§à¦¯ à¦•à§‹à¦¨à§‹ à¦¬à§à¦¯à¦¾à¦¯à¦¼à¦¾à¦® à¦¨à§‡à¦‡à¥¤")}</p>
            )}
            <ul className="mt-3 space-y-2">
              {alts?.map((a) => (
                <li key={a.exerciseId}>
                  <button onClick={() => substitute(a)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left">
                    <span className="font-semibold">{pick(p.lang, a.nameEn, a.nameBn)}</span>
                    {a.last && <span className="ml-2 text-xs text-slate-400">({T("done before", "à¦†à¦—à§‡ à¦•à¦°à§‡à¦›à§‡à¦¨")})</span>}
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={() => setBusyOpen(false)} className="mt-4 w-full rounded-xl border border-white/15 py-3 text-sm">{T("Cancel", "à¦¬à¦¾à¦¤à¦¿à¦²")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
