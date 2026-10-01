import { EQUIPMENT, GOALS, INJURIES, LEVELS, PARQ } from "@/lib/constants";

export type ProfileInput = {
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

function num(v: unknown, min: number, max: number): number | null {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
}

function subset(v: unknown, allowed: readonly string[]): string[] | null {
  if (!Array.isArray(v)) return null;
  const out = v.filter((x): x is string => typeof x === "string");
  if (out.length !== v.length || out.some((x) => !allowed.includes(x))) return null;
  return Array.from(new Set(out));
}

export function parseProfile(body: unknown): { data: ProfileInput } | { error: string } {
  if (typeof body !== "object" || body === null) return { error: "Invalid body" };
  const b = body as Record<string, unknown>;

  if (!GOALS.includes(b.goal as (typeof GOALS)[number])) return { error: "Invalid goal" };
  if (!LEVELS.includes(b.level as (typeof LEVELS)[number])) return { error: "Invalid level" };
  const days = num(b.daysPerWeek, 1, 6);
  const minutes = num(b.sessionMinutes, 20, 120);
  const age = num(b.age, 12, 90);
  const height = num(b.heightCm, 120, 230);
  const weight = num(b.weightKg, 30, 250);
  if (days === null || minutes === null) return { error: "Invalid schedule" };
  if (age === null || height === null || weight === null) return { error: "Invalid body stats" };
  if (b.location !== "gym" && b.location !== "home") return { error: "Invalid location" };
  if (b.gender !== "male" && b.gender !== "female" && b.gender !== "other") return { error: "Invalid gender" };
  if (b.dietPref !== "veg" && b.dietPref !== "non_veg") return { error: "Invalid diet" };
  if (b.budget !== "low" && b.budget !== "medium" && b.budget !== "high") return { error: "Invalid budget" };

  const equipment = subset(b.equipment, EQUIPMENT);
  const injuries = subset(b.injuries, INJURIES);
  const parq = subset(b.parqFlags, PARQ.map((p) => p.id));
  if (!equipment || !injuries || !parq) return { error: "Invalid selections" };

  return {
    data: {
      goal: b.goal as string,
      level: b.level as string,
      daysPerWeek: Math.round(days),
      sessionMinutes: Math.round(minutes),
      location: b.location,
      gender: b.gender,
      age: Math.round(age),
      heightCm: height,
      weightKg: weight,
      equipment: equipment.includes("bodyweight") ? equipment : ["bodyweight", ...equipment],
      injuries,
      parqFlags: parq,
      dietPref: b.dietPref,
      budget: b.budget,
    },
  };
}
