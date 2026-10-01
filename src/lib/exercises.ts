import { db } from "@/db";
import { exercises, type Exercise } from "@/db/schema";

/** Exercises the user can actually do: equipment available, no flagged-injury conflicts. */
export async function getUsableExercises(user: { equipment: string[]; injuries: string[] }): Promise<Exercise[]> {
  const all = await db.select().from(exercises);
  return filterUsable(all, user);
}

export function filterUsable(all: Exercise[], user: { equipment: string[]; injuries: string[] }): Exercise[] {
  const avail = new Set([...user.equipment, "bodyweight"]);
  return all.filter((e) => e.equipment.every((q) => avail.has(q)) && !e.contra.some((c) => user.injuries.includes(c)));
}

/** Equivalent alternatives: same muscle (and movement), same type first, free first. */
export function findAlternatives(usable: Exercise[], current: Exercise, excludeIds: number[] = []): Exercise[] {
  return usable
    .filter((e) => e.id !== current.id && !excludeIds.includes(e.id) && e.primaryMuscle === current.primaryMuscle)
    .sort((a, b) => {
      const sa = (a.type === current.type ? 0 : 10) + (a.isFree ? 0 : 3);
      const sb = (b.type === current.type ? 0 : 10) + (b.isFree ? 0 : 3);
      return sa - sb;
    });
}
