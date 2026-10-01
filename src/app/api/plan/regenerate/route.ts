import { GOALS } from "@/lib/constants";
import { createPlan } from "@/lib/plan-generator";
import { getCurrentUser, isPremium } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  if (!isPremium(user)) return Response.json({ error: "premium_required" }, { status: 402 });

  const body = (await request.json().catch(() => null)) as { goal?: unknown } | null;
  const goal = GOALS.includes(body?.goal as (typeof GOALS)[number]) ? (body!.goal as string) : user.goal;
  await createPlan(user.id, { ...user, goal });
  return Response.json({ ok: true });
}
