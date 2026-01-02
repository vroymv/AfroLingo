# Features

This document enumerates current and planned AfroLingo features. Each item is tagged with a status.

Status Legend: Planned | In Progress | Alpha | Beta | Released | Deferred

## 1. Core Learning Experience

| Feature                  | Description                                     | Status  | Notes                          |
| ------------------------ | ----------------------------------------------- | ------- | ------------------------------ |
| Daily Lesson Feed        | Ordered list of recommended micro‑lessons       | Planned | Requires content model         |
| Micro Lessons            | 3–5 minute thematic units                       | Planned | Authoring pipeline TBD         |
| Adaptive Difficulty      | Adjust question difficulty based on performance | Planned | Needs backend telemetry        |
| Spaced Repetition Engine | Re-schedules vocabulary for retention           | Planned | Algorithm selection pending    |
| Offline Lesson Cache     | Use lessons without network                     | Planned | After core delivery solidifies |
| Lesson Progress Tracking | Persist % complete, streak continuity           | Planned | Depends on auth/account        |

## 2. Content & Languages

| Feature | Description | Status | Notes |
| Language Catalog | Browse supported languages & dialect snapshots | Planned | UI stub in `explore` screen |
| Cultural Notes | Inline cultural / contextual explanations | Planned | Needs content sourcing guidelines |
| Audio Pronunciations | Native speaker recordings per term | Planned | Asset pipeline required |
| Script / Orthography Support | Display tone marks, special glyphs | Planned | Font curation needed |

## 3. Engagement & Gamification

| Feature | Description | Status | Notes |
| Streak Counter | Consecutive learning days indicator | Planned | Local prototype first |
| XP System | Points awarded per completed action | Planned | Must define economy balance |
| Badges & Achievements | Milestone-based rewards | Planned | Visual asset design required |
| Daily Goal Setting | Select target minutes / XP | Planned | UX research open |
| Streak Freeze | Token to preserve streak on missed day | Planned | Part of retention toolkit |

## 4. Community & Social Features

| Feature               | Description                                         | Status   | Notes                                                  |
| --------------------- | --------------------------------------------------- | -------- | ------------------------------------------------------ |
| Community Hub         | Material Top Tabs navigation for community features | Released | Sections vary by build                                 |
| Weekly Challenges     | Gamified speaking/writing practice challenges       | Released | Audio/video submissions, XP rewards, progress tracking |
| Resource Sharing      | Curated learning materials with bookmarking         | Released | Podcasts, videos, PDFs, study groups                   |
| User Types & Badges   | Diaspora learner vs native speaker identification   | Released | Country flags, role indicators                         |
| Emoji Reactions       | Quick feedback system for posts and comments        | Released | Multiple reaction types                                |
| Gamification Elements | XP rewards, badges, progress bars                   | Released | Challenge participation tracking                       |

## 5. Accounts & Social (Future)

| Feature | Description | Status | Notes |
| User Accounts | Secure identity & personalization | Planned | Auth provider not selected |
| Profile Dashboard | User stats, badges, languages | Planned | After accounts |
| Leaderboards | Compare progress with peers | Deferred | Potential privacy concerns |
| Social Sharing | Share achievements externally | Planned | Evaluate frictionless flows |

## 6. UI / UX Foundation

| Feature | Description | Status | Notes |
| Theming (Light/Dark) | System scheme adaptive theming | Alpha | Basic hooks present |
| Accessible Color Tokens | Inclusive contrast palette | Planned | Expand `Colors.ts` |
| Haptic Feedback | Subtle haptics for key interactions | Alpha | `expo-haptics` included |
| Parallax & Motion Patterns | Delightful interaction patterns | Alpha | `ParallaxScrollView` prototype |
| Iconography System | Consistent symbolic icons | Planned | Evaluate design library |

## 6. Performance & Quality

## 7. Tooling & Developer Experience

| Feature | Description | Status | Notes |
| Project Reset Script | Quickly scaffold blank app area | Released | `scripts/reset-project.js` |
| Linting & Formatting | Consistent code style | In Progress | ESLint present; add Prettier? |
| Commit Hooks | Pre-commit lint/test gating | Planned | Husky + lint-staged |
| ADR Log | Track architectural decisions | In Progress | `decisions/` directory created |
| Automated Changelog | Generate release notes | Planned | Conventional Commits + tooling |

## 8. Security & Privacy (Forward-Looking)

| Feature | Description | Status | Notes |
| Privacy Policy | Transparent data usage | Planned | Before public release |
| Data Minimization | Only store essential user data | Planned | Policy doc required |
| Secure Storage | Protect sensitive tokens locally | Planned | Use expo-secure-store |
| Analytics Governance | Ethical metrics selection | Planned | Draft governance ADR |

## 9. Modern React Native + Expo Project Features

This section captures implementation-focused platform capabilities and tooling targets for the mobile codebase. These complement the product feature roadmap above.

### 9.1 Styling & Theming

- Tailwind CSS via NativeWind (utility‑first styling)
- Dark / Light theme (system aware)
- Custom theme extensions (colors, typography, spacing)
- Global design system (reusable UI primitives: buttons, cards, modals)

### 9.2 State & Context Management

- React Context for global domains (auth, theme, settings)
- Zustand or Jotai for lightweight local/global state stores
- React Query (TanStack Query) for server state, caching & offline
- AsyncStorage / SecureStore for persisted tokens & preferences

### 9.3 Navigation

- Expo Router v3 (file‑based routing)
- Nested navigation patterns (stack + tabs + drawer)
- Deep linking (universal links, push notification intents)

### 9.4 UI / UX Enhancements

- Gesture Handler + Reanimated for fluid interactions
- Framer Motion (where appropriate) for modern animations
- Skeleton loaders / shimmer placeholders
- Pull‑to‑refresh & infinite scroll behaviors

### 9.5 Forms & Validation

- React Hook Form for performant controlled/uncontrolled hybrids
- Zod for schema validation + type inference
- Reusable input components (text, select, date pickers)

### 9.6 API & Data Layer

- Central fetch/API wrapper (error normalization, auth headers, retry)
- Environment variables via `expo-constants`
- React Query for caching, sync and offline queuing

### 9.7 Authentication

- JWT token auth flow
- OAuth / Social logins (Google, Apple, Facebook)
- Secure token storage (Expo SecureStore)

### 9.8 Notifications

- Push notifications (Expo Notifications API)
- In‑app toasts / ephemeral notification layer

### 9.9 File Handling & Media

- Image / document selection (Expo Image Picker / Document Picker)
- Camera access (Expo Camera)
- Image caching (e.g. `react-native-fast-image` or equivalent strategy)

### 9.10 Performance & Optimization

- Code splitting & dynamic imports where beneficial
- Lazy loading of non‑critical screens/modules
- OTA updates via Expo Updates

### 9.11 CI/CD & Deployment

- EAS Build & Submit pipelines
- Automated asset pipeline (app icons, splash screens)
- Semantic versioning & release channels strategy

### 9.12 Modern Extras

- Localization (start: English; extensible i18n framework)
- Analytics (Firebase only initial scope)
- Crash reporting (Sentry)

> Note: Detailed adoption status of these technical features will be tracked incrementally; items not yet integrated should be assumed "Planned" unless otherwise reflected in commit history or ADRs.

## How to Propose a New Feature

1. Open an issue using the "Feature" template (to be added).
2. Provide problem statement, user value, rough scope.
3. Link related discussion or research if available.
4. After triage, feature gets a status.

## Next Updates

This list will mature as architecture, content strategy, and backend choices are finalized.
