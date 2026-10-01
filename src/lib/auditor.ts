import type { AuditResultJson, Exercise } from "@/db/schema";
import { MUSCLE_LABELS, type Muscle } from "@/lib/constants";

type Finding = AuditResultJson["findings"][number];

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseSetsReps(line: string): { sets: number; repMin: number; repMax: number } | null {
  const l = line.toLowerCase();
  let m = l.match(/(\d+)\s*(?:x|×|\*)\s*(\d+)(?:\s*(?:-|–|to)\s*(\d+))?/);
  if (m) {
    let a = Number(m[1]);
    let b = Number(m[2]);
    const c = m[3] ? Number(m[3]) : null;
    if (a > 8 && b <= 8 && c === null) [a, b] = [b, a];
    return { sets: a, repMin: b, repMax: c ?? b };
  }
  m = l.match(/(\d+)\s*sets?\s*(?:of|x|×)?\s*(\d+)(?:\s*(?:-|–|to)\s*(\d+))?/);
  if (m) {
    const b = Number(m[2]);
    return { sets: Number(m[1]), repMin: b, repMax: m[3] ? Number(m[3]) : b };
  }
  return null;
}

export function auditRoutine(text: string, goal: string, all: Exercise[]): AuditResultJson {
  const aliasList: { alias: string; ex: Exercise; re: RegExp }[] = [];
  for (const e of all) {
    for (const a of [e.nameEn.toLowerCase(), ...e.aliases]) {
      aliasList.push({ alias: a, ex: e, re: new RegExp(`\\b${escapeRe(a)}(?:e?s)?\\b`, "i") });
    }
  }
  aliasList.sort((a, b) => b.alias.length - a.alias.length);

  const lines: AuditResultJson["lines"] = [];
  const unrecognized: string[] = [];
  const weeklySets: Record<string, number> = {};
  const split = { push: 0, pull: 0, legs: 0, core: 0 };
  const parsed: { ex: Exercise; sets: number; repMin: number; repMax: number }[] = [];

  for (const raw of text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)) {
    if (/^(day\s*\d|week\s*\d|rest|off)\b/i.test(raw) && !/\d\s*[x×*]\s*\d/.test(raw)) continue;
    const hit = aliasList.find((a) => a.re.test(raw));
    const sr = parseSetsReps(raw);
    if (!hit) {
      if (sr) unrecognized.push(raw);
      continue;
    }
    const sets = sr?.sets ?? 3;
    const repMin = sr?.repMin ?? 10;
    const repMax = sr?.repMax ?? 10;
    if (sets < 1 || sets > 20 || repMax > 100) {
      unrecognized.push(raw);
      continue;
    }
    lines.push({ line: raw, nameEn: hit.ex.nameEn, nameBn: hit.ex.nameBn, sets, repMin, repMax, assumed: !sr });
    parsed.push({ ex: hit.ex, sets, repMin, repMax });
    weeklySets[hit.ex.primaryMuscle] = (weeklySets[hit.ex.primaryMuscle] ?? 0) + sets;
    const mv = hit.ex.movement as keyof typeof split;
    if (mv in split) split[mv] += sets;
  }

  const findings: Finding[] = [];
  const w = (m: Muscle) => weeklySets[m] ?? 0;
  const label = (m: Muscle) => MUSCLE_LABELS[m];

  if (parsed.length === 0) {
    findings.push({
      severity: "high",
      en: "We couldn't read any exercises. Try one per line like “Bench press 3x10”.",
      bn: "কোনো ব্যায়াম পড়তে পারিনি। প্রতি লাইনে একটি করে লিখুন, যেমন “Bench press 3x10”।",
    });
  } else {
    const legSets = w("quads") + w("hamstrings") + w("glutes") + w("calves");
    if (legSets === 0) {
      findings.push({
        severity: "high",
        en: "No leg work found. Legs are the biggest muscles and skipping them limits overall progress and balance.",
        bn: "পায়ের কোনো ব্যায়াম পাওয়া যায়নি। পা সবচেয়ে বড় পেশি; বাদ দিলে সামগ্রিক অগ্রগতি ও ভারসাম্য ব্যাহত হয়।",
      });
    }
    for (const m of ["chest", "back", "shoulders"] as Muscle[]) {
      if (w(m) === 0) {
        findings.push({
          severity: "high",
          en: `No direct ${label(m).en.toLowerCase()} work found. This plan could be improved by adding it.`,
          bn: `${label(m).bn}-এর সরাসরি ব্যায়াম নেই। এটি যোগ করলে প্ল্যানটি আরও ভালো হবে।`,
        });
      } else if (w(m) < 6) {
        findings.push({
          severity: "low",
          en: `${label(m).en} gets only ${w(m)} sets a week. Around 8–16 is a productive range for most people.`,
          bn: `${label(m).bn} সপ্তাহে মাত্র ${w(m)} সেট পাচ্ছে। বেশিরভাগ মানুষের জন্য ৮–১৬ সেট কার্যকর।`,
        });
      }
    }
    for (const m of MUSCLES_TO_CHECK) {
      const limit = m.big ? 22 : 16;
      if (w(m.id) > limit) {
        findings.push({
          severity: "medium",
          en: `${label(m.id).en} gets ${w(m.id)} sets a week, which is likely more than you can recover from. Extra sets past about ${limit - 6} add fatigue more than growth.`,
          bn: `${label(m.id).bn} সপ্তাহে ${w(m.id)} সেট পাচ্ছে, যা সম্ভবত সেরে ওঠার সীমার বেশি। প্রায় ${limit - 6} সেটের পরের সেট বৃদ্ধির চেয়ে ক্লান্তি বেশি বাড়ায়।`,
        });
      }
    }
    if (split.pull > 0 && split.push / split.pull > 1.5) {
      findings.push({
        severity: "medium",
        en: `Pushing (${split.push} sets) outweighs pulling (${split.pull} sets). Adding rows or pulldowns helps shoulder health and posture.`,
        bn: `ঠেলার ব্যায়াম (${split.push} সেট) টানার ব্যায়ামের (${split.pull} সেট) চেয়ে বেশি। রো বা পুলডাউন যোগ করলে কাঁধ ও ভঙ্গি ভালো থাকে।`,
      });
    } else if (split.pull === 0 && split.push > 0) {
      findings.push({
        severity: "high",
        en: "There are no pulling exercises. Balance pushing with rows or pulldowns.",
        bn: "টানার কোনো ব্যায়াম নেই। ঠেলার সাথে রো বা পুলডাউন দিয়ে ভারসাম্য আনুন।",
      });
    }
    const total = split.push + split.pull + split.legs;
    if (legSets > 0 && total > 0 && split.legs / total < 0.2) {
      findings.push({
        severity: "medium",
        en: "Legs make up less than 20% of your weekly sets. A more balanced share would be closer to 30–40%.",
        bn: "সাপ্তাহিক সেটের ২০%-এর কম পায়ে যাচ্ছে। আরও ভারসাম্যপূর্ণ হলে ৩০–৪০% হতো।",
      });
    }

    // rep ranges vs goal
    const bad: typeof parsed = [];
    for (const p of parsed) {
      const hi = p.repMax;
      if (goal === "muscle_gain" && p.ex.type === "compound" && hi > 15) bad.push(p);
      else if (goal === "strength" && p.ex.type === "compound" && hi > 10) bad.push(p);
      else if (goal === "muscle_gain" && hi < 5) bad.push(p);
    }
    if (bad.length) {
      const f = bad[0]!;
      findings.push({
        severity: "medium",
        en: `${bad.length} exercise(s) use rep ranges that don't suit your goal (for example ${f.ex.nameEn} at ${f.repMax} reps). ${goal === "strength" ? "Strength work is best at 3–8 reps." : "8–12 reps for big lifts gives a better muscle-building stimulus."}`,
        bn: `${bad.length}টি ব্যায়ামের রেপ রেঞ্জ আপনার লক্ষ্যের সাথে মানানসই নয় (যেমন ${f.ex.nameBn} ${f.repMax} রেপ)। ${goal === "strength" ? "শক্তির জন্য ৩–৮ রেপ সেরা।" : "বড় ব্যায়ামে ৮–১২ রেপ পেশি বাড়ানোর জন্য ভালো।"}`,
      });
    }
    if (parsed.length >= 4 && parsed.every((p) => p.repMax === parsed[0]!.repMax)) {
      findings.push({
        severity: "low",
        en: `Every exercise uses the same rep count (${parsed[0]!.repMax}). Mixing ranges (heavier for big lifts, lighter for isolation) works better.`,
        bn: `প্রতিটি ব্যায়ামে একই রেপ (${parsed[0]!.repMax})। মিশ্রিত রেঞ্জ (বড় ব্যায়ামে ভারী, ছোটটিতে হালকা) বেশি কার্যকর।`,
      });
    }
    const totalSets = Object.values(weeklySets).reduce((a, b) => a + b, 0);
    if (totalSets > 120) {
      findings.push({
        severity: "medium",
        en: `${totalSets} total sets a week is a lot. Recovery may become the limit, so consider trimming.`,
        bn: `সপ্তাহে মোট ${totalSets} সেট অনেক বেশি। রিকভারি সীমা হয়ে দাঁড়াতে পারে, কিছু কমানো ভেবে দেখুন।`,
      });
    }
    if (unrecognized.length > parsed.length) {
      findings.push({
        severity: "low",
        en: "We couldn't read many lines, so this audit may be incomplete. Use plain exercise names.",
        bn: "অনেক লাইন পড়তে পারিনি, তাই অডিট অসম্পূর্ণ হতে পারে। সাধারণ ব্যায়ামের নাম ব্যবহার করুন।",
      });
    }
    if (!findings.length) {
      findings.push({
        severity: "good",
        en: "This looks like a balanced, sensible plan. Nice work. Keep progressing the weights over time.",
        bn: "প্ল্যানটি ভারসাম্যপূর্ণ ও যুক্তিসংগত মনে হচ্ছে। সময়ের সাথে ওজন বাড়াতে থাকুন।",
      });
    }
  }

  const penalty = { high: 15, medium: 8, low: 4, good: 0 } as const;
  const score = Math.max(30, 100 - findings.reduce((s, f) => s + penalty[f.severity], 0));
  const order = { high: 0, medium: 1, low: 2, good: 3 } as const;
  findings.sort((a, b) => order[a.severity] - order[b.severity]);

  return { score: parsed.length ? score : 0, goal, lines, unrecognized, weeklySets, split, findings };
}

const MUSCLES_TO_CHECK: { id: Muscle; big: boolean }[] = [
  { id: "chest", big: true },
  { id: "back", big: true },
  { id: "quads", big: true },
  { id: "shoulders", big: false },
  { id: "biceps", big: false },
  { id: "triceps", big: false },
  { id: "hamstrings", big: false },
];
