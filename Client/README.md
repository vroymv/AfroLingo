<div align="center">

# AfroLingo

Empowering learners to discover and preserve African languages through delightful, micro‑learning experiences.

</div>

## Overview

AfroLingo is a cross‑platform (iOS, Android, Web) educational app built with Expo + React Native. It focuses on short, engaging sessions, cultural authenticity, and an architecture that can grow into adaptive learning and community features.

> For the full project overview see: `docs/overview.md`.

## Vision & Core Values

- Celebrate linguistic diversity & cultural context
- Keep learning loops lightweight and habit‑forming
- Design for accessibility and broad device performance
- Grow architecture progressively — avoid premature complexity

## Quick Start

```bash
npm install
npm start        # launches Expo development server
```

### Environment variables

This app expects Expo public env vars (see `Client/.env.example`).

```bash
cp .env.example .env
```

Important:

- `EXPO_PUBLIC_API_BASE_URL` should include the `/api` prefix (example: `http://localhost:3000/api`).
- Socket.io connects to the same server host, but without `/api` (the client derives this automatically).

From the terminal/UI you can open:

- iOS Simulator
- Android Emulator
- Web (React DOM)
- Development build or Expo Go

## Project Structure (Current)

```
app/            # Route segments via expo-router
components/     # Reusable UI & themed primitives
hooks/          # Shared logic (theme, color scheme)
constants/      # Design tokens (colors)
assets/         # Fonts & images
docs/           # Project documentation & ADRs
scripts/        # Utility scripts
```

## Documentation Index

| Topic                    | File                   |
| ------------------------ | ---------------------- |
| High-level overview      | `docs/overview.md`     |
| Feature list & statuses  | `docs/features.md`     |
| Architecture & evolution | `docs/architecture.md` |
| Contributing guidelines  | `docs/contributing.md` |
| Roadmap & phases         | `docs/roadmap.md`      |
| Decisions (ADRs)         | `docs/decisions/`      |

## Roadmap Snapshot

MVP Phases:

1. Foundation (theming, navigation, docs)
2. MVP Learning Loop (mock lessons, streak prototype)
3. Content & Adaptation (drill diversity, audio)
4. Accounts & Sync (auth, cloud persistence)
5. Gamification & Engagement (badges, goals)
6. Scale & Optimization (offline, performance, monitoring)

See full details in `docs/roadmap.md`.

## Contributing

Please read `docs/contributing.md` before opening issues or PRs. Architectural changes require an ADR.

## Scripts

| Script                  | Purpose                              |
| ----------------------- | ------------------------------------ |
| `npm start`             | Run development server               |
| `npm run android`       | Build & launch native Android app    |
| `npm run ios`           | Build & launch native iOS app        |
| `npm run web`           | Run web version                      |
| `npm run lint`          | Lint the codebase                    |
| `npm run reset-project` | Reset starter template (clean slate) |

## Tech Stack

- Expo 53 / React Native 0.79
- Expo Router (file-based navigation)
- TypeScript, ESLint
- React Native Reanimated, Gesture Handler, Expo modules

## Status Legend

Planned · In Progress · Alpha · Beta · Released · Deferred (see `docs/features.md`)

## License

TBD (add a LICENSE file if planning to open source).

## Contact

Add maintainer contact or issue tracker link here.

---

This README stays concise; deeper details live under `docs/`.
