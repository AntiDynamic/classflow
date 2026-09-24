# ClassFlow research notes

Last reviewed: 24 September 2026

## Product brief

ClassFlow is scoped to the AI for Foundational Learning Hackathon problem around classroom complexity / multi-grade execution. The product is not a student app, a generic planner, or a surveillance layer. It gives one teacher a short, explainable next action while children continue physical, age-appropriate work away from the phone.

The hackathon brief calls out multi-grade classrooms, low-income communities, real Indian classroom constraints, and the need to solve one meaningful part of a complex challenge. ClassFlow therefore focuses on teacher-attention allocation as the narrow wedge: deciding who needs the teacher next while preserving learning time for the other groups.

## Hackathon context

The official event page is the source of truth for deadlines, eligibility, stages, mentors, and submission requirements:

- [AI for Foundational Learning Hackathon — Hack2Skill](https://hack2skill.com/event/aiforfoundationallearning/)
- [Anthropic for Education](https://www.anthropic.com/education)

The event is presented in collaboration with Anthropic and is structured around Ideate, Build, and Finals stages. The brief emphasizes working prototypes, foundational literacy/numeracy, frontier AI used responsibly, and real classroom constraints. The product language in this repo deliberately avoids implying that Anthropic, Claude, or any cloud model is required at runtime.

## RIVER / MGML grounding

RIVER is the Rishi Valley Institute for Educational Resources, the resource-development and teacher-training wing of Rishi Valley Rural Education Centre. Its MGML approach uses graded activity sequences mapped to a Learning Ladder. The RIVER description highlights:

- children progressing at their own pace;
- teacher instruction plus peer and self-learning;
- physical activity cards and learning materials;
- cooperation and flexible grouping;
- an approach that can accommodate children returning after absence.

Primary source: [RIVER — Institute for Educational Resources](https://www.rishivalley.org/river-institute-for-educational-resources)

Related source: [Rural Education Centre](https://www.rishivalley.org/rural-education-centre)

ClassFlow uses this as a foundation, not as a claim of ownership or replacement. The app maps a group to a simple current phase such as introduction, practice, checkpoint, recovery, or enrichment. The app's original contribution is the dynamic execution layer: estimating immediate teacher demand and choosing the next intervention as classroom state changes.

## Design implications

1. The teacher should only make fast, observational updates: on track, slowing, stuck, finished, or needs teacher.
2. Every recommendation must include a physical path: activity, materials, mode, and a short duration.
3. “Stuck” is not automatically “interrupt the teacher.” Recovery options, peer support, self-checks, time waiting, and prerequisite confidence affect demand.
4. Completion is not mastery. A checkpoint can move a group to secure, needs practice, or needs teacher.
5. Offline use is normal. Local state, the current plan, the activity library, and the deterministic engine remain available without a network.
6. The interface uses English, Marathi, Hindi, and Odia for high-frequency teacher actions. Lesson content remains editable and can be localized with local educators.
7. No camera, microphone, face recognition, student login, or continuous monitoring is required.

## Working hypothesis

In a 55–60 minute lesson with Grades 1–3, preserving even a few teacher minutes by making the next intervention obvious may be more valuable than adding more content or analytics. The prototype is built to make that hypothesis demonstrable in a live hackathon walkthrough.
