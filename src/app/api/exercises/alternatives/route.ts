import { eq } from "drizzle-orm";
import { db } from "@/db";
import { exercises } from "@/db/schema";
import { findAlternatives, getUsableExercises } from "@/lib/exercises";
import { getCurrentUser, isPremium } from "@/lib/session";
import { getLastSets, progression } from "@/lib/stats";

export const dynamic = "force-dynamic";

/** "Machine busy?" – equivalent exercises for the current one. */
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("exerciseId"));
  const repMax = Number(new URL(request.url).searchParams.get("repMax")) || 12;
  if (!Number.isInteger(id)) return Response.json({ error: "Invalid id" }, { status: 400 });
  const [current] = await db.select().from(exercises).where(eq(exercises.id, id)).limit(1);
  if (!current) return Response.json({ error: "Not found" }, { status: 404 });

  const usable = await getUsableExercises(user);
  const alts = findAlternatives(usable, current).slice(0, 4);
  const last = await getLastSets(user.id, alts.map((a) => a.id));
  const premium = isPremium(user);

  return Response.json(
    alts.map((a) => {
      const l = last.get(a.id) ?? null;
      const prog = progression(l, repMax, premium, a.movement === "legs");
      return {
        exerciseId: a.id,
        slug: a.slug,
        nameEn: a.nameEn,
        nameBn: a.nameBn,
        stepsEn: a.stepsEn,
        stepsBn: a.stepsBn,
        tipEn: a.tipEn,
        tipBn: a.tipBn,
        bodyweight: a.equipment.length === 1 && a.equipment[0] === "bodyweight",
        last: l,
        startWeight: prog.startWeight,
        noteEn: prog.noteEn,
        noteBn: prog.noteBn,
      };
    }),
  );
}
