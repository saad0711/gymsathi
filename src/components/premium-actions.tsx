"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PAYMENT_LABELS, PAYMENT_METHODS, PRICING, STUDENT_DISCOUNT, pick, type Lang } from "@/lib/constants";
import { btnGhost, btnPrimary, inputCls } from "@/components/ui";

export function PremiumActions({ lang, trialReady, workouts, trialUsed }: { lang: Lang; trialReady: boolean; workouts: number; trialUsed: boolean }) {
  const router = useRouter();
  const [plan, setPlan] = useState<string>("quarterly");
  const [method, setMethod] = useState<string>("bkash");
  const [student, setStudent] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const T = (en: string, bn: string) => pick(lang, en, bn);

  async function call(body: Record<string, unknown>, okText: string) {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/premium", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) setMsg({ ok: false, text: data.error ?? "Error" });
    else {
      setMsg({ ok: true, text: okText });
      router.refresh();
    }
  }

  const price = (bdt: number) => Math.round(student ? bdt * (1 - STUDENT_DISCOUNT) : bdt);
  const selected = PRICING.find((p) => p.id === plan)!;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-2">
        {PRICING.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlan(p.id)}
            className={`rounded-xl border p-3 text-center ${plan === p.id ? "border-lime-400 bg-lime-400/15" : "border-white/10 bg-white/5"}`}
          >
            <div className="text-xs text-slate-400">{pick(lang, p.en, p.bn)}</div>
            <div className="text-xl font-bold">৳{price(p.bdt)}</div>
            {p.id === "yearly" && <div className="text-[10px] text-lime-300">{T("best value", "সেরা দাম")}</div>}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" checked={student} onChange={(e) => setStudent(e.target.checked)} className="h-4 w-4 accent-lime-400" />
        🎓 {T("I'm a student (~40% off, verified with student ID at launch)", "আমি শিক্ষার্থী (~৪০% ছাড়, চালুর সময় ছাত্র পরিচয়পত্রে যাচাই)")}
      </label>
      <div>
        <p className="mb-2 text-sm text-slate-400">{T("Pay with", "পেমেন্ট মাধ্যম")}</p>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`rounded-xl border px-3 py-2.5 text-sm ${method === m ? "border-lime-400 bg-lime-400/15" : "border-white/10 bg-white/5"}`}
            >
              {PAYMENT_LABELS[m]}
            </button>
          ))}
        </div>
      </div>
      <button
        disabled={busy}
        onClick={() => call({ action: "purchase", plan, method }, T("Premium activated (demo).", "প্রিমিয়াম চালু হয়েছে (ডেমো)।"))}
        className={`${btnPrimary} w-full`}
      >
        {T("Pay", "পেমেন্ট করুন")} ৳{price(selected.bdt)} · {PAYMENT_LABELS[method]} ({T("demo", "ডেমো")})
      </button>
      <p className="text-xs text-amber-300/90">
        {T(
          "Demo checkout: no money is charged. Live bKash / Nagad / Rocket / SSLCommerz needs merchant credentials and server-side payment verification.",
          "ডেমো চেকআউট: কোনো টাকা কাটা হয় না। সত্যিকারের bKash / Nagad / Rocket / SSLCommerz-এর জন্য মার্চেন্ট ক্রেডেনশিয়াল ও সার্ভার-সাইড পেমেন্ট যাচাই লাগবে।",
        )}
      </p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold">🎁 {T("7-day free trial", "৭ দিনের ফ্রি ট্রায়াল")}</p>
        <p className="mt-1 text-sm text-slate-400">
          {trialUsed
            ? T("You've already used your trial.", "আপনি ট্রায়াল ব্যবহার করে ফেলেছেন।")
            : trialReady
              ? T("You've earned it by completing 3 workouts.", "৩টি ওয়ার্কআউট শেষ করে আপনি এটি অর্জন করেছেন।")
              : T(`Unlocks after 3 completed workouts (you have ${workouts}).`, `৩টি ওয়ার্কআউট শেষ করলে চালু হবে (আপনার ${workouts}টি)।`)}
        </p>
        <button
          disabled={busy || !trialReady || trialUsed}
          onClick={() => call({ action: "trial" }, T("Trial started. Enjoy 7 days of Premium!", "ট্রায়াল শুরু! ৭ দিন প্রিমিয়াম উপভোগ করুন।"))}
          className={`${btnGhost} mt-3 w-full`}
        >
          {T("Start free trial", "ফ্রি ট্রায়াল শুরু করুন")}
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold">🏋️ {T("Gym or promo code", "জিম বা প্রোমো কোড")}</p>
        <div className="mt-2 flex gap-2">
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="GYMSATHI7" className={inputCls} />
          <button disabled={busy || !code.trim()} onClick={() => call({ action: "redeem", code }, T("Code applied!", "কোড প্রয়োগ হয়েছে!"))} className={btnGhost}>
            {T("Redeem", "ব্যবহার")}
          </button>
        </div>
      </div>

      {msg && <p className={`text-sm ${msg.ok ? "text-lime-300" : "text-rose-400"}`}>{msg.text}</p>}
    </div>
  );
}
