# ClassFlow

ClassFlow is an offline-first mobile prototype for one teacher managing three simultaneous learning groups in a RIVER/MGML-inspired classroom.

> RIVER gives the classroom a structure for multigrade learning. ClassFlow adds an AI execution layer that helps the teacher decide where scarce attention is most useful next.

## Run locally

```bash
npm install
npm run dev
```

Build and validate:

```bash
npm run build
```

## Product boundary

The teacher uses one phone. Children continue with notebooks, textbooks, reusable cards, counters, sticks, number cards, and peer practice. The phone is for brief observation updates, not continuous monitoring. The app works without a network and always allows teacher override.

## Demo

Use the Classroom Simulator inside Live Classroom to trigger the story: Grade 2 stuck → Grade 1 finishes → Grade 3 catch-up finishes → Grade 1 checkpoint is weak. See [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md).

## Research and architecture

- [Research notes](docs/RESEARCH.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Demo script](docs/DEMO_SCRIPT.md)
- [Roadmap](docs/ROADMAP.md)

## GitHub

The local repository is initialized for regular milestone commits. A remote can be attached with:

```bash
git remote add origin <your-repository-url>
git push -u origin main
```
