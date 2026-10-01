import { db } from "@/db";
import { exercises, foods } from "@/db/schema";
import { sql } from "drizzle-orm";
import { SEED_EXERCISES } from "@/lib/seed-data/exercises";
import { SEED_FOODS } from "@/lib/seed-data/foods";

let seeding: Promise<void> | null = null;

async function run() {
  const [ex] = await db.select({ n: sql<number>`count(*)::int` }).from(exercises);
  if (!ex || ex.n === 0) {
    await db
      .insert(exercises)
      .values(
        SEED_EXERCISES.map((e) => ({
          slug: e.slug,
          nameEn: e.en,
          nameBn: e.bn,
          primaryMuscle: e.muscle,
          secondaryMuscles: e.secondary,
          equipment: e.equipment,
          movement: e.movement,
          type: e.type,
          isFree: e.free,
          contra: e.contra,
          aliases: e.aliases,
          stepsEn: e.stepsEn,
          stepsBn: e.stepsBn,
          mistakesEn: e.mistakesEn,
          mistakesBn: e.mistakesBn,
          tipEn: e.tipEn,
          tipBn: e.tipBn,
        })),
      )
      .onConflictDoNothing();
  }
  const [fd] = await db.select({ n: sql<number>`count(*)::int` }).from(foods);
  if (!fd || fd.n === 0) {
    await db.insert(foods).values(
      SEED_FOODS.map((x) => ({
        nameEn: x.en,
        nameBn: x.bn,
        portionEn: x.portionEn,
        portionBn: x.portionBn,
        calories: x.calories,
        protein: x.protein,
        carbs: x.carbs,
        fat: x.fat,
        category: x.category,
      })),
    );
  }
}

/** Loads the exercise library and food database on first use. */
export function ensureSeeded(): Promise<void> {
  if (!seeding) {
    seeding = run().catch((e) => {
      seeding = null;
      throw e;
    });
  }
  return seeding;
}
