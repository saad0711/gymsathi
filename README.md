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
- Drizzle ORM with PostgreSQL
- Local session and seed data helpers included in src/lib

## Run locally

1. Install Node.js 20 or newer and PostgreSQL.
2. Install dependencies:

   ~~~bash
   npm install
   ~~~

3. Create .env.local with a PostgreSQL connection string:

   ~~~env
   DATABASE_URL=postgres://user:password@localhost:5432/gymsathi
   ~~~

4. Push the Drizzle schema and start the app:

   ~~~bash
   npx drizzle-kit push
   npm run dev
   ~~~

Open http://localhost:3000.

## Useful scripts

~~~bash
npm run dev       # local development
npm run build     # production build
npm run start     # serve the production build
npm run lint      # ESLint
npm run typecheck # TypeScript check
~~~

## Repository map

- src/app/page.tsx — marketing landing page
- src/app/onboarding — guest onboarding flow
- src/app/app — authenticated/guest product shell and core screens
- src/components — shared UI, motion, Gym Mode, onboarding, and form components
- src/lib/plan-generator.ts — rule-based plan engine
- src/lib/auditor.ts — manual Plan Auditor rules
- src/lib/seed-data — local exercise and food seed data
- GYM1.1.md — revised product requirements

## Safety boundary

GymSathi provides general fitness information, not medical advice. The onboarding safety screen and stop cues are deliberately conservative. Users with health concerns should seek qualified medical guidance before training.

## License

This project is prepared as a private pilot repository. Add the license that matches your ownership and distribution decision before making the repository public.
