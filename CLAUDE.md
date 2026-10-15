# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow

- Work autonomously to fulfill requested features.
- Create, modify, and delete files as necessary.
- **DO NOT** ask for permission for file edits or running bash commands.
- **ONLY** ask for input when you are ready to `git add` / `git commit`, or if a build/lint fails persistently.

### Commit Behavior

- After implementing a cohesive piece of logic, pause.
- Propose a `git commit` message and list the files to be staged.
- Wait for user approval before executing `git add` and `git commit`.

### Verification

- Tests run with `npm test` (Node 20 built-in test runner, no extra dependencies): regression tests for SEO landing-page deep links (`tests/landing-params.test.mjs`) and the build-time prerender (`tests/build-landing.test.mjs`). The `@testing-library/*` devDependencies are present but not wired to a runner.
- Before committing, verify with `npm run build` (Vite type/parse errors will surface there) and manually exercise the affected feature in `npm run dev`.
- If you get stuck, present the code for review.

## Project Overview

Eletypes is a typing-test web app built with **React 18 + Vite**. It has grown beyond typing tests into four pillars: typing test, vocab cards, **Keyboard Lab** (3D keyboard designer), and a **Markdown editor**. A no-signup leaderboard is backed by Supabase; everything else lives in `localStorage`.

Source files use `.jsx` extension (not `.js`) for React components.

## Commands

- **Dev server:** `npm run dev` or `npm start` — Vite on `localhost:3000`, auto-opens browser
- **Build:** `npm run build` — outputs to `build/` (note: not the Vite default `dist/`)
- **Preview:** `npm run preview` — serve production build locally
- **Deploy:** `npm run deploy` — runs build (no separate Firebase step despite the name; Firebase deploy is invoked manually or via CI)

### Environment Variables

Vite is configured with `envPrefix: "SUPABASE_"` in `vite.config.js`, **not the default `VITE_`**. So `.env` keys must be named `SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc., and read via `import.meta.env.SUPABASE_*`. If Supabase env is missing, `src/services/supabase.js` exports `null` and leaderboard features degrade gracefully — keep that contract intact when touching the service layer.

## Architecture

### Routing & Entry Points

- `src/index.jsx` is the entry point — wraps everything in `BrowserRouter` and registers three routes:
  - `/keyboardlab` → `src/pages/KeyboardLabPage.jsx` (3D keyboard designer, beta)
  - `/markdown` → `src/pages/MarkdownPage.jsx` (Monaco-based markdown editor)
  - `/*` → `src/App.jsx` (the typing test + all other modes)
- `App.jsx` is a single large component (~hundreds of lines) that conditionally renders the active typing-related mode based on local-persist state flags (`gameMode`, `IsInWordsCardMode`, `trainerMode`, `coffeeMode`, `musicMode`, `focusedMode`, `ultraZenMode`).
- Heavy mode components (`DefaultKeyboard`, `WordsCard`) are loaded with `React.lazy` + `Suspense`.

### State Management

No Redux, no app-level Context for state (Context is used only for locale/i18n).
- `useLocalPersistState` (`src/hooks/useLocalPersistState.js`) — `useState` + `useEffect` that syncs to `localStorage`. This is the canonical pattern for any user preference (theme, sound, mode toggles, etc.). Always use this hook rather than reading/writing `localStorage` directly when adding a new persisted preference.
- A few legacy flags in `App.jsx` still read `localStorage` directly (`focused-mode`, `ultra-zen-mode`) — match the surrounding pattern when modifying those.

### Game Modes (under `src/components/features/`)

- **TypeBox/TypeBox.jsx** — core word-typing mode (~1200 lines). Owns the countdown timer, WPM math, error tracking, pacing styles (pulse/caret via `SmoothCaret.jsx`), and history. The biggest, most fragile file in the codebase — read carefully before changing.
- **SentenceBox/** — sentence-typing mode, separate stats pipeline.
- **FreeTypingBox.jsx** — coffee / free-type mode.
- **Keyboard/DefaultKeyboard.jsx** — QWERTY touch-typing trainer.
- **WordsCard/WordsCard.jsx** — vocabulary flashcard mode (GRE / TOEFL / CET decks).
- **KeyboardLab/** — see dedicated section below.
- **Leaderboard/**, **Stats/**, **Badges/**, **Share/**, **MusicPlayer/**, **sound/** — supporting features.

### Web Workers

Offloaded heavy work lives in `src/worker/`:
- `calculateWpmWorker.js` / `calculateRawWpmWorker.js` — WPM formulas
- `trackCharsErrorsWorker.js` / `trackHistoryWorker.js` — error and history tracking

Instantiated in `TypeBox` via `new Worker(new URL("../../../worker/...", import.meta.url))`. Keep that URL form — it's what Vite's worker bundling relies on.

### Services Layer (`src/services/`)

Thin wrappers around Supabase + browser APIs:
- `supabase.js` — client factory, exports `null` if env vars missing
- `leaderboard.js` — read/submit WPM scores
- `badges.js` — achievement evaluation
- `scoreHistory.js` — local session history
- `fingerprint.js` — FingerprintJS for anti-cheat / dedup on leaderboard submission (the only thing besides display name that leaves the device)
- `userIdentity.js` — local display name management
- `challengeLink.js` — parses `?challenge=` URL params into a deterministic seeded test (parsed once at module level in `App.jsx`, before any hook runs, then `localStorage` is force-populated so `useLocalPersistState` picks up the overrides on first render)

### i18n

Custom, lightweight — no `i18next`.
- `src/context/LocaleContext.jsx` — provider + `useLocale()` hook
- `src/translations/translations.js` — flat English / 中文 dictionaries

`index.jsx`'s `App` route is wrapped in `LocaleProvider`; the standalone pages (`KeyboardLabPage`, `MarkdownPage`) handle their own i18n internally.

### Theming

- 18 themes in `src/style/theme.js`. Each theme shape: `background`, `text`, `gradient`, `title`, `textTypeBox`, `stats`, `fontFamily`.
- 4 dynamic themes render WebGL backgrounds via `uvcanvas` through `src/components/common/DynamicBackground.jsx`.
- Applied via styled-components `ThemeProvider`. Global styles in `src/style/global.js`.

### Styling

Material-UI (`@mui/material` + `@mui/icons-material`) for primitive UI, **styled-components** for everything custom. No Tailwind, no CSS modules. Emotion is present only because MUI requires it.

### Word / Sentence Generation

`src/scripts/` contains generators that consume datasets in `src/constants/` (`WordsMostCommon.js`, `SentencesCollection.js`, `DictionaryConstants.js`, Chinese pinyin datasets, etc.). Challenge links use `seedrandom` via `src/scripts/seedUtils.js` for deterministic shuffles.

### Keyboard Lab (`src/components/features/KeyboardLab/`)

A standalone 3D keyboard design tool reachable at `/keyboardlab`. **Schema-driven architecture** — eight versioned JSON schemas (layout, keycap, legend, visual, shell, caseProfile, renderStyle, design) compose into a `NormalizedKeyboard` runtime model, then render via `@react-three/fiber` + `three.js`.

**Read `src/components/features/KeyboardLab/KEYBOARD_LAB.md` and `PLATFORM_SPEC.md` before making any non-trivial change here** — the schema layering and composition pipeline aren't obvious from the file structure, and breaking schema compatibility breaks user-saved designs in localStorage.

### Markdown Editor

`/markdown` route. Built on `@monaco-editor/react` for the editor pane, `react-markdown` + `react-syntax-highlighter` for the preview pane.

### PWA

`vite-plugin-pwa` is configured in `vite.config.js` with `registerType: "autoUpdate"` and a Workbox glob that caches JS/CSS/HTML/PNG/WAV/JSON up to 5 MB per file. Service worker is generated at build time — changes to caching strategy belong in `vite.config.js`.

### Keyboard Shortcuts

- **Tab + Space** — Redo current test
- **Tab + Enter** — Restart with new words

These are handled in `TypeBox.jsx` (and the equivalent for SentenceBox). If you add new global shortcuts, document them here.
