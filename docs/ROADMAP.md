# Product roadmap

## Prototype now

- Live classroom with one dominant recommendation.
- Deterministic local attention engine.
- Three realistic groups, physical activities, catch-up flow, checkpoints, dynamic plan, simulator.
- Local persistence, PWA shell, offline status.
- English, Marathi, Hindi, and Odia UI labels.

## Next validation

- Observe 5–10 teachers using paper cards and a low-cost Android device.
- Test whether the short state vocabulary is understood without training.
- Compare teacher-reported interruptions and group idle time against a simple rotation plan.
- Validate activity names, materials, and translations with state-level educators.

## Production direction

- IndexedDB/SQLite event log with sync queue and school-level backup.
- Optional voice note capture with on-device speech recognition where available.
- Claude/cloud adapter for pre-lesson synthesis and conflict explanation, guarded by the local policy engine.
- More RIVER-aligned ladders authored with local resource groups; do not infer mastery from time or activity completion.
- Role-based school admin views only after the teacher workflow is proven.
