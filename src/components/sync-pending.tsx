"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const PENDING_KEY = "gs_pending_workouts";

/** Offline-first: workouts finished without signal are queued locally and synced later. */
export function SyncPending() {
  const router = useRouter();
  useEffect(() => {
    async function flush() {
      let queue: unknown[] = [];
      try {
        queue = JSON.parse(localStorage.getItem(PENDING_KEY) ?? "[]");
      } catch {
        queue = [];
      }
      if (!queue.length) return;
      const remaining: unknown[] = [];
      let synced = 0;
      for (const item of queue) {
        try {
          const res = await fetch("/api/workouts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });
          if (res.ok || res.status === 400) synced += res.ok ? 1 : 0;
          else remaining.push(item);
        } catch {
          remaining.push(item);
        }
      }
      localStorage.setItem(PENDING_KEY, JSON.stringify(remaining));
      if (synced) router.refresh();
    }
    flush();
    window.addEventListener("online", flush);
    return () => window.removeEventListener("online", flush);
  }, [router]);
  return null;
}
