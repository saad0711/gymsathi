export type Lang = "en" | "bn";
export const LANG_COOKIE = "gs_lang";
export const USER_COOKIE = "gs_uid";

export function pick(lang: Lang, en: string, bn: string) {
  return lang === "bn" ? bn : en;
}

export const MUSCLES = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "quads",
  "hamstrings",
  "glutes",
  "calves",
  "core",
] as const;
export type Muscle = (typeof MUSCLES)[number];

export const MUSCLE_LABELS: Record<Muscle, { en: string; bn: string }> = {
  chest: { en: "Chest", bn: "বুক" },
  back: { en: "Back", bn: "পিঠ" },
  shoulders: { en: "Shoulders", bn: "কাঁধ" },
  biceps: { en: "Biceps", bn: "বাইসেপ" },
  triceps: { en: "Triceps", bn: "ট্রাইসেপ" },
  quads: { en: "Quads", bn: "সামনের উরু" },
  hamstrings: { en: "Hamstrings", bn: "পেছনের উরু" },
  glutes: { en: "Glutes", bn: "নিতম্ব" },
  calves: { en: "Calves", bn: "পায়ের ডিম" },
  core: { en: "Core", bn: "পেট/কোর" },
};

export const EQUIPMENT = [
  "bodyweight",
  "dumbbells",
  "barbell",
  "bench",
  "cable",
  "lat_pulldown",
  "leg_press",
  "machines",
  "pullup_bar",
] as const;
export type Equip = (typeof EQUIPMENT)[number];

export const EQUIPMENT_LABELS: Record<Equip, { en: string; bn: string }> = {
  bodyweight: { en: "Bodyweight only", bn: "শুধু নিজের ওজন" },
  dumbbells: { en: "Dumbbells", bn: "ডাম্বেল" },
  barbell: { en: "Barbell + rack", bn: "বারবেল + র‍্যাক" },
  bench: { en: "Bench", bn: "বেঞ্চ" },
  cable: { en: "Cable / pulley station", bn: "কেবল / পুলি মেশিন" },
  lat_pulldown: { en: "Lat pulldown machine", bn: "ল্যাট পুলডাউন মেশিন" },
  leg_press: { en: "Leg press", bn: "লেগ প্রেস" },
  machines: { en: "Selector machines (chest press, leg curl…)", bn: "সিলেক্টর মেশিন (চেস্ট প্রেস, লেগ কার্ল…)" },
  pullup_bar: { en: "Pull-up bar", bn: "পুল-আপ বার" },
};

export const GYM_DEFAULT_EQUIPMENT: Equip[] = [
  "dumbbells",
  "barbell",
  "bench",
  "cable",
  "lat_pulldown",
  "leg_press",
  "machines",
  "pullup_bar",
];
export const HOME_DEFAULT_EQUIPMENT: Equip[] = ["bodyweight"];

export type Movement = "push" | "pull" | "legs" | "core";

export const GOALS = ["fat_loss", "muscle_gain", "strength", "general", "posture"] as const;
export const GOAL_LABELS: Record<string, { en: string; bn: string }> = {
  fat_loss: { en: "Fat loss", bn: "ওজন/চর্বি কমানো" },
  muscle_gain: { en: "Muscle gain", bn: "পেশি বাড়ানো" },
  strength: { en: "Strength", bn: "শক্তি বাড়ানো" },
  general: { en: "General fitness", bn: "সাধারণ ফিটনেস" },
  posture: { en: "Posture / health", bn: "ভঙ্গি / স্বাস্থ্য" },
};

export const LEVELS = ["never", "under6", "intermediate"] as const;
export const LEVEL_LABELS: Record<string, { en: string; bn: string }> = {
  never: { en: "Never trained", bn: "কখনো জিম করিনি" },
  under6: { en: "Under 6 months", bn: "৬ মাসের কম" },
  intermediate: { en: "6–24 months", bn: "৬–২৪ মাস" },
};

export const INJURIES = ["knee", "shoulder", "back", "wrist", "elbow"] as const;
export const INJURY_LABELS: Record<string, { en: string; bn: string }> = {
  knee: { en: "Knee", bn: "হাঁটু" },
  shoulder: { en: "Shoulder", bn: "কাঁধ" },
  back: { en: "Lower back", bn: "কোমর/পিঠ" },
  wrist: { en: "Wrist", bn: "কব্জি" },
  elbow: { en: "Elbow", bn: "কনুই" },
};

export const PARQ = [
  { id: "heart", en: "A doctor has said you have a heart condition", bn: "ডাক্তার বলেছেন আপনার হৃদরোগ আছে" },
  { id: "chest_pain", en: "You feel chest pain when active", bn: "শরীরচর্চার সময় বুকে ব্যথা হয়" },
  { id: "dizzy", en: "You often feel dizzy or faint", bn: "প্রায়ই মাথা ঘোরে বা অজ্ঞান লাগে" },
  { id: "bp", en: "You take medicine for blood pressure or a heart problem", bn: "প্রেসার বা হার্টের ওষুধ খান" },
  { id: "joint", en: "A bone or joint problem that exercise could worsen", bn: "হাড় বা জয়েন্টের সমস্যা যা ব্যায়ামে বাড়তে পারে" },
  { id: "other", en: "Any other reason you should not exercise", bn: "ব্যায়াম না করার অন্য কোনো কারণ আছে" },
] as const;

export const BADGES = [
  { id: "first_workout", icon: "🏁", en: "First workout", bn: "প্রথম ওয়ার্কআউট", descEn: "Finish your first session", descBn: "প্রথম সেশন শেষ করুন" },
  { id: "first_week", icon: "📅", en: "First week done", bn: "প্রথম সপ্তাহ শেষ", descEn: "Hit your weekly target", descBn: "সাপ্তাহিক লক্ষ্য পূরণ করুন" },
  { id: "ten_workouts", icon: "🔟", en: "10 workouts", bn: "১০টি ওয়ার্কআউট", descEn: "Complete 10 sessions", descBn: "১০টি সেশন শেষ করুন" },
  { id: "first_pr", icon: "🏆", en: "First PR", bn: "প্রথম PR", descEn: "Beat your previous best", descBn: "আগের সেরাকে ছাড়িয়ে যান" },
  { id: "streak_4", icon: "🔥", en: "4-week streak", bn: "৪ সপ্তাহের স্ট্রিক", descEn: "Hit your target 4 weeks in a row", descBn: "টানা ৪ সপ্তাহ লক্ষ্য পূরণ করুন" },
  { id: "twenty_five", icon: "💪", en: "25 workouts", bn: "২৫টি ওয়ার্কআউট", descEn: "Complete 25 sessions", descBn: "২৫টি সেশন শেষ করুন" },
] as const;

export const FREE_LIMITS = { swapsPerWeek: 3, audits: 1, foodLogsPerDay: 5 } as const;

export const PRICING = [
  { id: "monthly", days: 30, bdt: 149, en: "Monthly", bn: "মাসিক" },
  { id: "quarterly", days: 90, bdt: 399, en: "Quarterly", bn: "ত্রৈমাসিক" },
  { id: "yearly", days: 365, bdt: 999, en: "Yearly", bn: "বার্ষিক" },
] as const;
export const STUDENT_DISCOUNT = 0.4;
export const PAYMENT_METHODS = ["bkash", "nagad", "rocket", "sslcommerz"] as const;
export const PAYMENT_LABELS: Record<string, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
  sslcommerz: "Card / SSLCommerz",
};

/** Gym-sponsored / promo codes: code -> premium days */
export const PROMO_CODES: Record<string, number> = {
  GYMSATHI7: 7,
  DHAKAGYM: 30,
  STUDENT30: 30,
};
