# ClassFlow demo script

## Setup

Open the app in a phone-sized browser. The seeded lesson is:

- Anita Patil
- Mathematics · 55 minutes
- Grade 1: addition introduction, teacher-led
- Grade 2: place-value revision, independent / peer-ready
- Grade 3: absentee catch-up, peer practice with Aarav

## Walkthrough

1. Start on Live Classroom. The dominant card says **Next attention: Grade 1** with “New concept · high dependency.”
2. Tap **Start Grade 1**. The app records the active teacher group and shifts the other groups into their physical activities.
3. Open the simulator and tap **Grade 2 is stuck**. The plan updates. The app does not pretend to teleport the teacher; it shows that Grade 2 is the next handoff after the current explanation, because Grade 1 is still active.
4. Tap **Finish Grade 1 explanation**, then **Go to Grade 2**. The next attention card moves to Grade 2.
5. Tap **Grade 3 finished**. Grade 3 moves to an extension activity rather than taking teacher attention.
6. Open Grade 2 and run a checkpoint. Select **Needs teacher**. The engine elevates Grade 2 because its recovery path has been exhausted.
7. Switch language from More. Demonstrate English, Marathi, Hindi, and Odia labels on the high-frequency actions.
8. Toggle the browser offline or use the simulator's offline indicator. State changes continue and are stored locally.

The story is: initial plan → real classroom event → attention is recalculated → teacher time is preserved.
