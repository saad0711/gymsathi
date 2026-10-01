const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Dhaka",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** YYYY-MM-DD in Bangladesh time */
export function dhakaDate(d: Date): string {
  return fmt.format(d);
}

export function todayDhaka(): string {
  return dhakaDate(new Date());
}

function parse(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-");
  return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
}

export function addDays(dateStr: string, n: number): string {
  const dt = parse(dateStr);
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

/** Monday of the week containing dateStr */
export function weekStart(dateStr: string): string {
  const dt = parse(dateStr);
  const diff = (dt.getUTCDay() + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - diff);
  return dt.toISOString().slice(0, 10);
}

export function formatShort(d: Date, lang: "en" | "bn"): string {
  return new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", {
    timeZone: "Asia/Dhaka",
    day: "numeric",
    month: "short",
  }).format(d);
}
