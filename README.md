# GymSathi

GymSathi is a calm, beginner-first workout companion for Bangladeshi Android users. It turns a short onboarding flow into a rule-based plan, guides the user through Gym Mode, and makes progress visible over the first 90 days.

The interface is designed around one question: **what should I do next?**

## Product scope

This repository follows the revised GYM1.1.md PRD and its P0 closed-pilot boundary:

- Guest onboarding with goal, schedule, equipment, limitations, and safety screening
- Rule-based beginner plan generation with reviewed exercise substitutions
- Gym Mode for sets, reps, load, notes, rest timers, and session resume
- Offline-first local logging with visible sync state
- Bangla and English exercise cues
- Progress, streaks, personal bests, and body-weight history
- First-day gym orientation
- Manual Plan Auditor for a structured second opinion
- Privacy, consent, feedback, analytics, and crash-monitoring hooks

Nutrition databases, live subscriptions, OCR plan scanning, AI form checking, public community, wearable integrations, and gym-owner tools remain future roadmap work.

## Experience direction

The UI was rebuilt as a dark, editorial fitness system:

- Lime signal color with restrained aqua and amber safety states
- Glass panels and high-contrast type for gym-floor readability
- Responsive desktop sidebar and mobile bottom navigation
- Scroll progress, reveal-on-scroll sections, hover shine, and reduced-motion support
- Large touch targets, visible offline language, and focused one-next-step CTAs

## Stack

- Next.js App Router and React
- TypeScript
- Tailwind CSS v4
- Drizzle ORM with Supabase Postgres
- Local session and seed data helpers included in src/lib

## Run locally with Supabase

1. Create a Supabase project at https://supabase.com/dashboard.
2. In the project dashboard, open **Connect** and copy the **Session pooler** connection string. This project uses a server-side Drizzle connection, and the session pooler works well for local IPv4 networks.
3. Create `.env.local` in the project root:

   ~~~env
   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@[POOLER-HOST]:5432/postgres?sslmode=require
   ~~~

   Replace the placeholders with the exact values from Supabase. URL-encode reserved characters in the password, such as @, #, ?, &, or spaces.
4. Install dependencies and apply the schema:

   ~~~bash
   npm install
   npx drizzle-kit push
   ~~~

5. Start the app:

   ~~~bash
   npm run dev
   ~~~

Open http://localhost:3000.

The runtime pool is created in src/db/index.ts; Drizzle reads the same DATABASE_URL through drizzle.config.ts. No Supabase service-role key is required for this server-side Postgres connection. Keep database credentials in .env.local and never commit them.

## Useful scripts

~~~bash
npm run dev       # local development
npm run build     # production build
npm run start     # serve the production build
npm run lint      # ESLint
npm run typecheck # TypeScript check
~~~

## Repository map

- src/app/page.tsx â€” marketing landing page
- src/app/onboarding â€” guest onboarding flow
- src/app/app â€” authenticated/guest product shell and core screens
- src/components â€” shared UI, motion, Gym Mode, onboarding, and form components
- src/lib/plan-generator.ts â€” rule-based plan engine
- src/lib/auditor.ts â€” manual Plan Auditor rules
- src/lib/seed-data â€” local exercise and food seed data
- GYM1.1.md â€” revised product requirements

## Safety boundary

GymSathi provides general fitness information, not medical advice. The onboarding safety screen and stop cues are deliberately conservative. Users with health concerns should seek qualified medical guidance before training.

## License

This project is prepared as a private pilot repository. Add the license that matches your ownership and distribution decision before making the repository public.

