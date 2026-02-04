<!-- Banner Image -->
<div align="center">
  <br />
  <img src="./AfroLingoBanner.png" alt="AfroLingo Banner" />
  <br />

  <div>
    <img src="https://img.shields.io/badge/React%20Native-white?style=for-the-badge&logo=react&color=%23FFFFFF" alt="React Native" />
    <img src="https://img.shields.io/badge/Expo-black?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/TypeScript-white?style=for-the-badge&logo=typescript&color=%233178C6" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Node%20JS?style=for-the-badge&logo=nodedotjs&logoColor=white&label=Node%20JS" alt="Node JS" />
    <img src="https://img.shields.io/badge/Express-black?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/PostgreSQL-white?style=for-the-badge&logo=postgresql&color=%234169E1&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Prisma-black?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Socket.IO-black?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO" />
    <img src="https://img.shields.io/badge/Redis-black?style=for-the-badge&logo=redis&logoColor=white&color=%23DC382D" alt="Redis" />
    <img src="https://img.shields.io/badge/Firebase-white?style=for-the-badge&logo=firebase&color=%23DD2C00" alt="Firebase" />
  </div>

  <h1 align="center">AfroLingo</h1>

  <div align="center">
    <h4>
      AfroLingo is a cross-platform (iOS/Android/Web) African language-learning app designed for micro-learning.
      It combines structured lessons and progress tracking with real-time experiences (chat, presence, in-app notifications)
      using Socket.IO, Postgres (Prisma), Redis, and Firebase Auth.
    </h4>
  </div>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. 🚨 [About](#about)
3. ⚙️ [Tech Stack](#tech-stack)
4. 🔋 [Features](#features)
5. 🧩 [Architecture](#architecture)
6. 📷 [Screenshots](#screenshots)
7. 🤸 [Quick Start](#quick-start)
8. 🕸️ [Snippets](#snippets)
9. 🔗 [Links](#links)

## <a name="introduction">🤖 Introduction</a>

This repository contains both:

- **Client**: Expo + React Native app in the `Client/` directory.
- **Server**: Node.js (Express) API + Socket.IO realtime server in the `Server/` directory.

The client talks to the server over HTTP (REST endpoints under `/api`) and subscribes to realtime updates via Socket.IO.

## 🚨 <a name="about">About</a>

AfroLingo’s goal is to help learners reconnect with African languages and cultural context through:

- Bite-sized lessons and practice activities
- Progress + XP tracking
- Tutor discovery and 1:1 messaging (real-time)
- Community experiences (UI prototype demonstrating scalable feature structure)

This README is written to be useful for **job applications**: it’s skimmable, highlights engineering decisions, and includes reliable setup instructions.

## <a name="tech-stack">⚙️ Tech Stack</a>

- **Client**: React Native (Expo), Expo Router, TypeScript, Firebase (Auth), Socket.IO client
- **Server**: Node.js, Express, TypeScript, Socket.IO, Zod
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Realtime infra**: Redis (presence, rate limiting, Socket.IO adapter)

## <a name="features">🔋 Features</a>

### Learning + progress

1. Lessons / units / stories / grammar tips / practice activities
2. Progress tracking and XP/streak mechanics

### Onboarding + personalization

3. Onboarding flow and preference storage (theme + notification preferences)

### Tutors + 1:1 realtime chat

4. Tutor discovery served by the backend
5. 1:1 chat with persisted threads/messages in Postgres (Prisma)
6. Realtime delivery over Socket.IO with read/unread tracking

### Community (prototype UI)

7. A prototype-only Community tab implemented with **mock data** (no backend dependencies) demonstrating UI/UX and feature organization.

For the detailed Community summary, see `Client/README_COMMUNITY.md`.

## <a name="architecture">🧩 Architecture</a>

### High-level flow

1. The app authenticates with **Firebase Auth**.
2. HTTP requests go to the Express API (configured via `EXPO_PUBLIC_API_BASE_URL`).
3. Socket.IO connections include a Firebase ID token in the handshake.
4. The server verifies the token using **Firebase Admin**, then joins rooms (per-user and per-group).
5. Durable data lives in **Postgres** (via Prisma).
6. **Redis** provides presence, rate limiting, and Socket.IO scaling support.

### Realtime examples

- In-app notifications: `notification:new`
- Tutor chat: `tutor_chat:message:new`
- Groups: message + presence/typing patterns

## <a name="screenshots">📷 Screenshots</a>

Drop screenshots into `docs/screenshots/` (see `docs/screenshots/README.md` for the expected filenames).

## <h2> 👉 <b>Onboarding</b>: </h2>

<div style="text-align: center;">
  <img src="./docs/screenshots/Onboarding%201.png" alt="Onboarding 1" style="display:inline-block; margin-right:10px;" />
  <img src="./docs/screenshots/Onboarding%202.png" alt="Onboarding 2" style="display:inline-block; margin-right:10px;" />
  <img src="./docs/screenshots/Onboarding%203.png" alt="Onboarding 3" style="display:inline-block; margin-right:10px;" />
  <img src="./docs/screenshots/Onboarding%204.png" alt="Onboarding 4" style="display:inline-block; margin-right:10px;" />
  <img src="./docs/screenshots/Onboarding%205.png" alt="Onboarding 5" style="display:inline-block;" />
</div>

## <h2> 👉 <b>Home / Dashboard</b>: </h2>

<div style="text-align: center;">
  <img src="./docs/screenshots/Home.png" alt="Home" style="display:inline-block; margin-right:10px;" />
  <img src="./docs/screenshots/Learn%20Page.png" alt="Learn Page" style="display:inline-block;" />
</div>

## <h2> 👉 <b>Lesson / Practice</b>: </h2>

<div style="text-align: center;">
  <img src="./docs/screenshots/Alphabet%20Lesson.png" alt="Alphabet Lesson" style="display:inline-block; margin-right:10px;" />
  <img src="./docs/screenshots/Word%20Complete%20lesson.png" alt="Word Complete lesson" style="display:inline-block; margin-right:10px;" />
  <img src="./docs/screenshots/Spelling%20Lesson.png" alt="Spelling Lesson" style="display:inline-block; margin-right:10px;" />
  <img src="./docs/screenshots/Screenshot%202026-02-04%20at%2003.32.42.png" alt="Lesson screenshot" style="display:inline-block;" />
</div>

## <h2> 👉 <b>Tutors + 1:1 Chat</b>: </h2>

<div style="text-align: center;">
  <img src="./docs/screenshots/Tutors.png" alt="Tutors" style="display:inline-block; margin-right:10px;" />
  <i>Add 1:1 chat screenshots here (optional).</i>
</div>

## <h2> 👉 <b>Community</b>: </h2>

<div style="text-align: center;">
  <img src="./docs/screenshots/Groups.png" alt="Groups" style="display:inline-block; margin-right:10px;" />
  <img src="./docs/screenshots/Story.png" alt="Story" style="display:inline-block;" />
</div>

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to run the full project locally.

### Prerequisites

- Node.js 18+
- PostgreSQL (local or remote)
- Redis (recommended)
- A Firebase project for Auth

### 1) Clone the repository

```bash
git clone https://github.com/vroymv/AfroLingo.git
cd AfroLingo
```

### 2) Configure environment variables

**Client**

```bash
cd Client
cp .env.example .env
```

Set at minimum:

- `EXPO_PUBLIC_API_BASE_URL` (must include `/api`, e.g. `http://localhost:3000/api`)
- the `EXPO_PUBLIC_FIREBASE_*` variables

**Server**

```bash
cd ../Server
cp .env.example .env
```

Set at minimum:

- `DATABASE_URL`
- `REDIS_URL` (recommended)
- Firebase Admin credentials (`GOOGLE_APPLICATION_CREDENTIALS` OR `FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`)

### 3) Start the backend

```bash
cd Server
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

### 4) Start the client

Open a second terminal:

```bash
cd Client
npm install
npm start
```

Then open iOS Simulator / Android Emulator / Web from the Expo CLI.

## <a name="snippets">🕸️ Snippets</a>

### Example API base URL (Client)

```env
# Client/.env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

### Example database config (Server)

```env
# Server/.env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/afrolingo?schema=public
REDIS_URL=redis://localhost:6379
```

### Socket auth (concept)

The Socket.IO server expects a Firebase ID token sent during the handshake (client-side implementation details vary by screen):

```ts
// concept only
// io("http://localhost:3000", { auth: { token: "<firebase-id-token>" } })
```

## <a name="links">🔗 Links</a>

- Client docs: `Client/docs/`
- Community summary: `Client/README_COMMUNITY.md`
- Server docs: `Server/DATABASE_GUIDE.md`
