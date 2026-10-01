# Product Requirements Document (PRD)

**Working name:** GymSathi (placeholder; "sathi" means companion)
**Platform:** Android first (iOS later), with a lightweight web landing page
**Market:** Bangladesh first, then South Asia
**Version:** 1.0 (draft)

---

## 1. Vision

> "Walk into any gym and know exactly what to do, how to do it, and whether it's working, without paying for a trainer."

The app is a pocket coach for beginners and amateurs. It removes the confusion and intimidation of the first 90 days, which is when most people quit, and then grows with the user into intermediate training.

---

## 2. Problem Statement

### 2.1 What happens to a beginner today
1. They join a gym and get a generic "full-body routine" (often copied to everyone).
2. They don't know the machines, the form, the rep and set logic, or why they're doing something.
3. They get sore, see no change, feel judged, and lose motivation.
4. They quit within 4-12 weeks.

### 2.2 Root problems
| # | Problem | Result |
|---|---|---|
| 1 | One-size-fits-all routines | Wrong volume, wrong exercises for the goal |
| 2 | No explanation of why | No confidence, no buy-in |
| 3 | Poor programming (e.g., 20 reps of lat pulldown every set, no progression) | Slow or no results |
| 4 | Paying for low-value "assistant trainers" (BDT 5-6k/month) | Money spent, little value |
| 5 | Gym intimidation (equipment, etiquette, crowding) | Early dropout |
| 6 | No tracking, so no visible progress | Motivation dies |
| 7 | Diet advice is Western (oats, quinoa, whey) and doesn't fit local food or budgets | People ignore nutrition |
| 8 | Injury risk from bad form | Forced breaks, quitting |
| 9 | Existing apps are English-only, data-heavy, expensive in USD, and assume a fully equipped Western gym | Low adoption locally |

---

## 3. Target Users and Personas

**Persona 1: Rafi, 19, university student (primary).** Brand-new to the gym, tight budget, confused by the routine, uses a low-end Android phone. Wants to look better, gain weight, and not feel dumb.

**Persona 2: Nusrat, 26, office worker.** Wants fat loss and toning. Worried about looking awkward in a male-dominated gym. Needs privacy and structure. Limited time (45 min).

**Persona 3: Tanvir, 24, 1-2 years in (amateur).** Plateaued, follows random YouTube plans, wants progressive overload, analytics, and a proper split.

**Persona 4 (B2B): Gym owner.** Wants better retention and a modern image, and doesn't want to hire more staff.

---

## 4. Competitor Limitations (Gap Analysis)

| Typical app | Limitation | Our opportunity |
|---|---|---|
| Generic workout loggers (Strong, Hevy) | Great logging, but no coaching or guidance for beginners | Guided plans plus explanations |
| Big AI fitness apps (Fitbod, Freeletics) | Expensive in USD, English-only, assume full equipment | Local pricing, Bangla, equipment-aware |
| YouTube / Instagram trainers | No personalization or accountability | Personalized, structured, tracked |
| Calorie trackers (MyFitnessPal) | Poor Bangladeshi food database | Local food database (bhat, dal, rui, khichuri, biryani, etc.) |
| Local gym apps | Mostly attendance/billing | Real training intelligence |

**Our wedge:** Beginner-first, Bangla-first, gym-floor-first, and affordable.

---

## 5. Product Principles

1. **Never overwhelm.** Show one thing to do next.
2. **Explain the why.** Every exercise, set, and rep range has a short reason.
3. **Free must be genuinely useful.** Free users should get real results. Paywall depth and personalization, not basic safety or logging.
4. **Offline-first, low-data.** It must work in gyms with bad signal and on 3 GB RAM phones.
5. **Bangla + English (Banglish-friendly).**
6. **Safety first.** Conservative defaults, a clear disclaimer, and red-flag screening.
7. **Celebrate small wins.** Early retention comes from progress and feeling capable.

---

## 6. Core Feature Modules

Legend: **[Free]** available to everyone | **[Premium]** subscribers only

### Module A: Onboarding and Profiling
- Goal (fat loss, muscle gain, strength, general fitness, posture/health).
- Experience level (never trained, under 6 months, 6-24 months).
- Days per week, session length, and gym vs home.
- Body stats, injuries and limitations, and a PAR-Q style health screen.
- Gym equipment profile: pick what your gym has (many BD gyms lack certain machines).
- Diet preference (veg/non-veg, budget level, halal default).
- Output: a first plan in under 2 minutes, with no sign-up wall before seeing value.

**[Free]** Full onboarding, 1 personalized plan
**[Premium]** Re-generation and adaptation over time

### Module B: Smart Workout Plans (core)
- Plan generator based on goal, level, schedule, and equipment.
  - Beginner: 3-day full body or upper/lower, using sensible rep ranges (e.g., 8-12 for hypertrophy, 5-8 for compound strength, 12-15 for some isolation), 2-4 sets, and RIR/effort guidance. Not 20 reps of everything.
  - Progressive overload rules built in (add reps, then weight).
  - Automatic deload suggestions.
- "Why this plan?" explanation screen in simple language.
- Swap exercise when a machine is busy or unavailable.
- Women-focused and general-health templates.
- Home/no-equipment and dumbbell-only plans.

**[Free]** 1 active auto-generated beginner plan (3-day or 4-day), limited exercise swaps per week, 4-week program
**[Premium]** Adaptive plans that change based on logged performance, multi-phase periodization (hypertrophy, strength, cut), unlimited swaps, custom split builder, deloads, plateau-breaker logic, specialization blocks (arms, glutes, posture), and multiple plans

### Module C: In-Gym Guided Session ("Gym Mode") - key differentiator
- Step-by-step session view: exercise, sets, target reps, weight suggestion, and rest timer.
- Large buttons (usable with sweaty hands), dark mode, and screen-awake.
- Auto-suggested weight from last session and "beat last time" prompts.
- Warm-up and cool-down generator.
- Audio or vibration cues for rest timers.
- Offline logging with sync later.
- "Machine busy?" button suggests an equivalent alternative.

**[Free]** Full guided session, logging, rest timer, basic warm-up
**[Premium]** Auto weight and rep progression, smart rest times by exercise type, voice-guided sessions (Bangla voice), superset/circuit auto-handling, time-crunch mode ("only 30 min today" compresses the workout intelligently)

### Module D: Exercise Library
- Short looping videos or animations (lightweight, cached) for 200-300 exercises.
- Bangla and English instructions, primary and secondary muscles, common mistakes, and machine setup tips (seat height, pin position).
- Beginner-friendly "how to use this machine" guides.
- Gym etiquette and orientation guide: "Your first day at the gym."

**[Free]** Core library (about 100 essential exercises), full beginner orientation, basic form cues
**[Premium]** Full library (300+), multi-angle videos, variations and progressions/regressions, injury-friendly alternatives (e.g., "bad knee" substitutes)

### Module E: Plan Auditor ("Trainer Check") - viral, pain-point feature
Users enter or scan the routine their trainer gave them. The app gives a second opinion:
- Volume per muscle group per week.
- Push/pull/legs balance.
- Rep-range suitability for the stated goal.
- Missing muscle groups, excessive junk volume, and recovery issues.
- Simple score plus suggestions. The tone is neutral, e.g. "This plan could be improved by...", not trainer-bashing.

**[Free]** 1 audit, summary score and 2-3 key findings
**[Premium]** Unlimited audits, detailed breakdown, one-tap "fix my plan" that generates an improved version

(This is a highly shareable feature and a strong acquisition hook. Keep the language respectful so gyms and trainers don't turn against the app.)

### Module F: Progress Tracking and Motivation
- Workout history, PR (personal record) tracking, streaks, and weekly consistency.
- Body weight, measurements, and progress photos (private, stored locally by default).
- Milestones and badges for early wins: "First week done," "First 10 workouts," "First PR."
- Weekly summary card, shareable to Facebook/Instagram/WhatsApp.
- Missed-workout recovery ("Don't start over, here's a lighter re-entry session").

**[Free]** Basic history, streaks, PRs, weight tracking, badges, weekly summary
**[Premium]** Advanced analytics (volume per muscle, strength curves, estimated 1RM, fatigue and recovery trends, body composition trends), photo comparison slider, monthly progress report (PDF), data export, and a "Wrapped" year-in-review

### Module G: Nutrition (localized)
- Bangladeshi food database: bhat, ruti, dal, egg, chicken curry, rui/ilish/tilapia, beef, khichuri, biryani, street snacks (fuchka, singara), local fruits, and more, in typical home and restaurant portions (bati, plate, piece).
- Simple calorie and protein targets by goal.
- Budget-aware suggestions: "High-protein on BDT 150/day" (eggs, dal, soybean, chicken liver, banana/milk, etc.).
- Simple hydration reminders.
- Ramadan mode: sahri/iftar meal timing and adjusted training windows.
- Supplement guidance with honest, myth-busting info: what's actually necessary (mostly nothing), and warnings against fake or unsafe products.

**[Free]** Calorie and protein target, basic food logging (limited entries per day or quick-add protein tracker), myth-busting content, hydration reminder, sample budget meal ideas
**[Premium]** Full meal planner (weekly, local cuisine, budget slider), unlimited logging, barcode or photo logging (where feasible), macro breakdown, grocery list, vegetarian/cutting/bulking variants, Ramadan full plan, recipe library

### Module H: Form Check and Safety
- Injury-aware filtering: flagged conditions reduce or substitute risky exercises.
- Pain reporting: "Something hurts," then guidance on whether to stop, swap, or see a professional.
- Basic DOMS education: "Soreness is normal, and here's what isn't."
- AI video form check: record a set, get feedback on key points (squat depth, back rounding, etc.). Start with a limited set of big lifts, and be explicit about its limitations.

**[Free]** Form tips, safety screening, pain guidance
**[Premium]** Video-based form analysis (monthly quota, e.g., 10 checks), injury-rehab-style mobility routines

### Module I: Coaching and Community
- **[Free]** Community feed (read and basic posting), monthly public challenges, moderated Q&A/FAQs, beginner mentor-matching opt-in.
- **[Premium]** Certified coach access: chat-based check-ins and plan review from verified coaches at a fraction of in-person trainer costs (e.g., BDT 500-1,500/month add-on or bundled tiers). Revenue share goes to the platform.
- **[Premium]** Private accountability groups, workout-buddy matching (same gym or area), leaderboards with friends.
- **[Free + Premium]** Women-only safe community spaces (free to join, premium coaching by female coaches).

### Module J: Gamification and Retention
- XP, levels, streak freezes (premium gets more), and weekly goals.
- Reward loops: unlock new plan content or badges.
- Smart notifications: "Leg day tomorrow," plus easy snooze and reschedule. Avoid spam.
- Partner rewards: discounts from gyms, supplement shops (only vetted ones), and sportswear brands (later).

### Module K: Wearables and Integrations (later)
- **[Premium]** Google Fit / Health Connect, Mi Band, and other popular budget wearables in BD.
- **[Premium]** Heart rate-based intensity and recovery insight.

### Module L: Gym Partner Portal (B2B)
- Gym owners get a dashboard: member engagement, at-risk (likely to quit) alerts, branded plans, and QR check-in.
- Gym-sponsored premium codes ("Free premium for our members").
- Optionally, trainers use it to build better plans faster, making the app trainer-augmenting, not trainer-replacing, which can also reduce pushback.

---

## 7. Free vs Premium Matrix

| Feature | Free | Premium |
|---|---|---|
| Onboarding and profile | Yes | Yes |
| Auto-generated plan | 1 beginner plan | Adaptive, multi-phase, unlimited |
| Exercise swaps | Limited (e.g., 3/week) | Unlimited |
| Gym Mode (guided session) | Core | Auto-progression, voice, time-crunch |
| Workout logging | Unlimited, always | Yes |
| Rest timer | Yes | Smart |
| Exercise library | ~100 essentials | 300+, variations, multi-angle |
| Gym orientation and etiquette | Yes | Yes |
| Plan Auditor | 1 audit, summary | Unlimited plus "fix my plan" |
| Streaks, PRs, badges | Yes | More streak freezes |
| Progress analytics | Basic | Advanced and exportable |
| Progress photos | Basic storage | Comparison tools, reports |
| Nutrition targets | Yes | Yes |
| Food logging | Limited or quick protein tracker | Unlimited, full macros |
| Bangladeshi food database | Searchable, limited logs | Full, plus meal planner |
| Budget meal ideas | Samples | Full weekly planners and grocery list |
| Ramadan mode | Basic tips | Full training and meal plan |
| Form tips | Text and video cues | AI video form check |
| Injury-aware plans | Basic screening | Full substitutions, mobility and rehab routines |
| Community | Read, post, join challenges | Private groups, buddy matching |
| Coach access | No | Add-on or higher tier |
| Wearable sync | No | Yes |
| Ads | Minimal, non-intrusive (or none at launch) | Ad-free |
| Offline mode | Core | Full |

### Why this split works
- **Free builds habit and trust.** Logging, basic plan, guidance, and streaks are never gated, so users form the habit.
- **Premium sells personalization and outcomes.** Adaptation, deeper analytics, nutrition planning, and human and AI feedback are where users feel real value.
- **Safety basics stay free.** Gating safety would be unethical and bad for brand.

---

## 8. Conversion Strategy (How Free Turns into Premium)

**Natural upgrade moments (contextual paywalls, not random pop-ups):**
1. After completing the first full week ("You hit 3/3 workouts! Unlock adaptive progression.")
2. When a user hits a plateau or repeats the same weights for 2+ sessions.
3. When they try to use their 2nd Plan Audit.
4. When they swap more than the free limit.
5. After logging 7 days of food, offering the full meal planner.
6. Before Ramadan (seasonal campaign).
7. After a PR or milestone, when the user is emotionally high.
8. Free trial of 7 days, triggered after activation (e.g., 3 completed workouts), not on install.

**Other tactics:**
- Student discount (verified via student email or ID).
- Gym-sponsored codes.
- Referral: "Invite a friend, both get 1 week of premium."
- Annual plan discount.
- Win-back offers for lapsed subscribers.

---

## 9. Pricing and Payments (Bangladesh-Specific)

Suggested starting points (to be tested):
| Plan | Price (BDT) |
|---|---|
| Monthly | 149-199 |
| Quarterly | 399-499 |
| Yearly | 999-1,499 |
| Student | ~40% off |
| Coach add-on | 500-1,500/month |

**Payments:**
- Local gateways: bKash, Nagad, Rocket, SSLCommerz, plus cards and mobile carrier billing where possible.
- Many users lack international cards, so local wallets are essential. Verify whether Google Play Billing is viable for your developer account and region, and plan for an alternative checkout if not. Check policy compliance, as Play requires its billing for digital subscriptions in many cases.
- Offer prepaid passes (1/3/12 months) in addition to auto-renew, since recurring wallet billing is often limited.
- Possible voucher-style prepaid codes sold through gyms and shops.

---

## 10. Non-Functional Requirements

- **Performance:** Runs smoothly on 2-3 GB RAM Android devices; app size under ~50 MB initially, with on-demand media downloads.
- **Offline-first:** Workouts, exercise library (cached), and logging work with no internet. Sync when online.
- **Data efficiency:** Compressed videos (short loops), and a Wi-Fi-only download option.
- **Localization:** Bangla and English, Bangla numerals optional, and a font that renders well.
- **Privacy:** Health data is sensitive, so encrypt, use minimal collection, keep progress photos local by default, and support deletion. Comply with Bangladesh's data protection rules and Google Play policies.
- **Accessibility:** Large tap targets, high contrast, and a readable UI in bright or dim gym lighting.
- **Safety and legal:** Medical disclaimer, red-flag screening, and "consult a doctor" prompts for certain conditions. Don't give medical diagnoses. Keep supplement content evidence-based.

---

## 11. Success Metrics

| Category | Metric | Target (initial) |
|---|---|---|
| Activation | % completing onboarding and first workout within 48h | >40% |
| Retention | Day-7 / Day-30 / Day-90 retention | 35% / 20% / 10% |
| Engagement | Workouts logged per active user per week | >=2.5 |
| Gym habit | % users reaching 12 workouts (about 4 weeks) | >30% |
| Conversion | Free to premium | 3-6% (of actives) |
| Trial | Trial to paid | 25-40% |
| Churn | Monthly premium churn | <8% |
| Virality | Plan Auditor shares, referrals per user | Track K-factor |
| Satisfaction | NPS, app rating | NPS >40, rating >=4.5 |

**North Star metric:** Number of users who complete 12+ workouts in their first 8 weeks, because it measures whether the core problem (beginner dropout) is being solved.

---

## 12. Roadmap

### Phase 1: MVP (about 3-4 months)
- Onboarding and profile
- Plan generator (beginner templates, rule-based, not heavy AI)
- Gym Mode with logging and rest timer
- Exercise library (about 100 exercises, Bangla and English)
- Basic progress: streaks, PRs, weight
- Gym orientation guide
- Plan Auditor (basic rules-based version)
- Offline support
- Premium paywall and local payments (basic)

### Phase 2: V1 (months 4-7)
- Bangladeshi food database and nutrition basics
- Adaptive progression (premium)
- Advanced analytics
- Challenges and community
- Ramadan mode
- Referral system
- Gym partner pilot (5-10 gyms)

### Phase 3: V2 (months 7-12)
- AI video form check
- Coach marketplace
- Full meal planner with budget mode
- Wearable integration
- Gym owner dashboard
- iOS release
- Expand to India, Pakistan, Nepal, Sri Lanka

---

## 13. Suggested Tech Stack

- **Mobile:** Flutter or React Native (single codebase, good for low-end Android).
- **Backend:** Node.js/NestJS or Django, PostgreSQL, Redis.
- **Offline sync:** Local DB (SQLite / Isar / WatermelonDB) with a sync layer.
- **Media:** CDN with compressed video/WebM or Lottie animations.
- **AI/ML:** Start rule-based for plans (more predictable, cheaper, safer). Add ML later (pose estimation via MediaPipe/MoveNet for form check, on-device where possible).
- **Analytics:** PostHog, Firebase, or Mixpanel.
- **Payments:** SSLCommerz / bKash / Nagad integration.
- **Content:** A CMS so non-developers can update exercises, food data, and articles.

---

## 14. Go-to-Market

1. **Hyperlocal launch:** Start with 10-20 gyms in Dhaka (university areas such as Dhanmondi, Mirpur, and Uttara). Offer gyms free premium for their members.
2. **Student channels:** University clubs, Facebook groups, and campus ambassadors.
3. **Content marketing in Bangla:** Short Reels/TikToks/YouTube Shorts on "gym myths," "why 20 reps every set is wrong," "budget protein meals," and "first day at the gym."
4. **Plan Auditor as the viral hook:** "Get a second opinion on your trainer's routine." Keep the tone respectful.
5. **Micro-influencers:** Local fitness creators with honest, educational content.
6. **Partnerships:** Gyms, local supplement shops (ethical ones), and university sports departments.
7. **Community:** A Facebook group or Messenger/WhatsApp community for early users and feedback.

---

## 15. Revenue Streams

1. Premium subscriptions (primary)
2. Coach marketplace commission (20-30%)
3. Gym B2B SaaS (monthly per-gym fees or per-member)
4. Sponsored challenges and brand partnerships (vetted)
5. Affiliate sales (equipment, healthy food)
6. Corporate wellness packages (later)

---

## 16. Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Low willingness to pay | Affordable local pricing, student tiers, gym-sponsored access, prepaid vouchers |
| Payment friction | Local wallet integration, prepaid plans |
| Trainer and gym pushback | Position as trainer-augmenting, use neutral language in audits, give gyms a partner dashboard |
| Injury or liability from bad advice | Conservative plans, screening, disclaimers, expert review of content, certified professionals on the team |
| Content creation cost (videos, food data) | Start small with 100 exercises and a curated food list, then expand; get coaches and nutritionists to co-create |
| User churn after the first weeks | Strong early-win design, streak mechanics, reactivation flow |
| Incorrect or unverified AI output | Rule-based core, human-reviewed templates, AI only for clearly bounded tasks |
| Privacy and data regulation | Minimal data collection, encryption, clear consent |
| Copycats | Build a moat with local data (food, equipment, gym partnerships), community, and brand trust |

---

## 17. Open Questions to Validate Before Building

1. Will beginners pay BDT 149/month, or is a yearly pass or gym-sponsored model stronger?
2. Do women want separate community spaces and female coaches (likely yes, but validate)?
3. How many gyms have the equipment variety assumed (cable machines, etc.)?
4. Is Google Play Billing available to you, or will you rely on local gateways?
5. Which dialect and tone of Bangla feel natural (formal vs conversational)?
6. Can you partner with a certified trainer or sports scientist to validate plan logic?

---

## 18. Immediate Next Steps

1. **Validate:** Interview 30-50 beginners and 5-10 gym owners. Ask about dropout reasons, willingness to pay, and current spending.
2. **Build a clickable prototype** (Figma) of onboarding, Gym Mode, and Plan Auditor.
3. **Recruit an advisor:** A certified strength coach plus a nutritionist.
4. **Content seeding:** Create the first 100 exercises and about 200 local foods.
5. **Pilot:** Launch an MVP with 2-3 friendly gyms, track the North Star metric, and iterate.

---

### A note on positioning
Your insight about unnecessary assistant trainers is real, but frame the app as "give every gym member a coach-quality plan and understanding." Some trainers do great work, and you'll want gyms as allies, not enemies. Because gyms are also your best distribution channel, the B2B side matters.