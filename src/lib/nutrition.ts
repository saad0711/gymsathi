import type { User } from "@/db/schema";

export function nutritionTargets(u: Pick<User, "gender" | "age" | "heightCm" | "weightKg" | "goal" | "daysPerWeek">) {
  const base = 10 * u.weightKg + 6.25 * u.heightCm - 5 * u.age;
  const bmr = u.gender === "male" ? base + 5 : u.gender === "female" ? base - 161 : base - 78;
  const factor = u.daysPerWeek <= 2 ? 1.3 : u.daysPerWeek === 3 ? 1.4 : u.daysPerWeek === 4 ? 1.5 : 1.6;
  const tdee = bmr * factor;
  const adj = u.goal === "fat_loss" ? -450 : u.goal === "muscle_gain" ? 300 : 0;
  const calories = Math.max(1400, Math.round((tdee + adj) / 10) * 10);
  const perKg = u.goal === "fat_loss" ? 1.8 : u.goal === "muscle_gain" || u.goal === "strength" ? 1.7 : 1.4;
  const protein = Math.round(u.weightKg * perKg);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  const waterL = Math.round(u.weightKg * 0.035 * 10) / 10;
  return { calories, protein, fat, carbs, waterL, glasses: Math.ceil((waterL * 1000) / 250) };
}
