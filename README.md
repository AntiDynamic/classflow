# LearnLab Kids

LearnLab Kids is a playful, visual learning platform for children around ages 8–10. It turns maths and science ideas into small interactive playgrounds that follow a simple rhythm: **See → Play → Understand → Try**.

## What is included

- A responsive home page with adventure discovery and local progress
- Maths trail: Area & Perimeter, Fractions, Shape Explorer, and Multiplication Groups
- Science trail: Solar System, Water Cycle, States of Matter, and Light & Shadows
- Reusable lesson shell with helper mascot, sound toggle, visual controls, and challenge cards
- Three-question quiz after every lesson with encouraging feedback and star rewards
- Local progress tracking via `localStorage` (no login or backend needed)
- Keyboard-friendly controls, strong contrast, and reduced-motion support

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The generated `dist` folder is ready for Netlify or Vercel. Both platforms can use `npm run build` as the build command and `dist` as the publish/output directory. Since routing is client-side, configure the host to fall back to `index.html` for deep links.

## Technologies

React, Vite, TypeScript, React Router, Framer Motion, Lucide icons, and modern CSS. The simulations use lightweight DOM/CSS animation so they stay usable on mobile without adding a 3D dependency where it would not improve the lesson.
