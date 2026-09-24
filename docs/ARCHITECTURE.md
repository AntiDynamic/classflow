# ClassFlow architecture

## Runtime shape

```text
React UI
  ├─ Classroom state provider (localStorage-backed)
  ├─ Local decision engine (deterministic, explainable)
  ├─ AIReasoningService abstraction
  │    ├─ LocalAIService (default, offline)
  │    └─ CloudAIService (optional adapter)
  └─ PWA service worker (cached shell)
```

The app is intentionally a small Vite PWA. It can later move to Expo/React Native without changing the domain model or decision engine.

## Data ownership

- `models/`: domain contracts shared by UI, storage, and services.
- `data/`: seeded Maharashtra-style demo classroom and physical activity library.
- `engine/`: scoring, eligibility checks, recovery logic, and concise explanation generation.
- `services/`: AI reasoning adapter boundary and connectivity helpers.
- `state/`: app state and actions; changes are persisted after every meaningful teacher action.
- `screens/`: teacher-facing workflows.
- `components/`: reusable mobile UI primitives.

## Hybrid AI boundary

The local service is the safe default. It interprets structured quick updates and recalculates attention using explicit rules. A cloud adapter can later enrich difficult conflict resolution, pre-lesson planning, or note interpretation when consent and connectivity are available. Cloud reasoning never gets permission to bypass prerequisite or material-safety checks.

## Decision engine

The engine scores each group on urgency, teacher dependency, prerequisite confidence, recent failures, waiting time, consequence of delay, peer support, recoverability, and available time. Scores are used internally; teachers see only one next action and a short reason. The active teacher group is respected: a new issue can become the next handoff without interrupting an explanation already in progress.

## Offline behavior

`localStorage` is enough for this prototype's compact classroom state and keeps the demo easy to inspect. A production version should replace the persistence adapter with IndexedDB/SQLite, add an append-only sync queue, and use conflict-safe event IDs. The UI already exposes a non-blocking offline status and persists plan changes locally.
