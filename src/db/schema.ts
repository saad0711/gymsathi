import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  goal: text("goal").notNull(),
  level: text("level").notNull(),
  daysPerWeek: integer("days_per_week").notNull(),
  sessionMinutes: integer("session_minutes").notNull(),
  location: text("location").notNull(),
  gender: text("gender").notNull(),
  age: integer("age").notNull(),
  heightCm: real("height_cm").notNull(),
  weightKg: real("weight_kg").notNull(),
  equipment: jsonb("equipment").$type<string[]>().notNull().default([]),
  injuries: jsonb("injuries").$type<string[]>().notNull().default([]),
  parqFlags: jsonb("parq_flags").$type<string[]>().notNull().default([]),
  dietPref: text("diet_pref").notNull().default("non_veg"),
  budget: text("budget").notNull().default("medium"),
  premiumUntil: timestamp("premium_until"),
  trialUsed: boolean("trial_used").notNull().default(false),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameBn: text("name_bn").notNull(),
  primaryMuscle: text("primary_muscle").notNull(),
  secondaryMuscles: jsonb("secondary_muscles").$type<string[]>().notNull().default([]),
  equipment: jsonb("equipment").$type<string[]>().notNull().default([]),
  movement: text("movement").notNull(),
  type: text("type").notNull(),
  isFree: boolean("is_free").notNull().default(true),
  contra: jsonb("contra").$type<string[]>().notNull().default([]),
  aliases: jsonb("aliases").$type<string[]>().notNull().default([]),
  stepsEn: jsonb("steps_en").$type<string[]>().notNull().default([]),
  stepsBn: jsonb("steps_bn").$type<string[]>().notNull().default([]),
  mistakesEn: jsonb("mistakes_en").$type<string[]>().notNull().default([]),
  mistakesBn: jsonb("mistakes_bn").$type<string[]>().notNull().default([]),
  tipEn: text("tip_en").notNull().default(""),
  tipBn: text("tip_bn").notNull().default(""),
});

export const plans = pgTable(
  "plans",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    goal: text("goal").notNull(),
    splitKey: text("split_key").notNull(),
    weeks: integer("weeks").notNull().default(4),
    rationaleEn: jsonb("rationale_en").$type<string[]>().notNull().default([]),
    rationaleBn: jsonb("rationale_bn").$type<string[]>().notNull().default([]),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("plans_user_idx").on(t.userId)],
);

export const planDays = pgTable("plan_days", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  dayIndex: integer("day_index").notNull(),
  nameEn: text("name_en").notNull(),
  nameBn: text("name_bn").notNull(),
});

export const planExercises = pgTable("plan_exercises", {
  id: serial("id").primaryKey(),
  planDayId: integer("plan_day_id")
    .notNull()
    .references(() => planDays.id, { onDelete: "cascade" }),
  exerciseId: integer("exercise_id")
    .notNull()
    .references(() => exercises.id),
  position: integer("position").notNull(),
  sets: integer("sets").notNull(),
  repMin: integer("rep_min").notNull(),
  repMax: integer("rep_max").notNull(),
  restSec: integer("rest_sec").notNull(),
  rir: integer("rir").notNull(),
});

export const swaps = pgTable("swaps", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const workouts = pgTable(
  "workouts",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planDayId: integer("plan_day_id").references(() => planDays.id, { onDelete: "set null" }),
    startedAt: timestamp("started_at").notNull(),
    finishedAt: timestamp("finished_at"),
    durationSec: integer("duration_sec").notNull().default(0),
  },
  (t) => [index("workouts_user_idx").on(t.userId)],
);

export const setLogs = pgTable(
  "set_logs",
  {
    id: serial("id").primaryKey(),
    workoutId: integer("workout_id")
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    exerciseId: integer("exercise_id")
      .notNull()
      .references(() => exercises.id),
    setNumber: integer("set_number").notNull(),
    weightKg: real("weight_kg").notNull(),
    reps: integer("reps").notNull(),
  },
  (t) => [index("set_logs_workout_idx").on(t.workoutId)],
);

export const weightLogs = pgTable("weight_logs", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  weightKg: real("weight_kg").notNull(),
  loggedAt: timestamp("logged_at").notNull().defaultNow(),
});

export type AuditResultJson = {
  score: number;
  goal: string;
  lines: {
    line: string;
    nameEn?: string;
    nameBn?: string;
    sets?: number;
    repMin?: number;
    repMax?: number;
    assumed?: boolean;
  }[];
  unrecognized: string[];
  weeklySets: Record<string, number>;
  split: { push: number; pull: number; legs: number; core: number };
  findings: { severity: "high" | "medium" | "low" | "good"; en: string; bn: string }[];
};

export const audits = pgTable("audits", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  inputText: text("input_text").notNull(),
  goal: text("goal").notNull(),
  score: integer("score").notNull(),
  result: jsonb("result").$type<AuditResultJson>().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const foods = pgTable("foods", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  nameBn: text("name_bn").notNull(),
  portionEn: text("portion_en").notNull(),
  portionBn: text("portion_bn").notNull(),
  calories: integer("calories").notNull(),
  protein: real("protein").notNull(),
  carbs: real("carbs").notNull(),
  fat: real("fat").notNull(),
  category: text("category").notNull(),
});

export const foodLogs = pgTable(
  "food_logs",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    foodId: integer("food_id")
      .notNull()
      .references(() => foods.id),
    servings: real("servings").notNull().default(1),
    loggedOn: date("logged_on").notNull(),
  },
  (t) => [index("food_logs_user_idx").on(t.userId, t.loggedOn)],
);

export type User = typeof users.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
