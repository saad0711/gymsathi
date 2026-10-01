/* eslint-disable react-hooks/immutability */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  EQUIPMENT,
  EQUIPMENT_LABELS,
  GOALS,
  GOAL_LABELS,
  GYM_DEFAULT_EQUIPMENT,
  HOME_DEFAULT_EQUIPMENT,
  INJURIES,
  INJURY_LABELS,
  LANG_COOKIE,
  LEVELS,
  LEVEL_LABELS,
  PARQ,
  pick,
  type Lang,
} from "@/lib/constants";
import { btnGhost, btnPrimary, inputCls } from "@/components/ui";

type Form = {
  goal: string;
  level: string;
  daysPerWeek: number;
  sessionMinutes: number;
  location: "gym" | "home";
  gender: "male" | "female" | "other";
  age: number;
  heightCm: number;
  weightKg: number;
  equipment: string[];
  injuries: string[];
  parqFlags: string[];
  dietPref: "veg" | "non_veg";
  budget: "low" | "medium" | "high";
};

const TOTAL = 7;

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border px-4 py-3.5 text-left text-sm font-semibold transition hover:-translate-y-0.5 ${
        active ? "border-[#c7f36b]/60 bg-[#c7f36b]/[0.12] text-[#dfff9c] shadow-[0_10px_30px_rgba(199,243,107,.08)]" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-white/20 hover:bg-white/[0.08]"
      }`}
    >
      {children}
    </button>
  );
}

export function OnboardingWizard({ initialLang }: { initialLang: Lang }) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(initialLang);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [f, setF] = useState<Form>({
    goal: "muscle_gain",
    level: "never",
    daysPerWeek: 3,
    sessionMinutes: 45,
    location: "gym",
    gender: "male",
    age: 22,
    heightCm: 170,
    weightKg: 65,
    equipment: GYM_DEFAULT_EQUIPMENT,
    injuries: [],
    parqFlags: [],
    dietPref: "non_veg",
    budget: "medium",
  });
  const T = (en: string, bn: string) => pick(lang, en, bn);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const toggle = (k: "equipment" | "injuries" | "parqFlags", v: string) =>
    setF((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));

  function chooseLang(l: Lang) {
    setLang(l);
    document.cookie = `${LANG_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      router.push("/app");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setBusy(false);
    }
  }

  const numInput = (label: string, key: "age" | "heightCm" | "weightKg", min: number, max: number) => (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-400">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min={min}
        max={max}
        value={f[key]}
        onChange={(e) => set(key, Number(e.target.value))}
        className={inputCls}
      />
    </label>
  );

  return (
    <div className="relative mx-auto min-h-screen max-w-2xl px-5 pb-12 pt-6 sm:px-8">
      <div className="mb-8 flex items-center justify-between">
        <span className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.03em]"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#c7f36b] text-xs font-black text-[#08100f]">GS</span>Gym<span className="text-[#c7f36b]">Sathi</span></span>
        <div className="inline-flex overflow-hidden rounded-full border border-white/15">
          {(["en", "bn"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => chooseLang(l)}
              className={`px-3 py-1 text-xs font-semibold ${lang === l ? "bg-lime-400 text-slate-950" : "text-slate-300"}`}
            >
              {l === "en" ? "EN" : "BN"}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-8 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[#c7f36b] transition-all" style={{ width: `${((step + 1) / TOTAL) * 100}%` }} /></div><span className="text-xs font-semibold text-[#8f9b96]">0{step + 1} / 0{TOTAL}</span>
      </div>

      <div className="glass rounded-[2rem] p-5 sm:p-8">
      <div className="space-y-4">
        {step === 0 && (
          <>
            <h1 className="text-2xl font-bold">{T("What's your main goal?", "à¦†à¦ªà¦¨à¦¾à¦° à¦ªà§à¦°à¦§à¦¾à¦¨ à¦²à¦•à§à¦·à§à¦¯ à¦•à§€?")}</h1>
            <p className="text-sm text-slate-400">{T("No sign-up needed. You'll see your plan in under 2 minutes.", "à¦¸à¦¾à¦‡à¦¨-à¦†à¦ª à¦²à¦¾à¦—à¦¬à§‡ à¦¨à¦¾à¥¤ à§¨ à¦®à¦¿à¦¨à¦¿à¦Ÿà§‡à¦°à¦“ à¦•à¦® à¦¸à¦®à¦¯à¦¼à§‡ à¦ªà§à¦²à§à¦¯à¦¾à¦¨ à¦¦à§‡à¦–à¦¤à§‡ à¦ªà¦¾à¦¬à§‡à¦¨à¥¤")}</p>
            {GOALS.map((g) => (
              <Choice key={g} active={f.goal === g} onClick={() => set("goal", g)}>
                {pick(lang, GOAL_LABELS[g]!.en, GOAL_LABELS[g]!.bn)}
              </Choice>
            ))}
          </>
        )}
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold">{T("How experienced are you?", "à¦†à¦ªà¦¨à¦¾à¦° à¦…à¦­à¦¿à¦œà§à¦žà¦¤à¦¾ à¦•à¦¤à¦Ÿà§à¦•à§?")}</h1>
            {LEVELS.map((l) => (
              <Choice key={l} active={f.level === l} onClick={() => set("level", l)}>
                {pick(lang, LEVEL_LABELS[l]!.en, LEVEL_LABELS[l]!.bn)}
              </Choice>
            ))}
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold">{T("Your schedule", "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à¦®à¦¯à¦¼à¦¸à§‚à¦šà¦¿")}</h1>
            <p className="text-sm text-slate-400">{T("Days per week", "à¦¸à¦ªà§à¦¤à¦¾à¦¹à§‡ à¦•à¦¤ à¦¦à¦¿à¦¨")}</p>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((d) => (
                <Choice key={d} active={f.daysPerWeek === d} onClick={() => set("daysPerWeek", d)}>
                  <span className="block text-center">{d}</span>
                </Choice>
              ))}
            </div>
            <p className="pt-2 text-sm text-slate-400">{T("Minutes per session", "à¦ªà§à¦°à¦¤à¦¿ à¦¸à§‡à¦¶à¦¨à§‡ à¦•à¦¤ à¦®à¦¿à¦¨à¦¿à¦Ÿ")}</p>
            <div className="grid grid-cols-4 gap-2">
              {[30, 45, 60, 75].map((m) => (
                <Choice key={m} active={f.sessionMinutes === m} onClick={() => set("sessionMinutes", m)}>
                  <span className="block text-center">{m}</span>
                </Choice>
              ))}
            </div>
            <p className="pt-2 text-sm text-slate-400">{T("Where will you train?", "à¦•à§‹à¦¥à¦¾à¦¯à¦¼ à¦¬à§à¦¯à¦¾à¦¯à¦¼à¦¾à¦® à¦•à¦°à¦¬à§‡à¦¨?")}</p>
            <div className="grid grid-cols-2 gap-2">
              <Choice
                active={f.location === "gym"}
                onClick={() => setF((p) => ({ ...p, location: "gym", equipment: GYM_DEFAULT_EQUIPMENT }))}
              >
                ðŸ‹ï¸ {T("Gym", "à¦œà¦¿à¦®")}
              </Choice>
              <Choice
                active={f.location === "home"}
                onClick={() => setF((p) => ({ ...p, location: "home", equipment: HOME_DEFAULT_EQUIPMENT }))}
              >
                ðŸ  {T("Home", "à¦¬à¦¾à¦¸à¦¾")}
              </Choice>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold">{T("About you", "à¦†à¦ªà¦¨à¦¾à¦° à¦¸à¦®à§à¦ªà¦°à§à¦•à§‡")}</h1>
            <p className="text-sm text-slate-400">{T("Used for calorie and protein targets. Stays private.", "à¦•à§à¦¯à¦¾à¦²à¦°à¦¿ à¦“ à¦ªà§à¦°à§‹à¦Ÿà¦¿à¦¨à§‡à¦° à¦²à¦•à§à¦·à§à¦¯ à¦ à¦¿à¦• à¦•à¦°à¦¤à§‡ à¦²à¦¾à¦—à¦¬à§‡à¥¤ à¦à¦Ÿà¦¿ à¦—à§‹à¦ªà¦¨ à¦¥à¦¾à¦•à§‡à¥¤")}</p>
            <div className="grid grid-cols-3 gap-2">
              {(["male", "female", "other"] as const).map((g) => (
                <Choice key={g} active={f.gender === g} onClick={() => set("gender", g)}>
                  <span className="block text-center text-sm">
                    {g === "male" ? T("Male", "à¦ªà§à¦°à§à¦·") : g === "female" ? T("Female", "à¦¨à¦¾à¦°à§€") : T("Other", "à¦…à¦¨à§à¦¯à¦¾à¦¨à§à¦¯")}
                  </span>
                </Choice>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {numInput(T("Age", "à¦¬à¦¯à¦¼à¦¸"), "age", 12, 90)}
              {numInput(T("Height (cm)", "à¦‰à¦šà§à¦šà¦¤à¦¾ (à¦¸à§‡à¦®à¦¿)"), "heightCm", 120, 230)}
              {numInput(T("Weight (kg)", "à¦“à¦œà¦¨ (à¦•à§‡à¦œà¦¿)"), "weightKg", 30, 250)}
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h1 className="text-2xl font-bold">{T("What does your gym have?", "à¦†à¦ªà¦¨à¦¾à¦° à¦œà¦¿à¦®à§‡ à¦•à§€ à¦•à§€ à¦†à¦›à§‡?")}</h1>
            <p className="text-sm text-slate-400">{T("We only pick exercises you can actually do.", "à¦¶à§à¦§à§ à¦†à¦ªà¦¨à¦¿ à¦•à¦°à¦¤à§‡ à¦ªà¦¾à¦°à¦¬à§‡à¦¨ à¦à¦®à¦¨ à¦¬à§à¦¯à¦¾à¦¯à¦¼à¦¾à¦®à¦‡ à¦¬à¦¾à¦›à¦¾à¦‡ à¦•à¦°à¦¾ à¦¹à¦¬à§‡à¥¤")}</p>
            {EQUIPMENT.filter((e) => e !== "bodyweight").map((e) => (
              <Choice key={e} active={f.equipment.includes(e)} onClick={() => toggle("equipment", e)}>
                {f.equipment.includes(e) ? "âœ… " : "â¬œ "}
                {pick(lang, EQUIPMENT_LABELS[e].en, EQUIPMENT_LABELS[e].bn)}
              </Choice>
            ))}
          </>
        )}
        {step === 5 && (
          <>
            <h1 className="text-2xl font-bold">{T("Health & safety", "à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦“ à¦¨à¦¿à¦°à¦¾à¦ªà¦¤à§à¦¤à¦¾")}</h1>
            <p className="text-sm text-slate-400">{T("Any injuries or sore areas?", "à¦•à§‹à¦¨à§‹ à¦†à¦˜à¦¾à¦¤ à¦¬à¦¾ à¦¬à§à¦¯à¦¥à¦¾à¦° à¦œà¦¾à¦¯à¦¼à¦—à¦¾ à¦†à¦›à§‡?")}</p>
            <div className="grid grid-cols-2 gap-2">
              {INJURIES.map((k) => (
                <Choice key={k} active={f.injuries.includes(k)} onClick={() => toggle("injuries", k)}>
                  {pick(lang, INJURY_LABELS[k]!.en, INJURY_LABELS[k]!.bn)}
                </Choice>
              ))}
            </div>
            <p className="pt-2 text-sm text-slate-400">{T("Quick health check. Tick anything that applies:", "à¦¦à§à¦°à§à¦¤ à¦¸à§à¦¬à¦¾à¦¸à§à¦¥à§à¦¯ à¦¯à¦¾à¦šà¦¾à¦‡à¥¤ à¦¯à¦¾ à¦ªà§à¦°à¦¯à§‹à¦œà§à¦¯ à¦Ÿà¦¿à¦• à¦¦à¦¿à¦¨:")}</p>
            {PARQ.map((q) => (
              <Choice key={q.id} active={f.parqFlags.includes(q.id)} onClick={() => toggle("parqFlags", q.id)}>
                <span className="text-sm">
                  {f.parqFlags.includes(q.id) ? "â˜‘ " : "â˜ "}
                  {pick(lang, q.en, q.bn)}
                </span>
              </Choice>
            ))}
            {f.parqFlags.length > 0 && (
              <p className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-200">
                {T(
                  "Please talk to a doctor before starting. We'll still build a gentle plan, but get medical clearance first.",
                  "à¦¶à§à¦°à§ à¦•à¦°à¦¾à¦° à¦†à¦—à§‡ à¦¡à¦¾à¦•à§à¦¤à¦¾à¦°à§‡à¦° à¦¸à¦¾à¦¥à§‡ à¦•à¦¥à¦¾ à¦¬à¦²à§à¦¨à¥¤ à¦†à¦®à¦°à¦¾ à¦¹à¦¾à¦²à¦•à¦¾ à¦ªà§à¦²à§à¦¯à¦¾à¦¨ à¦¬à¦¾à¦¨à¦¾à¦¬, à¦¤à¦¬à§‡ à¦†à¦—à§‡ à¦šà¦¿à¦•à¦¿à§Žà¦¸à¦•à§‡à¦° à¦…à¦¨à§à¦®à¦¤à¦¿ à¦¨à¦¿à¦¨à¥¤",
                )}
              </p>
            )}
          </>
        )}
        {step === 6 && (
          <>
            <h1 className="text-2xl font-bold">{T("Food preferences", "à¦–à¦¾à¦¬à¦¾à¦°à§‡à¦° à¦ªà¦›à¦¨à§à¦¦")}</h1>
            <div className="grid grid-cols-2 gap-2">
              <Choice active={f.dietPref === "non_veg"} onClick={() => set("dietPref", "non_veg")}>ðŸ— {T("Non-veg (halal)", "à¦¨à¦¨-à¦­à§‡à¦œ (à¦¹à¦¾à¦²à¦¾à¦²)")}</Choice>
              <Choice active={f.dietPref === "veg"} onClick={() => set("dietPref", "veg")}>ðŸ¥¦ {T("Vegetarian", "à¦¨à¦¿à¦°à¦¾à¦®à¦¿à¦·")}</Choice>
            </div>
            <p className="pt-2 text-sm text-slate-400">{T("Daily food budget", "à¦¦à§ˆà¦¨à¦¿à¦• à¦–à¦¾à¦¬à¦¾à¦°à§‡à¦° à¦¬à¦¾à¦œà§‡à¦Ÿ")}</p>
            <div className="grid grid-cols-3 gap-2">
              {(["low", "medium", "high"] as const).map((b) => (
                <Choice key={b} active={f.budget === b} onClick={() => set("budget", b)}>
                  <span className="block text-center text-sm">
                    {b === "low" ? T("Tight", "à¦¸à§€à¦®à¦¿à¦¤") : b === "medium" ? T("Medium", "à¦®à¦¾à¦à¦¾à¦°à¦¿") : T("Flexible", "à¦¸à§à¦¬à¦šà§à¦›à¦¨à§à¦¦")}
                  </span>
                </Choice>
              ))}
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-rose-400">{error}</p>}
      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <button className={btnGhost} onClick={() => setStep(step - 1)} disabled={busy}>
            {T("Back", "à¦ªà§‡à¦›à¦¨à§‡")}
          </button>
        )}
        {step < TOTAL - 1 ? (
          <button className={`${btnPrimary} flex-1`} onClick={() => setStep(step + 1)}>
            {T("Continue", "à¦à¦—à¦¿à¦¯à¦¼à§‡ à¦¯à¦¾à¦¨")}
          </button>
        ) : (
          <button className={`${btnPrimary} flex-1`} onClick={submit} disabled={busy}>
            {busy ? T("Building your planâ€¦", "à¦†à¦ªà¦¨à¦¾à¦° à¦ªà§à¦²à§à¦¯à¦¾à¦¨ à¦¤à§ˆà¦°à¦¿ à¦¹à¦šà§à¦›à§‡â€¦") : T("Build my plan", "à¦†à¦®à¦¾à¦° à¦ªà§à¦²à§à¦¯à¦¾à¦¨ à¦¬à¦¾à¦¨à¦¾à¦¨")}
          </button>
        )}
      </div>
      </div>
    </div>
  );
}

