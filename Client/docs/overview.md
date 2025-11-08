# AfriLingo: Language Learning Platform for African Languages

## 1. Vision & Mission

**AfriLingo** is a mobile-first language learning platform built with **React Native**.  
Our mission is to reconnect people of African heritage in the diaspora with their **languages, culture, and identity**.

> **Tagline:** _Learn your roots. Speak your heritage._

---

## 2. Target Audience

- **Primary:** People of African heritage in the diaspora (Europe focus).
- **Personas:**
  1.  **Heritage Learner (2nd-gen diaspora):** Born/raised in Europe, little exposure to parents’/grandparents’ language, wants basics.
  2.  **Returning Traveler:** Planning visits to Africa, wants practical survival phrases.
  3.  **Parent Teaching Kids:** Diaspora parents who want children to learn their “home” language.

---

## 3. Supported Languages (Phase 1)

- **Zulu**
- **Swahili**
- **Lingala**
- **Xhosa**

---

## 4. Core Features

### 4.1 Self-Learning Track

- Structured courses: **Absolute Beginner, Beginner, Refresher**.
- Bite-sized lessons: vocabulary, grammar, culture notes.
- Gamified practice: streaks, XP, badges.

### 4.2 Onboarding & Placement

- **Direct Level Choice:** Users can pick _Absolute Beginner / Beginner / Refresher_.
- **Placement Test Option:**
  - 5–8 quick questions per language (recognition, recall, cultural awareness).
  - Scoring logic assigns appropriate level.
  - JSON-driven content for flexibility.
  - Example:
    ```json
    {
      "placement": {
        "language": "sw",
        "test_taken": true,
        "score": 4,
        "assigned_level": "Beginner"
      }
    }
    ```

### 4.3 Community Spaces

- **Discussion Forums** (per language, culture, heritage).
- **Circles**: small-group chats like _“Beginners in Swahili”_.
- **Content Sharing**: memes, audio clips, proverbs, songs.
- **Peer Feedback:** learners post recordings → native speakers give corrections.
- **Challenges:** “Say hello to your grandma in your language this week.”

### 4.4 Native Speaker Involvement

- **Mentor Profiles:** Verified African speakers can teach.
- **1-on-1 Classes:**
  - Integrated scheduling (Calendly-like).
  - Audio/video via Agora/Twilio/Daily.co.
  - Payment via Stripe Connect (80/20 split).
- **Pronunciation Coaching:**
  - Asynchronous: learners upload voice clip → tutor replies.
  - Live sessions: “repeat after me.”

### 4.5 Audio & Pronunciation

- **Authenticity is core.** Diaspora learners want real African accents.
- **Strategy:**
  1.  **Phase 1:** Record a core library of 500–1000 clips with native speakers.
  2.  **Phase 2:** Allow **community contributions** (crowdsourced recordings).
  3.  **Phase 3:** Explore **ethical voice cloning** (Resemble.ai, ElevenLabs) for scalability.
- **Hybrid Approach:** AI voices for narration/UI; human recordings for core lessons.
- **Storage:** Firebase Storage / AWS S3, tagged by word/phrase ID.

### 4.6 Cultural Anchoring

- Every lesson includes context: greetings for elders, wedding traditions, food names.
- Diaspora focus: _“This is how grandma would say it”_ variations.
- **Culture Cards:** illustrated notes on proverbs, songs, foods, traditions.

---

## 5. Technical Architecture (High-Level)

- **Frontend:** React Native (Expo).
- **Backend:** Node.js or Supabase (authentication, functions, storage).
- **Database:** PostgreSQL (via Supabase) or Firebase Firestore.
- **Auth:** Email + OAuth (Google, Apple, Facebook).
- **Payments:** Stripe Connect for tutors.
- **Real-time:** Supabase Realtime or Firebase for chat/forums.
- **Video/Audio:** Agora / Twilio / Daily.co SDK.
- **Storage:** Firebase Storage / AWS S3 for audio clips.

---

## 6. Monetization Strategy

- **Free Core:** Intro lessons, community access.
- **Subscription (Freemium):**
  - Full course access.
  - Offline downloads.
  - Family sharing (Parent + Kids).
- **Tutor Marketplace:** Paid 1-on-1 sessions (platform commission).
- **Cultural Add-ons:** Proverbs, songs, diaspora slang packs.
- **Partnerships:** Diaspora organizations, festivals, universities.

---

## 7. Example Lesson Flow

**Lesson Title:** _Greeting Grandma_

- **Objective:** Learn to respectfully greet an elder.
- **Languages:**
  - Zulu: _Sawubona Gogo_
  - Swahili: _Shikamoo Bibi_
- **Culture Note:** Elders expect respect → greet them first.
- **Exercises:**
  - Multiple-choice recognition.
  - Record & compare your voice with native speaker.
  - Role-play simulation (choose correct phrase when meeting grandma).

---

## 8. Go-to-Market Strategy

- **Community-first Launch:** diaspora student unions, cultural associations, African churches/mosques in Europe.
- **Social Media:** TikTok, Instagram reels → short clips of greetings & cultural notes.
- **Ambassadors:** Diaspora influencers sharing their language-learning journey.
- **Events:** African cultural festivals in London, Paris, Brussels, Berlin.
- **Partnerships:** Linguistic departments at African universities for content validation.

---

## 9. Roadmap (Phased Rollout)

### Phase 1 (MVP)

- Mobile app with:
  - Onboarding + placement test.
  - 2 languages (Swahili, Zulu).
  - Beginner lessons.
  - Native speaker audio (core set).
  - Community forum (basic).

### Phase 2

- Add Lingala & Xhosa.
- Launch tutor marketplace (video calls + payment).
- Expand community (circles, challenges).
- Release “Culture Cards.”

### Phase 3

- Crowdsourced recordings (community contributions).
- Voice recognition for pronunciation scoring.
- Family packs & offline support.
- Expansion to more African languages.

---

## 10. Key Differentiators

- **Authentic African Voices:** Real native accents, not generic TTS.
- **Cultural Depth:** Proverbs, food, traditions, elders’ respect.
- **Community Bridge:** Connect diaspora learners with native speakers.
- **Flexible Onboarding:** Placement test or self-selection.
- **Marketplace:** Direct support for African tutors and communities.

---
