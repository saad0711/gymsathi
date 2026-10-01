# Product Requirements Document

**Working name:** GymSathi (placeholder; “sathi” means companion)  
**Platform:** Android first, with a lightweight web landing page; iOS later  
**Market:** Bangladesh first, then South Asia  
**Version:** 1.1  
**Status:** Approved scope revision for product planning  
**Revision date:** 1 October 2026  

> This PRD is a product and engineering specification. It is not medical advice, legal advice, or a substitute for review by qualified professionals.

---

## Revision summary

Version 1.1 keeps the original vision and long-term product direction, but makes the first release a focused beginner workout product. The initial pilot will validate the complete workout loop before the team operates nutrition, community, coach, payment, or gym-management systems at scale.

### Decisions made in this revision

1. **P0 is the beginner workout loop:** guest onboarding, safety screening, a rule-based plan, equipment substitutions, Gym Mode, offline logging and sync, a 60–100 exercise library, basic progress, first-day orientation, one manual Plan Auditor audit, analytics, feedback, privacy controls, and crash monitoring.
2. **The primary launch customer is narrow:** a Bangladeshi Android user aged 18–35 who recently joined a gym, has limited training knowledge, uses a low-cost phone, and wants a simple structured workout plan.
3. **P0 is a free pilot.** Premium entitlements and live subscription payments are designed in the architecture but are not required for the first closed pilot.
4. **One active plan is the safety and usability rule.** Older plans may be archived; multiple simultaneous active plans are deferred.
5. **P0 uses manual structured Plan Auditor input.** Image/OCR scanning is a later experiment.
6. **P0 does not include diagnosis, rehabilitation claims, AI form checking, a food database, community operations, coach payments, wearables, or a gym-owner portal.** These remain in the product roadmap with explicit controls.
7. **The app must work as a guest.** Account creation is optional until a user wants cross-device backup, account recovery, or a future paid entitlement.

---

## 1. Vision

> “Walk into any gym and know exactly what to do, how to do it, and whether it is working, without paying for a trainer.”

GymSathi is a Bangla-first pocket coach for beginners. It reduces the confusion and intimidation of the first 90 days by giving a user a safe, equipment-aware plan, clear exercise cues, a practical in-gym workflow, and visible progress. The product can grow into intermediate training and local nutrition support after the core habit is proven.

### Product outcome

Within the first eight weeks, a new user should be able to attend the gym consistently, complete a safe structured session, understand the reason for the main exercises, record the work offline, and see reliable progress history.

### Positioning

GymSathi gives every gym member coach-quality structure and understanding. It is trainer-augmenting and gym-friendly. The Plan Auditor uses neutral language and never attacks an individual trainer.

---

## 2. Problem statement and assumptions

### 2.1 Beginner problem

A new gym member commonly receives a generic routine, does not understand machines or set and rep logic, has no reliable way to progress, and loses confidence when the gym is crowded or the connection is poor. The result is early dropout, avoidable discomfort, and money spent without a clear outcome.

### 2.2 Working problem hypotheses

The following statements are hypotheses for validation, not established facts:

| # | Working hypothesis | Product implication |
|---|---|---|
| 1 | One-size-fits-all routines do not fit a user’s goal, experience, or equipment. | Ask for goal, experience, schedule, equipment, and constraints. |
| 2 | Beginners follow instructions better when the app explains the reason briefly. | Every P0 exercise and session block has a short “why this” explanation. |
| 3 | Poor progression and no tracking reduce motivation. | Record sets, reps, load, completion, streaks, and PRs. |
| 4 | Gym intimidation and uncertainty are major early barriers. | Provide orientation, machine setup cues, and one clear next action. |
| 5 | Western-only language and assumptions reduce local usefulness. | Use Bangla and English, local equipment examples, and low-data defaults. |
| 6 | Bad form and unsafe self-management can cause harm. | Use conservative rules, red-flag screening, stop rules, and expert review. |

The original competitor observations about generic workout loggers, global AI fitness apps, social-video advice, calorie trackers, and local attendance apps remain directional hypotheses. They must be checked through user interviews and a competitor review before marketing claims are published.

---

## 3. Users and launch focus

### 3.1 Primary launch customer

> A Bangladeshi Android user aged 18–35 who has recently joined a gym, has limited training knowledge, uses a low-cost phone, and wants a simple structured workout plan.

This user is the decision-maker for P0 prioritization, language, onboarding length, device performance, and the first success metric.

### 3.2 Secondary and future users

- **Women and privacy-sensitive users:** need clear privacy controls, inclusive examples, and future safe community options. They are served by the core P0 workout loop, but women-only community operations are later.
- **Amateur trainees:** may benefit from adaptive progression and deeper analytics in P1.
- **Home and dumbbell-only users:** supported only to the extent that P0 exercise substitutions and the available equipment profile can safely support them.
- **Gym owners and coaches:** future distribution and B2B users; no automatic access to member health data.
- **Minors:** outside the P0 target. A future release requires age controls and guardian-consent design before serving them.

### 3.3 Jobs to be done

1. “Tell me what to do today with the equipment I actually have.”
2. “Show me how to use the machine and what a good set feels like.”
3. “Let me record my workout even when the gym has no signal.”
4. “Help me understand whether I am improving.”
5. “Let me keep control of my health information.”

---

## 4. Product principles

1. **Show one next action.** Do not overwhelm a beginner with a large dashboard.
2. **Explain the reason.** Every exercise, set, and rep range has a short plain-language rationale.
3. **Free must be useful.** Basic safety, guidance, logging, and progress are not paywalled.
4. **Offline first and low data.** The workout must remain usable in a weak-signal gym and on a 2–3 GB RAM phone.
5. **Bangla first, English available.** Use clear Bangla by default, with English labels and search aliases.
6. **Safety before engagement.** Conservative defaults and a clear boundary around medical advice.
7. **Celebrate small wins.** Make the first week understandable and achievable.
8. **Collect only what is needed.** Sensitive data is optional where possible, never silently shared, and deletable.
9. **Content is versioned.** Exercise and safety content has an owner, reviewer, revision date, and rollback path.
10. **Respect gyms and trainers.** The product supports good coaching and uses neutral audit language.

---

## 5. Release boundary and priority

### 5.1 P0 MVP closed pilot

The first release must include the following complete loop:

1. Guest onboarding and optional account creation.
2. Health and safety screening with red-flag handling.
3. Rule-based beginner plan generator.
4. Equipment-aware exercise substitutions.
5. Gym Mode with sets, reps, weights, rest timer, and notes.
6. Offline workout logging and later synchronization.
7. A 60–100 exercise library with Bangla and English cues.
8. Basic progress tracking, streaks, PRs, and body weight.
9. First-day gym orientation.
10. Basic Plan Auditor with one manual structured audit.
11. Product analytics, feedback, privacy controls, consent management, and crash monitoring.

P0 is free during the closed pilot. No live subscription payment is required to pass the P0 launch gate.

### 5.2 P1 after the core loop is validated

- Curated Bangladeshi food database and basic nutrition targets.
- Basic food logging, hydration reminders, budget meal examples, and evidence-reviewed supplement education.
- Adaptive progression, plateau handling, and reviewed deload suggestions.
- Challenges, basic moderated community, and referral experiments.
- Ramadan training and nutrition mode after safety review.
- Full payment and subscription flow after policy, gateway, tax, refund, and support decisions.
- OCR or photo-assisted Plan Auditor input after manual accuracy is measured.
- Initial gym pilot tools with consent-safe aggregate reporting.
- Expanded exercise and media library toward 200 exercises.

### 5.3 P2 and later

- AI video form checking with explicit limitations and consent.
- Coach add-on and coach marketplace with credential verification and dispute handling.
- Full local meal planner, grocery list, barcode/photo logging, and budget variants.
- Wearables, Health Connect, Mi Band and recovery integrations.
- Gym-owner dashboard, branded plans, QR check-in, and B2B billing.
- Advanced community features, private accountability groups, buddy matching, and leaderboards.
- iOS release and regional expansion to India, Pakistan, Nepal, and Sri Lanka.
- Corporate wellness packages and other later revenue products.

### 5.4 Explicitly out of P0

The following cannot be added to P0 without a written scope decision and updated schedule: the food database, full nutrition planning, AI or automated form analysis, coach chat, public community moderation, wearables, gym-owner portal, live subscriptions, OCR scanning, or a library larger than the reviewed 60–100 exercise set.

---

## 6. P0 user journeys and acceptance criteria

### 6.1 Guest to first plan

1. User chooses Bangla or English and kg or lb.
2. User completes the minimum goal, experience, schedule, session-length, location, equipment, limitations, and safety-screen fields.
3. User can generate and inspect a plan without creating an account.
4. The app explains the plan in simple language and identifies substitutions.
5. User can create an account later. The merge must preserve local plan and workout records without duplicates.

### 6.2 Plan to Gym Mode

1. User opens today’s session.
2. The app shows the next exercise, target sets and reps, load guidance, RIR/effort cue, form cue, and rest timer.
3. User can mark a machine busy and choose an approved equivalent.
4. User can log offline, pause, add a note, and resume after the screen is locked or the app is reopened.
5. User completes the session or records a partial session with a reason.

### 6.3 Progress

1. Completed sessions update history and streaks locally.
2. A PR is calculated only from valid logged data and clearly labelled as an estimate where applicable.
3. Body weight is optional and can be edited or deleted.
4. The weekly summary does not expose health values in a share image unless the user explicitly selects them.

### 6.4 Plan Auditor

1. User enters exercises, sets, reps, and training days in a structured form.
2. The app returns a neutral summary, coverage checks, and 2–3 actionable findings.
3. P0 does not claim to diagnose injury or replace a coach or clinician.
4. A second audit is not available in P0 unless enabled by a later entitlement decision.

### 6.5 Data control

1. The user can view consent choices and disable analytics where permitted.
2. The user can export account data and request account deletion.
3. The user can see whether local records are synced.
4. A gym, coach, or administrator cannot view sensitive member data without explicit consent and a role that permits that field.

### 6.6 P0 acceptance checklist

| ID | Acceptance criterion |
|---|---|
| AC-01 | A guest can reach a usable first plan without account creation. |
| AC-02 | A red-flag answer blocks plan generation and shows an appropriate referral message. |
| AC-03 | The same inputs produce the same plan version on the same rule set. |
| AC-04 | Every P0 exercise has Bangla and English names, cues, alternatives, reviewer, and revision date. |
| AC-05 | A workout set can be saved successfully with airplane mode enabled. |
| AC-06 | Queued records sync idempotently after reconnection and show a visible status. |
| AC-07 | A user can complete a session, see it in history, and recover after an interrupted app session. |
| AC-08 | A user can edit or delete body weight and notes. |
| AC-09 | One manual Plan Auditor run returns a score and findings without medical claims. |
| AC-10 | No P0 analytics event contains raw health answers, body photos, free-text injury details, or exact load values unless separately approved as necessary. |
| AC-11 | Account deletion, export, consent withdrawal, and local-photo deletion paths are testable before beta. |
| AC-12 | The release meets the non-functional targets in Section 16 on the reference device set. |

---

## 7. P0 functional requirements

### 7.1 Onboarding and profile

Required P0 inputs:

- Goal: fat loss, muscle gain, general fitness, or strength foundation.
- Experience: never trained, under six months, or six months to two years.
- Training days: two, three, or four per week.
- Session length: 30, 45, or 60 minutes.
- Location: gym, home, or dumbbell-only.
- Equipment available: movement-relevant equipment checklist.
- Optional body weight and height, with unit conversion.
- Limitations and affected body areas, using a controlled list rather than a diagnosis field.
- Safety-screen responses and referral state.
- Preferred language and unit system.

The user may skip optional body measures. P0 does not target minors. Pregnancy, postpartum status, known cardiac symptoms, recent surgery, or another red-flag condition must route to a professional referral rather than an automatically generated workout.

### 7.2 Rule-based plan generation

The generator uses the rules in Section 8. P0 should be deterministic, explainable, versioned, and capable of running from the bundled rule set when the device is offline. The app records the rule-set version used to create each plan.

The first plan target is under two minutes from valid submission to the plan screen. The measurement is p95 generation time on the supported reference device set with a normal 4G connection; cached/offline generation is measured separately.

### 7.3 Gym Mode

Gym Mode provides:

- Exercise name, Bangla and English cue, target sets and reps, load entry, RIR or effort cue, and rest timer.
- Large tap targets, dark mode, screen-awake option, and audio or vibration timer cues.
- Last-session load display without forcing a load increase.
- “Machine busy?” substitution.
- Warm-up and cool-down guidance limited to reviewed general movement education.
- Notes and partial-completion reasons.
- Offline operation and visible sync status.

Auto-progression, voice-guided sessions, supersets, circuits, and intelligent time compression are P1 or later.

### 7.4 Exercise library

P0 includes 60–100 essential exercises and machine guides. Each entry must have the schema in Section 10. Lightweight cues or animations are on demand; the full media library is not bundled into the base installation.

### 7.5 Progress and motivation

P0 includes history, streaks, qualifying workout count, simple PR records, optional body weight, badges, and a weekly summary. It does not provide medical or body-composition conclusions. Advanced strength curves, fatigue trends, comparison sliders, PDF reports, and data export beyond the account export are later features.

### 7.6 Plan Auditor

P0 accepts structured manual input. It checks weekly volume, movement-pattern balance, stated goal versus rep ranges, missing patterns, excessive volume, and recovery spacing. It provides a score as a coaching aid, not a clinical or absolute quality judgement. Photo/OCR input and “fix my plan” generation are deferred.

### 7.7 Feedback, support, and crash monitoring

P0 includes in-app feedback, an issue category, app version, device class, and optional description. Crash reports must be de-identified and must not include health answers, photos, or free-text injury details. Safety incidents have a separate report path and severity workflow.

---

## 8. Plan engine specification

### 8.1 Input contract

The plan engine accepts a validated object containing goal, experience level, days per week, session length, location, equipment set, preferred language, unit system, limitations, safety-screen state, and the current plan-rule version. Optional body measurements are used only when a reviewed rule needs them.

### 8.2 Plan selection rules

- Two days: full-body template.
- Three days: full-body template with alternating emphasis.
- Four days: beginner upper/lower template only when the user can safely attend four sessions and the session length supports it.
- A plan must fit the requested session length. P0 rejects a plan that exceeds the configured maximum number of exercises or estimated work time.
- A plan must include safe coverage of knee-dominant, hip-dominant, horizontal push, horizontal pull, vertical push or pull where appropriate, and trunk or carry work when equipment and safety rules permit.
- No muscle group may receive unnecessary duplicate movements simply to increase exercise count.
- Exercises with a contraindication matching a declared limitation are excluded or replaced by a reviewed alternative.
- If the equipment profile is incomplete, the generator uses conservative bodyweight or common-equipment alternatives and clearly labels the assumption.

### 8.3 Initial prescription defaults

These are starting defaults for expert review, not universal medical or training prescriptions:

| Item | P0 default |
|---|---|
| Compound rep range | 6–10 or 8–12, selected by the goal template |
| Isolation rep range | 10–15 where appropriate |
| Working sets | Usually 2–3 per exercise; never exceed the reviewed session cap |
| Effort | Usually 2–3 repetitions in reserve; no forced failure for beginners |
| Compound rest | About 2–3 minutes |
| Isolation rest | About 60–120 seconds |
| Initial weekly volume | Usually 6–10 effective sets per major muscle; hard cap 12 until validated |
| Session cap | 18–22 working sets or the configured time limit, whichever is reached first |

### 8.4 Equipment substitution

Each exercise has a movement-pattern key, primary and secondary muscle tags, equipment requirements, difficulty, and approved alternatives. A substitution must preserve the principal movement pattern and an acceptable target-muscle match while respecting limitations. The user can reject a substitution and choose from other reviewed options; the app must not invent an unreviewed exercise.

### 8.5 Progression

P0 records performance and displays the next target without automatically forcing a heavier load. The reviewed P1 progression rule is double progression:

1. Keep the load until the user reaches the top of the target rep range on all prescribed sets with the target RIR for two consecutive sessions.
2. Suggest the smallest available increment, normally about 2.5% for upper-body movements and about 5% for lower-body movements, subject to equipment increments and user confirmation.
3. If the user misses the bottom of the range for two sessions, keep or reduce the load and show a technique or recovery prompt.
4. Never generate a load suggestion when there is no reliable prior load; show a conservative “choose a manageable weight” instruction.

The rules are configurable by exercise category and must be approved before P1 adaptive progression is released.

### 8.6 Deload and fatigue triggers

P0 may show education about recovery but does not diagnose fatigue. P1 deload suggestions require at least one of these reviewed triggers: four to six weeks of continuous training, two consecutive weeks of stalled or declining performance, repeated high-effort logs with reduced completion, or a user-selected recovery concern. A deload reduces planned volume by roughly 30–50% while retaining technique practice; final values require expert review.

### 8.7 Missed sessions and plan regeneration

- A missed session does not shift every future session automatically.
- After a gap of seven or more days, the app offers a lighter re-entry session and lets the user confirm the next date.
- P0 has one active plan. A material change in goal, schedule, equipment, or safety state creates a new version and archives the old one.
- A user may regenerate no more than once in 14 days unless a material safety or equipment change requires it.
- All plan versions retain their source inputs and rule-set version so workout history remains interpretable.

### 8.8 Units and load representation

The internal canonical unit is kilograms. The interface supports kilograms, pounds, plates, and dumbbells, with explicit rounding to available increments. Conversions are reversible within display precision. The app must never imply that a converted value is an exact available plate configuration when it is not.

### 8.9 Expert approval

A qualified strength-training professional must review the P0 templates, volume limits, substitutions, progression language, and Plan Auditor rules before alpha. A clinician or physiotherapist must review safety screening, red-flag copy, pain guidance, and any future mobility content. Reviewer identity, credentials, review date, and approved content version are stored.

---

## 9. Safety and medical boundaries

### 9.1 Boundary statement

GymSathi provides general fitness education and logging. It does not diagnose disease or injury, prescribe rehabilitation, replace a doctor, physiotherapist, or qualified trainer, or guarantee a result. “Injury-rehab-style” is removed from the product language. Any future mobility content is labelled general mobility education and requires qualified review.

### 9.2 Red-flag handling

The app must stop automatic plan generation and recommend professional medical assessment for responses or reports including chest pain, fainting, severe or unexplained shortness of breath, acute neurological symptoms, uncontrolled or concerning cardiovascular symptoms, recent major surgery, an acute traumatic injury, or another condition identified by the clinical reviewer.

The screen must be short, understandable, and revisitable. A referral state is stored without exposing the raw answer in analytics.

### 9.3 Stop-exercise rules

The user is told to stop the exercise and seek appropriate help for chest pain, fainting, severe breathlessness, sudden weakness or numbness, severe or rapidly worsening pain, loss of coordination, or an acute injury. Sharp or worsening pain is not treated as normal training discomfort. The app must not tell the user to “push through” pain.

### 9.4 Pregnancy, postpartum, and age

P0 does not generate pregnancy or postpartum plans. The app directs users to their doctor or qualified prenatal/postpartum professional. Users under 18 are outside the P0 target and must not be silently placed into an adult program. A future minor experience requires age gating, guardian consent, and a separate safety review.

### 9.5 Supplements and health claims

Supplement content is deferred from P0. When introduced, it must be educational, evidence-reviewed, free of diagnosis or dosing claims for individual users, and clear about counterfeit or unsafe products. Sponsored content cannot influence safety recommendations.

### 9.6 Safety incident operations

A safety report records severity, feature, app version, consent state, and contact permission. Critical reports are routed to the product owner and clinical reviewer immediately, investigated within one business day, and can trigger content rollback, a feature kill switch, or a user communication. The incident log contains access controls and an audit trail.

---

## 10. Content, data quality, and CMS

### 10.1 Exercise schema

Every exercise record must contain:

- Stable exercise ID and status.
- Bangla name, English name, and Banglish/search aliases where useful.
- Movement pattern, primary and secondary muscles, equipment, difficulty, and expected session role.
- Setup steps, execution cues, breathing cue, common mistakes, and stop cues.
- Contraindications and limitations that require substitution.
- Approved alternatives and progression/regression links.
- Media type, license or ownership evidence, caption/transcript status, and compression variant.
- Expert reviewer, reviewer credential reference, creation date, revision date, and next review date.
- Content version, locale, and publication state.

### 10.2 Future food schema

The P1 food database must contain source, local Bangla terminology, portion unit, preparation method, calories, protein, carbohydrate, fat, home-versus-restaurant variation, confidence level, revision date, and reviewer. Portion examples include bati, plate, piece, cup, and gram where appropriate. Uncertain values must be labelled as estimates.

### 10.3 CMS workflow

Non-developers must be able to create a draft, attach source or license evidence, request review, approve a version, publish it, and roll back to the previous version. Production content cannot be edited directly without an audit record. A reviewer must be different from the initial author for safety-critical entries where staffing permits.

### 10.4 Content ownership and review cadence

- Product/content owner: exercise and localization completeness.
- Strength professional: programming and form cues.
- Clinician/physiotherapist: red flags, pain, and future mobility content.
- Legal/privacy owner: consent and claims language.
- P0 content is reviewed before alpha, after any safety incident, and at least every six months. A published content revision has a visible effective date.

### 10.5 Media policy

Only licensed, owned, or permissioned media may be used. P0 favours text, diagrams, lightweight animations, or short compressed clips. Sensitive user photos and videos are never placed on a public exercise CDN.

---

## 11. Offline-first and synchronization specification

### 11.1 P0 offline capability

Works fully offline after initial installation or cache preparation:

- Onboarding and guest profile.
- Bundled rule-based plan generation.
- Cached exercise names, cues, and essential setup content.
- Gym Mode, set/repetition/load/note logging, rest timer, and session resume.
- Local history, streak calculations, and basic progress views.
- First-day orientation.
- Manual Plan Auditor using the locally bundled rule set.

Requires connectivity or remains limited until connectivity returns:

- Account creation and sign-in.
- Cross-device backup and account merge.
- Content refresh, remote feature flags, feedback submission, crash upload, and future community or payment functions.

### 11.2 Local storage

The reference implementation uses an encrypted SQLite database through the selected mobile framework’s supported abstraction. The repository interface must allow schema migration and future sync changes without rewriting the Gym Mode UI. Local progress photos, if added, are encrypted and stored locally by default.

### 11.3 Sync queue

Each mutable record has a stable client ID, server ID when available, schema version, creation time, update time, and a sync state. Changes are written locally first and placed in an idempotent queue with an operation ID. Retries use bounded exponential backoff, preserve order within a workout, and stop after a visible retry limit rather than silently discarding data.

### 11.4 Idempotency and duplicates

The server deduplicates by account ID, device ID, client record ID, and operation ID. Replaying an acknowledged operation must not create a second workout, set, audit, or body-weight entry.

### 11.5 Conflict resolution

- Workout set logs are append-oriented; a confirmed log is not silently overwritten.
- Metadata edits use the latest valid version after server validation and retain the previous version in history.
- If the same workout is edited on two devices, the app shows a conflict status and lets the user keep or combine the records where safe.
- Deletion is a tombstone until synchronization and retention rules are satisfied.
- The user sees the number of pending, synced, failed, and conflicted records.

### 11.6 Account merge and device replacement

When a guest creates an account, the server receives the local guest records with a one-time merge token. Matching client IDs are merged once; conflicting records are preserved and shown. A signed-in user can restore data on a new device. Guest-only data cannot be recovered after device loss unless the user exported or converted it.

### 11.7 Media cache

Essential text and low-size visual cues are cached first. Optional media downloads are on demand, have a Wi-Fi-only option, show storage use, and can be cleared. P0 uses a default cache cap of 150 MB, configurable after device testing. No cache policy may remove unsynced workout data.

### 11.8 Sync recovery testing

QA must test airplane mode, intermittent connectivity, app termination during write, clock changes, duplicate retries, two-device edits, account merge, schema upgrade, logout/login, and device replacement before beta.

---

## 12. Privacy, security, and data governance

### 12.1 Data categories

- **Account data:** phone or email identifier, authentication metadata, and account settings.
- **Profile data:** age band, goals, schedule, equipment, language, and units.
- **Sensitive health-related data:** screening answers, limitations, body weight, measurements, progress photos, and any future health integrations.
- **Workout data:** plans, exercises, sets, reps, loads, notes, and completion.
- **Operational data:** crash, performance, support, and consent records.

Health-related and photo data are treated as sensitive even when the user supplies them voluntarily.

### 12.2 Identity and guest conversion

P0 supports a local guest identity and optional account creation. Candidate account methods are phone OTP, email, and an approved social sign-in provider; the final provider list is confirmed during the architecture spike. A sign-in wall is not shown before the first plan. Account creation is required for cross-device restore, data export from the server, or future premium access.

### 12.3 Consent management

Separate, readable choices are required for:

- Terms and core service processing.
- Health-screen and limitation processing.
- Optional progress-photo storage or backup.
- Product analytics.
- Marketing messages.
- Community, coach, or gym data sharing.
- Future wearable or Health Connect integration.

Withdrawing optional consent must not delete unrelated workout records. Analytics opt-out is respected where technically possible, and sensitive values are never sent as analytics properties.

### 12.4 Encryption and access control

- TLS is required for data in transit.
- Backend databases, object storage, backups, and secrets use encryption at rest with managed key controls.
- Local databases and progress photos use platform-backed encryption or an encrypted database/file store.
- Authentication secrets are hashed or delegated to a trusted identity provider; plaintext passwords are never stored.
- Admin, support, content reviewer, coach, and gym roles use least privilege, MFA where available, and explicit field-level permissions.
- Access to sensitive records produces an audit log with actor, role, record type, action, and timestamp.

### 12.5 Photos and videos

Progress photos remain local by default. Cloud backup is an explicit opt-in. Any future video form feature requires recording consent, purpose limitation, retention period, deletion control, encryption, and a clear explanation of whether processing is on-device or server-side. User media is not used for model training without separate explicit consent.

### 12.6 Sharing and gym privacy

Gym owners do not automatically receive member names, health screens, body weight, photos, injuries, or detailed workout logs. A member must opt in to a defined sharing purpose. Default gym reporting is aggregate and de-identified. A future at-risk alert must be explainable, consent-safe, and limited to the minimum signal necessary.

### 12.7 Export, deletion, and retention

- Users can request an export in a documented JSON/CSV format; the target is delivery within seven days.
- Account deletion is available in-app and requires reauthentication where appropriate.
- Primary records are deleted or anonymized within 30 days of a confirmed request, subject to a clearly disclosed legal or fraud-retention exception.
- Encrypted backups expire within the documented backup cycle and no later than 90 days after deletion where technically feasible.
- Local photos and caches have independent delete controls.
- Retention periods are documented for account, workout, audit, consent, support, crash, and security logs.

### 12.8 Compliance and breach response

Before public launch, the product owner must obtain Bangladesh legal/privacy review, complete Google Play health and user-data declarations, review cross-border storage and CDN vendors, and publish a plain-language privacy policy. A suspected breach triggers containment, credential rotation, evidence preservation, risk assessment, and legally appropriate notifications. The response process has an owner, escalation list, and post-incident review.

---

## 13. Entitlements and free/premium model

### 13.1 P0 pilot entitlement

The closed pilot is free and includes the entire P0 workout loop. No feature required for safety, basic logging, or account deletion is paywalled. A server-side entitlement model may be implemented in shadow mode for testing, but it must not block pilot users.

### 13.2 Planned entitlement matrix

| Capability | P0 pilot | P1 candidate | P2 or later |
|---|---:|---:|---:|
| Guest onboarding and first plan | Included | Included | Included |
| One active beginner plan | Included | Included | Included |
| Archived plan versions | Included | Included | Included |
| Adaptive progression and reviewed deloads | No | Premium candidate | Included if validated |
| Exercise swaps | Reviewed substitutions | More swaps | Custom split builder |
| Gym Mode and unlimited core logging | Included | Included | Included |
| Voice, supersets, circuits, time-crunch | No | Premium candidate | Expanded |
| Exercise library | 60–100 essentials | About 200 | 300+ with variations |
| Basic history, streaks, PRs, weight | Included | Included | Included |
| Advanced analytics, reports, comparison tools | No | Premium candidate | Expanded |
| Plan Auditor | One manual audit | More audits and OCR experiment | “Fix my plan” only after review |
| Food targets and limited logging | No | Basic/free plus premium options | Full planner |
| Local food database | No | Curated database | Expanded and personalized |
| Ramadan mode | No | Reviewed basic mode | Full meal/training mode |
| AI form analysis | No | No | Limited, consented, reviewed |
| Community and challenges | No public operations | Moderated pilot | Private groups and advanced features |
| Coach access | No | Research only | Verified add-on/marketplace |
| Wearables | No | Research only | Supported integrations |
| Gym portal | No | Aggregate pilot tools | Full B2B portal |
| Ads | None in P0 | Test only after privacy review | Never on safety or active workout screens |
| Offline mode | P0 workout offline | Expanded content | Full offline package only if tested |

### 13.3 One active plan rule

Premium may eventually allow users to save multiple plan templates, but only one plan can be active for progression and scheduling at a time. This prevents conflicting instructions and keeps progress calculations interpretable.

---

## 14. Payments and entitlement architecture

### 14.1 Release decision

Live paid subscriptions are moved out of P0. The team must not ship a paywall that depends on “Google Play Billing if viable.” Before P1 monetization, the product owner must document the exact Android and web payment routes permitted by current store policy and local law.

### 14.2 Canonical entitlement service

The server is the source of truth for entitlement state. The client never grants premium based only on a local flag. Each entitlement has account ID, product, source, purchase token or gateway reference, start and expiry, grace state, cancellation state, refund/revocation state, and audit timestamps.

### 14.3 Android subscriptions

For Android digital subscriptions, use Google Play Billing where required by policy, verify purchase tokens server-side, acknowledge purchases, handle grace periods, refunds, chargebacks, cancellation, restoration, and account changes, and keep the entitlement state idempotent. The exact product IDs and country availability are defined during P1 payment implementation.

### 14.4 Local gateways and prepaid access

bKash, Nagad, Rocket, SSLCommerz, cards, or carrier billing may be used only where the applicable policy permits the route. Gateway callbacks must be signed or verified, replay-safe, and reconciled. Prepaid month passes, gym codes, student verification, and vouchers are separate products with expiry, activation, refund, and abuse rules.

### 14.5 Support and finance rules

P1 must specify failed-payment grace, cancellation timing, refunds, taxes, gateway fees, student eligibility, gym-sponsored access, customer support ownership, and reconciliation frequency before launch. Coach revenue share is deferred until a verified marketplace and dispute process exists.

### 14.6 Conversion strategy for P1

P1 upgrade prompts should appear only when they explain a feature the user has tried to use or a relevant next step. They must be dismissible, rate-limited, and never interrupt a workout, safety message, or data-control flow.

Candidate moments to test:

1. After the user completes a first training week, explain adaptive progression.
2. When a user requests another Plan Auditor review, explain the additional audit entitlement.
3. When the user reaches the free substitution limit, show the available options without blocking the active workout.
4. After a week of voluntary food logging, offer the full meal planner if nutrition is in scope.
5. Before Ramadan, explain a reviewed seasonal training feature.
6. After a milestone, show a quiet, dismissible feature reminder rather than a time-pressured purchase prompt.
7. Offer a trial only after activation, such as three qualifying workouts, and disclose trial length, renewal price, and cancellation terms before opt-in.

Other hypotheses to validate include student pricing after proportionate verification, gym-sponsored codes, referral rewards, annual pricing, and win-back offers. No prompt may imply guaranteed results, exploit sensitive health data, or obscure the free cancellation route. Test conversion alongside refund rate, complaint rate, and retention; do not optimize purchase rate alone.

---

## 15. Community, coach, and B2B safety

These capabilities are operations-heavy and are not assumed to be simple feature additions.

### 15.1 Community

A future community requires published rules, reporting, blocking, moderation ownership, escalation levels, response targets, evidence retention, and a ban/appeal process. Harassment, sexual exploitation, self-harm encouragement, dangerous training advice, scams, and supplement claims require clear enforcement. A women-only space needs safe access rules and female moderation capacity.

### 15.2 Coaches

A future coach service requires identity and credential verification, role-based access, onboarding and removal, message privacy, response expectations, pricing disclosure, payment disputes, refunds, professional boundaries, and a process for reporting unsafe advice. Coach access does not expose a user’s complete health record by default.

### 15.3 Gym tenants and roles

A future gym portal must isolate tenants and define owner, manager, trainer, support, and member roles. Gym administrators can only see fields covered by member consent and their assigned role. Sensitive member records are never exposed through a broad export. At-risk alerts are aggregate or explicitly opted in, explainable, and auditable.

### 15.4 Minors and vulnerable users

Community, coach, and gym features cannot silently accept minors. Any future support for minors requires age assurance, guardian consent, moderation safeguards, and a child-safety review.

---

## 16. Measurable non-functional requirements

Targets below are P0 acceptance targets for the reference device set. They may be tightened after baseline measurements, but cannot be relaxed without a documented decision.

| Area | P0 target and measurement |
|---|---|
| Minimum Android | Android 8.0/API 26 or higher; final support statement published before beta. |
| Reference devices | At least five representative low-cost Android phones across 2 GB and 3 GB RAM classes, 720p-class screens, and supported CPU architectures. Exact models are recorded before alpha. |
| Cold start | Median ≤3 seconds and p95 ≤5 seconds from tap to usable home screen on the reference set after a warm OS boot. |
| Local response | p95 ≤100 ms for common local navigation, set save, timer controls, and note entry; no blocking disk work on the UI thread. |
| Plan generation | p95 ≤120 seconds from valid submission to first plan on normal 4G; offline bundled generation measured separately and target ≤10 seconds. |
| Crash-free sessions | ≥99.5% in closed beta and ≥99.7% before wider release, measured by the crash-monitoring tool. |
| Offline save | ≥99.9% of valid set-save attempts persisted locally in fault-injection testing. |
| Sync success | ≥99% of eligible queued operations reach an acknowledged state within 24 hours, excluding user-cancelled or invalid records. |
| API latency | p95 ≤800 ms for ordinary authenticated API calls on 4G; p95 ≤2 seconds on the defined low-bandwidth test profile. |
| App size | Base Android install target ≤50 MB excluding optional media. Media is downloaded on demand and shown separately in storage settings. |
| Media/cache | Default optional media cache ≤150 MB; each asset has a size and license record; Wi-Fi-only download is available. |
| Battery | Additional Gym Mode consumption target ≤8% per hour on the reference device with normal timer use, excluding baseline screen drain; measured over three runs. |
| Accessibility | Minimum 48 dp touch targets, readable contrast, TalkBack labels for primary actions, scalable text, no information conveyed by colour alone, and Bangla glyph rendering on all reference devices. |
| Backup/recovery | Signed-in account restore tested after device replacement; service RPO ≤24 hours and RTO ≤4 hours for a declared backend incident. Guest-only recovery is explicitly limited. |
| Availability | P0 API monthly uptime target ≥99.5% during beta, excluding announced maintenance. |
| Security | SAST, dependency scan, secret scan, and basic OWASP mobile/API checks in CI; no unresolved critical or high findings at release; independent penetration review before public launch. |
| Low bandwidth | First plan and core text flow remain usable without media; onboarding payload target ≤3 MB; retries are bounded and user-visible. |
| Data protection | No raw health answers, progress photos, or free-text injury details in analytics, logs, crash reports, URLs, or push payloads. |

The base-size target is reconciled with the 60–100 exercise requirement by keeping reviewed text and lightweight cues available offline while fetching optional video or animation assets on demand.

---

## 17. Technical architecture and data model

### 17.1 Reference stack

The recommended P0 implementation is:

- **Mobile:** Flutter/Dart for Android-first delivery and a future shared iOS codebase.
- **Local storage:** encrypted SQLite through a migration-safe abstraction.
- **Backend:** TypeScript/NestJS or an equivalent typed service with an explicit API contract.
- **Database:** PostgreSQL for accounts, plans, workouts, content metadata, consent, and audit records.
- **Jobs/cache:** Redis or an equivalent queue/cache for sync processing and operational jobs.
- **Media:** private object storage for user media; CDN only for non-sensitive licensed exercise media.
- **Analytics:** a privacy-configured product analytics tool and crash monitoring; neither may receive sensitive health values.
- **Content:** CMS with draft, review, publish, version, and rollback states.

The architecture spike must confirm the final vendors before implementation is locked. Any alternative must meet the same privacy, offline, migration, and observability requirements.

### 17.2 Core entities

- `GuestIdentity`
- `UserAccount`
- `UserProfile`
- `SafetyScreening`
- `ConsentRecord`
- `Plan`
- `PlanVersion`
- `Exercise`
- `ExerciseAlternative`
- `WorkoutSession`
- `SetLog`
- `BodyMetric`
- `PlanAudit`
- `SyncOperation`
- `ContentRevision`
- `Feedback`
- `SafetyIncident`
- `Entitlement` (reserved for P1)
- `GymTenant`, `GymMembership`, and `RoleAssignment` (reserved for later B2B)
- `AccessAuditLog`

Each entity has an owner, retention rule, authorization policy, and migration strategy. IDs are stable and opaque. Health-related fields are separated from product analytics and are never used as unreviewed ad-targeting signals.

### 17.3 API and observability

The API must define versioning, authentication, rate limits, idempotency, error codes, pagination, deletion semantics, and audit events. Logs use correlation IDs but redact sensitive payloads. Feature flags and kill switches must be remotely configurable without requiring a full app release, while the offline app remains safe when a flag cannot be fetched.

---

## 18. Metrics, analytics, and experimentation

### 18.1 North Star metric

**North Star:** the number and percentage of new users who complete **12 or more qualifying workouts within 56 days of first plan generation**.

A qualifying workout is a session marked complete with at least 75% of that session’s prescribed working sets logged, or a documented partial-session rule approved in the event schema. Duplicate client retries count once. The denominator is all users who generated a first plan during the cohort window. Guest and account cohorts are reported separately.

### 18.2 Initial metric definitions

| Metric | Definition |
|---|---|
| Onboarding completion | Users with `onboarding_completed` divided by users with `onboarding_started`, within 48 hours. |
| First-plan generation | Users with one valid `plan_generated` event after onboarding. |
| First-workout completion | New users with a qualifying workout within seven days of first plan. |
| Plan adherence | Qualifying completed sessions divided by scheduled sessions in the active plan, measured weekly. |
| Exercise swap usage | Sessions with at least one approved substitution divided by qualifying sessions. |
| Offline save success | Successful local writes divided by valid save attempts. |
| Sync failure rate | Operations ending in a terminal failure divided by operations queued. |
| Crash-free sessions | Sessions without a crash divided by all instrumented sessions. |
| Payment success | Verified successful transactions divided by initiated transactions; P1 only. |
| Refund rate | Refunded or charged-back transactions divided by successful transactions; P1 only. |
| Safety complaints | Safety incidents per 1,000 active users, segmented by severity. |
| Content correction rate | Published records corrected within 30 days divided by records published in the same period. |
| Support response time | Median and p95 time from support submission to first human response. |

### 18.3 Event plan

P0 event names and safe properties:

- `app_opened`: app version, OS version, device class, locale, connectivity class.
- `onboarding_started`, `onboarding_completed`: flow version, guest/account state, duration bucket.
- `safety_screen_completed`, `safety_referral_shown`: result category without raw answer.
- `plan_generation_started`, `plan_generated`, `plan_viewed`: rule version, generation duration bucket, goal category, equipment-count bucket.
- `workout_started`, `set_saved`, `workout_paused`, `workout_completed`: plan version, exercise ID, set index, offline state, duration bucket; no free-text note or sensitive health field.
- `exercise_swap_opened`, `exercise_swapped`: movement-pattern key and substitution ID.
- `sync_queued`, `sync_succeeded`, `sync_failed`, `sync_conflict`: entity type, operation type, retry count bucket, error class.
- `body_metric_added`, `body_metric_deleted`: metric type only; never the value.
- `plan_audit_started`, `plan_audit_completed`: input-size bucket and rule version.
- `feedback_submitted`, `safety_incident_submitted`: category and severity, not description text.
- `account_created`, `guest_merge_completed`, `export_requested`, `deletion_requested`, `consent_changed`: action and outcome.
- `app_crash`: handled by the crash tool with redaction rules.

### 18.4 Cohorts and ownership

Reports segment by first-plan week, acquisition source, guest/account state, language, device RAM class, connection class, and P0 template. Health answers, exact body values, photos, and free-text injury notes are excluded. The product owner owns weekly operating review; engineering owns reliability; content/safety owners review incidents and correction rate; finance owns P1 payment metrics.

### 18.5 Reporting and experiment rules

- Instrumentation is checked in an internal alpha and reviewed weekly during beta.
- Early pilots are primarily descriptive; no conclusion is made from a small convenience sample.
- A product A/B decision requires at least 100 completed users per arm unless a power calculation justifies another number. Safety, consent, and payment experiments require product and safety review before randomization.
- The initial metric dashboard reports daily reliability, weekly activation/adherence, and a cohort view at Day 7, Day 30, and Day 56.

### 18.6 Initial targets

| Category | Initial target after pilot baseline |
|---|---|
| Onboarding and first workout within 48 hours | >40% |
| Day-7 / Day-30 / Day-90 retention | 35% / 20% / 10% directional targets |
| Workouts per active user per week | ≥2.5 |
| Users reaching 12 workouts in first eight weeks | >30% |
| Crash-free sessions | ≥99.5% in beta |
| App rating | ≥4.5 only after sufficient review volume; do not incentivize misleading ratings |
| NPS | Track after users have completed at least three workouts; target >40 is aspirational |

Conversion, trial, churn, and payment targets are P1 hypotheses and are not P0 launch gates.

---

## 19. Validation experiments before scale

| Question | Experiment | Decision gate |
|---|---|---|
| Will beginners complete the loop? | Observe 30–50 beginner interviews and a clickable prototype, then run a 2–3 gym pilot. | Continue only if users can reach and complete a session without coaching intervention. |
| Will the primary user understand Bangla/English cues? | Five-second comprehension and gym-floor usability tests in both languages. | Rewrite any cue misunderstood by more than 20% of test users. |
| Are equipment substitutions useful? | Inventory equipment at pilot gyms and test substitution tasks with a coach. | P0 library must cover the common patterns found in pilot gyms. |
| Does offline sync preserve trust? | Fault-injection tests plus 20-device beta monitoring. | No unresolved data-loss defect; sync target in Section 16. |
| Are red-flag messages understood? | Safety comprehension test with clinician-reviewed copy. | Users must understand when to stop and seek help. |
| Will users pay later? | Price-card or landing-page test after the free loop is trusted. | Choose a price hypothesis only after payment/legal review. |
| Is local payment viable? | Verify Play policy, gateway contracts, refunds, settlement, and webhook reliability. | Do not activate P1 payment until all are documented. |
| Does a manual Plan Auditor create value without trainer hostility? | Compare neutral findings with coach review and interview pilot gyms. | Keep only findings with acceptable agreement and tone. |
| Can media meet size and battery limits? | Benchmark text, animation, and short-video variants on reference phones. | Ship only assets meeting size, license, and performance limits. |

---

## 20. Roadmap, team, and launch gates

### 20.1 Lean team assumption

The 3–4 month P0 schedule assumes:

- One product owner/founder who owns scope and decisions.
- One Flutter/mobile engineer.
- One backend engineer.
- Shared product designer/QA support.
- Part-time strength-training professional for plan/content review.
- Part-time clinician or physiotherapist for safety review.
- Content/localization support for 60–100 exercise records.

No numeric budget has been approved in this PRD. Before work starts, the owner must record budget and availability for engineering, design/QA, expert review, content/media licensing, device testing, hosting, support, and pilot incentives. A schedule is not committed until those dependencies have named owners.

### 20.2 P0 schedule

| Stage | Timing | Deliverables and gate |
|---|---|---|
| Discovery and architecture | Weeks 0–2 | Interviews, device matrix, data classification, safety protocol, architecture spike, content schema. Gate: primary user and P0 scope signed off. |
| Core build | Weeks 3–6 | Guest onboarding, local rule engine, plan screen, exercise schema, first Gym Mode slice. Gate: happy-path prototype on reference devices. |
| Offline and progress | Weeks 5–8 | Encrypted local DB, set logging, rest timer, queue/sync, history, streaks, PRs, body weight. Gate: airplane-mode test passes. |
| Content and safety | Weeks 6–10 | 60–100 exercise records, localization, substitutions, orientation, red flags, expert review. Gate: no unreviewed safety-critical content. |
| Auditor, privacy, analytics | Weeks 8–11 | Manual audit, consent controls, export/delete paths, event plan, crash monitoring, feedback. Gate: privacy/security QA passes. |
| Internal alpha | Weeks 10–12 | Team and invited tester use; defect burn-down; performance and recovery test. Gate: no open P0 blocker. |
| Closed beta | Weeks 13–14 | Controlled users on 2–3 friendly gyms; weekly support and safety review. Gate: metrics and incident thresholds met. |
| Pilot decision | Weeks 15–16 | Decide whether to fix, extend beta, or prepare wider launch. Gate: launch checklist and rollback plan approved. |

### 20.3 Gym stages

- **Closed pilot:** 2–3 friendly gyms, focused on usability, safety, data integrity, and the North Star behaviour.
- **Wider Dhaka launch:** 10–20 gyms only after the closed-pilot gates pass, support capacity is staffed, and the app meets reliability targets.
- **B2B pilot:** a separate P1/P2 project; it is not implied by giving a gym a free code during P0.

### 20.4 Launch criteria

A wider release requires:

- All P0 acceptance criteria passed on the reference device set.
- Expert approval of plan templates, substitutions, safety copy, and Plan Auditor rules.
- No open critical safety, data-loss, authentication, privacy, or security defect.
- Crash-free, save, sync, latency, and app-size targets met for the agreed beta window.
- Account merge, export, deletion, consent withdrawal, and local-photo deletion tested.
- Support owner, incident escalation, privacy policy, Play declarations, and rollback plan ready.
- Pilot users can complete the first workout without staff performing the task for them.

### 20.5 Rollback criteria

Pause onboarding or roll back a content/rule version for a confirmed serious safety issue, repeated data loss or duplicate workouts, a security/privacy exposure, a crash-free rate below the agreed threshold for two consecutive reporting windows, or a sync failure that prevents users from trusting their records. A kill switch must fail safe and preserve local unsynced data.

### 20.6 Post-launch support

For the first eight weeks after any wider release: daily reliability review, weekly product/safety/content review, documented support ownership, a response target of one business day for safety reports, and a monthly content correction review. A versioned release note records known limitations and fixes.

---

## 21. Go-to-market

1. **Research:** interview 30–50 beginners and 5–10 gym owners, but optimize the product for the primary launch customer.
2. **Closed pilot:** work with 2–3 cooperative gyms, provide free access, collect consented feedback, and measure the North Star behaviour.
3. **Dhaka expansion:** after launch gates, approach 10–20 gyms in Dhanmondi, Mirpur, Uttara, and comparable areas based on actual pilot evidence.
4. **Student channels:** university clubs, Facebook groups, and campus ambassadors, subject to privacy-safe referral rules.
5. **Bangla content:** short educational videos and posts about first-day confidence, safe progression, equipment use, and local constraints. Avoid unsupported medical or trainer-bashing claims.
6. **Plan Auditor acquisition:** present it as a respectful second opinion and a learning tool.
7. **Partnerships:** gyms, vetted sports or supplement businesses, and university sports departments only after conflict-of-interest review.
8. **Community:** external feedback channels may be used during P0; an in-app community is a P1/P2 operational product with moderation capacity.

---

## 22. Revenue model

### 22.1 Hypothesized pricing for later validation

| Product | Initial hypothesis (BDT) |
|---|---:|
| Monthly | 149–199 |
| Quarterly | 399–499 |
| Yearly | 999–1,499 |
| Student | Approximately 40% discount, subject to verification |
| Future coach add-on | 500–1,500/month, only after verified coach operations |

These are hypotheses, not approved prices.

### 22.2 Revenue streams by phase

- **P1 candidate:** premium subscriptions, prepaid passes, gym-sponsored access, and carefully tested local payment routes.
- **P2 candidate:** verified coach marketplace commission, gym B2B SaaS, vetted sponsored challenges, and affiliate sales.
- **Later:** corporate wellness packages and regional products.

No sponsorship or advertising may change safety recommendations. P0 has no ads. Any P1 ad experiment requires privacy, consent, placement, and brand-safety review.

---

## 23. Risks and mitigations

| Risk | Trigger | Mitigation | Owner |
|---|---|---|---|
| Scope overload | New feature requested during P0 | Apply the P0 boundary and require a written change decision. | Product owner |
| Unsafe plan or cue | Expert disagreement or incident | Block publication, review rule/content version, and use kill switch. | Strength and clinical reviewers |
| Medical overreach | User interprets content as diagnosis/rehab | Clear boundary, referral rules, removal of rehab wording, complaint workflow. | Clinical reviewer |
| Data loss or duplicate logs | Sync fault or merge conflict | Idempotency, local-first writes, conflict UI, recovery tests, backups. | Engineering |
| Privacy exposure | Sensitive data in analytics, exports, or gym view | Field-level permissions, redaction tests, consent gates, access audit. | Security/privacy owner |
| Low-end performance | Slow start, crashes, battery drain | Reference-device CI, media budgets, profiling, and staged release. | Mobile engineer |
| Media cost or licensing issue | Asset exceeds size or lacks rights | Text/lightweight cues, on-demand media, license register, rollback. | Content owner |
| Low adoption | Poor first-plan or first-workout completion | Usability testing, shorter onboarding, orientation, and pilot iteration. | Product/design |
| Trainer/gym pushback | Hostile audit feedback or partner refusal | Neutral copy, coach review, trainer-augmenting positioning, consent-safe B2B. | Partnerships |
| Payment failure | Gateway/webhook/refund mismatch | Defer P0 payments; server verification and reconciliation in P1. | Finance/engineering |
| Community harm | Reports, harassment, dangerous advice | Defer operations until moderation, rules, and escalation are staffed. | Community owner |
| Regulatory or store issue | Play or legal review rejects a flow | Complete declarations and legal review before public release. | Product/legal |
| Churn after first weeks | Day-7/Day-30 decline | Track early wins, missed-session recovery, and content comprehension. | Product |
| Unverified AI output | Model gives unsafe or incorrect advice | Rule-based P0, human-reviewed content, bounded future AI experiments. | Engineering/clinical |

---

## 24. Contradiction and ambiguity resolution register

| Original ambiguity | v1.1 decision |
|---|---|
| No sign-up wall versus account-based sync and premium access | Guest gets the first plan and local workout loop; account is required for cloud restore, export, and future premium. |
| Core offline versus full offline | P0 offline is explicitly the workout loop, cached cues, history, orientation, and manual audit. “Full offline” is not a P0 promise. |
| 100 versus 200–300 versus 300+ exercises | P0 is 60–100 reviewed essentials; P1 targets about 200; 300+ is later. |
| One active plan versus multiple premium plans | One active plan always; older plans are archived. Multiple saved templates may come later. |
| Basic food logging versus full local database | Food is out of P0; curated basic logging/database is P1; full meal planning is later. |
| “Rehab-style” routines versus medical boundaries | Remove the phrase and avoid rehabilitation claims; future mobility education requires qualified review. |
| Google Play Billing versus local gateways | No P0 live payment. P1 uses a documented canonical entitlement service, Play Billing where required, and verified local routes where permitted. |
| Minimal ads versus no ads | No ads in P0. Later tests cannot place ads on safety or active workout screens. |
| Manual or scanned Plan Auditor input | Manual structured input in P0; OCR/photo input is a measured P1 experiment. |
| Coach add-on versus coach marketplace | Both are deferred. A verified coach add-on precedes any open marketplace. |
| Gym owner access to risk data | No automatic sensitive-data access; aggregate or explicitly consented, role-limited reporting only. |
| Bangla, English, and Banglish behavior | Bangla is the default; English is selectable; Banglish is supported as search aliases and input tolerance, not as uncontrolled UI copy. |
| Two-minute plan generation | p95 from valid submission to plan display on reference devices and normal 4G; offline has a separate target. |
| Adaptive progression and deload rules | P0 records performance; P1 progression and deload rules follow Section 8 and require expert approval. |
| Premium payments in the first pilot | P0 is free. Payment launch is a separate P1 gate with policy, gateway, refund, tax, and support decisions. |
| Local food and nutrition claims | No P0 food claims; P1 entries need source, portion, confidence, reviewer, and revision date. |
| Community feature versus operational readiness | External feedback is allowed in P0; in-app community waits for moderation, reporting, blocking, and escalation operations. |

---

## 25. Open decisions and owners

The following items remain validation decisions rather than hidden assumptions:

1. Final mobile/backend vendor selection after the architecture spike — product and engineering.
2. Exact reference device models and supported Android statement — engineering and QA.
3. Strength professional and clinical reviewer contracts — product owner.
4. P1 price, payment route, taxes, refunds, and gateway settlement — product and finance.
5. Bangla tone and dialect validation — content owner and pilot users.
6. Women’s privacy and future safe-community design — product, moderation, and user research.
7. Pilot gym equipment inventory and partner terms — partnerships.
8. Data hosting region, CDN vendors, retention schedule, and Bangladesh legal review — privacy/legal owner.
9. P1 food-data sources and nutrition reviewer — content and clinical reviewers.
10. Whether a Plan Auditor score improves behaviour without creating trainer conflict — product research.

Each decision must have an owner, due date, evidence required, and a recorded outcome before the affected release gate.

---

## 26. Immediate next steps

1. Freeze the P0 scope and write the architecture decision record.
2. Recruit the strength-training professional and clinician/physiotherapist reviewers.
3. Interview 30–50 beginners and 5–10 gym owners; convert findings into measurable acceptance criteria.
4. Build the clickable flow for onboarding, plan, Gym Mode, offline status, progress, orientation, and manual Plan Auditor.
5. Create the exercise CMS schema and seed 60–100 records with reviewer and license fields.
6. Establish the reference-device matrix and performance test harness.
7. Implement the local data model, encrypted storage, sync queue, account merge, export, deletion, and consent states before adding optional media.
8. Define analytics events and a dashboard without sensitive properties.
9. Run safety-copy comprehension and offline fault-injection tests before alpha.
10. Conduct internal alpha, then a controlled 2–3 gym beta.
11. Review the launch gates, rollback criteria, support plan, and budget before any 10–20 gym expansion.
12. Only after P0 evidence is positive, create a separate P1 plan for food, adaptive progression, community, payments, and gym pilot tools.

---

## Appendix A: original long-term feature register

The original product direction is retained in the roadmap even when it is not a P0 commitment:

- Bangladeshi food database, local portions, budget protein ideas, calorie and protein targets, limited food logging, hydration reminders, Ramadan meal timing and training windows, recipes, grocery list, vegetarian/cutting/bulking variants, barcode/photo logging where feasible, and myth-busting supplement education.
- Adaptive progression, periodization, custom split builder, plateau breaker, specialization blocks, deload suggestions, advanced analytics, estimated 1RM, fatigue/recovery trends, progress reports, and year-in-review.
- Form tips, limited future AI checks for selected big lifts, pain education, DOMS education, and reviewed mobility education. Future form analysis starts with a limited set of big lifts and clearly states its limitations.
- Community feed, public challenges, moderated Q&A, mentor matching, women-only spaces, private accountability, workout buddies, friend leaderboards, and reporting/blocking/moderation operations.
- XP, levels, streak freezes, weekly goals, badges, content unlocks, smart reminders with snooze/reschedule controls, and vetted partner rewards.
- Exercise media variations, multi-angle demonstrations, reviewed progressions/regressions, and injury-aware substitutions that do not claim to rehabilitate an injury.
- Certified coaches, chat check-ins, plan review, coach add-on, and later marketplace operations.
- Wearables, Health Connect, Mi Band, heart-rate and recovery signals.
- Gym-sponsored codes, gym engagement, aggregate at-risk alerts, branded plans, QR check-in, trainer plan-building tools, and trainer-augmenting workflows.
- Premium subscriptions, prepaid passes, student pricing, referrals, free trials after activation, annual discounts, win-back offers, gym partnerships, sponsored challenges, affiliate sales, corporate wellness, and regional expansion.
- Women-focused and general-health templates, home/no-equipment and dumbbell-only plans, and a future option to save multiple plans while keeping only one active plan.

Every item in this register requires its own safety, privacy, operational, payment, and measurement review before implementation.

---

## Appendix B: P0 definition of done

The P0 release is done only when a new primary user can:

1. Open the app as a guest.
2. Complete the safety-aware onboarding.
3. Generate and understand a reviewed plan.
4. Find an alternative when a machine is unavailable.
5. Complete and log a workout in airplane mode.
6. Reopen the app without losing the session.
7. Synchronize after reconnection without duplicates.
8. See history, streak, PR, and optional weight progress.
9. Complete one manual Plan Auditor review.
10. Find orientation and stop-exercise guidance.
11. View and change consent, export data, delete account, and delete local photos.
12. Use Bangla or English on a supported low-cost device within the performance targets.
