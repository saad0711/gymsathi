import { count, eq, isNotNull, and } from "drizzle-orm";
import { db } from "@/db";
import { users, workouts } from "@/db/schema";
import { PAYMENT_METHODS, PRICING, PROMO_CODES } from "@/lib/constants";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * DEMO checkout. No real payment is taken. Real bKash / Nagad / SSLCommerz
 * integration needs merchant credentials and server-side payment verification.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Not signed in" }, { status: 401 });
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Invalid body" }, { status: 400 });

  let days = 0;
  let markTrial = false;

  if (body.action === "purchase") {
    const plan = PRICING.find((p) => p.id === body.plan);
    if (!plan || !PAYMENT_METHODS.includes(body.method as (typeof PAYMENT_METHODS)[number])) {
      return Response.json({ error: "Invalid plan or payment method" }, { status: 400 });
    }
    days = plan.days;
  } else if (body.action === "trial") {
    if (user.trialUsed) return Response.json({ error: "Free trial already used" }, { status: 400 });
    const [n] = await db
      .select({ n: count() })
      .from(workouts)
      .where(and(eq(workouts.userId, user.id), isNotNull(workouts.finishedAt)));
    if ((n?.n ?? 0) < 3) return Response.json({ error: "Complete 3 workouts to unlock your free trial" }, { status: 400 });
    days = 7;
    markTrial = true;
  } else if (body.action === "redeem") {
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    const d = PROMO_CODES[code];
    if (!d) return Response.json({ error: "Invalid code" }, { status: 400 });
    days = d;
  } else {
    return Response.json({ error: "Invalid action" }, { status: 400 });
  }

  const start = user.premiumUntil && user.premiumUntil.getTime() > Date.now() ? user.premiumUntil.getTime() : Date.now();
  const premiumUntil = new Date(start + days * 86400000);
  await db
    .update(users)
    .set({ premiumUntil, ...(markTrial ? { trialUsed: true } : {}) })
    .where(eq(users.id, user.id));
  return Response.json({ ok: true, premiumUntil });
}
