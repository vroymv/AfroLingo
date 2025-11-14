# Database Schema Visualization

## Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER PROGRESS TRACKING                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│     USER     │
│  (id, name)  │
└──────┬───────┘
       │
       ├─────────────────────────────────────────────────────┐
       │                                                       │
       ▼                                                       ▼
┌──────────────────┐                              ┌──────────────────┐
│  UserDailyActivity│                              │   UserMistake    │
│ - date           │                              │ - questionText   │
│ - lessonsCompleted│                             │ - userAnswer     │
│ - activitiesCompleted│                          │ - correctAnswer  │
│ - xpEarned       │                              │ - mistakeType    │
│ - isStreakDay    │                              │ - wasReviewed    │
└──────────────────┘                              │ - isMastered     │
                                                   └──────────────────┘

       ├──────────────────┐
       │                  │
       ▼                  ▼
┌──────────────┐   ┌──────────────────┐
│ UserProgress │   │ LessonProgress   │
│ (Unit Level) │   │ (Lesson Level)   │
│              │   │                  │
│ - progress   │   │ - currentActivityIndex ★
│ - completed  │   │ - isCompleted    │
│ - xpEarned   │   │ - accuracyRate   │
└──────┬───────┘   │ - totalCorrect   │
       │           │ - totalIncorrect │
       │           │ - xpEarned       │
       │           │ - totalSessions  │
       │           └────────┬─────────┘
       │                    │
       ▼                    ├─────────────────────┐
┌──────────────┐           │                     │
│     UNIT     │           ▼                     ▼
│              │   ┌──────────────────┐   ┌──────────────────┐
│ - title      │   │  LessonSession   │   │ ActivityProgress │
│ - level      │   │  (Individual     │   │ (Activity Level) │
│ - xpReward   │   │   Sessions)      │   │                  │
│ - totalLessons│  │                  │   │ - isCompleted    │
└──────┬───────┘   │ - sessionNumber  │   │ - isCorrect      │
       │           │ - startActivity  │   │ - userAnswer     │
       │           │ - endActivity    │   │ - answerHistory[]│
       │           │ - timeSpent      │   │ - hintsUsed      │
       ▼           │ - correctAnswers │   │ - mistakeCount   │
┌──────────────┐   │ - wasCompleted   │   │ - perfectScore   │
│    LESSON    │   └──────────────────┘   │ - xpEarned       │
│              │                          │ - isSkipped      │
│ - phrase     │                          └────────┬─────────┘
│ - meaning    │                                   │
│ - audio      │                                   │
└──────┬───────┘                                   │
       │                                           │
       │                                           │
       ▼                                           │
┌──────────────┐                                  │
│   ACTIVITY   │◄─────────────────────────────────┘
│              │
│ - type       │
│ - question   │
│ - options    │
│ - correctAns │
└──────────────┘
```

## Data Flow: User Completes an Activity

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User starts lesson                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ LessonProgress   │
                    │ created/updated  │
                    │                  │
                    │ currentActivityIndex: 0
                    │ totalSessions: 1 │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  LessonSession   │
                    │    created       │
                    │                  │
                    │ sessionNumber: 1 │
                    │ startActivity: 0 │
                    └──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  2. User answers activity (CORRECT)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├──────────────┐
                              │              │
                              ▼              ▼
                    ┌──────────────────┐  ┌──────────────────┐
                    │ ActivityProgress │  │ LessonProgress   │
                    │   created        │  │    updated       │
                    │                  │  │                  │
                    │ isCompleted: ✓   │  │ currentActivityIndex: +1
                    │ isCorrect: ✓     │  │ completedActivities: +1
                    │ xpEarned: 10     │  │ totalCorrect: +1 │
                    │ perfectScore: ✓  │  │ xpEarned: +10    │
                    └──────────────────┘  │ accuracyRate: ↑  │
                                          └────────┬─────────┘
                              ├─────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  LessonSession   │
                    │    updated       │
                    │                  │
                    │ activitiesCompleted: +1
                    │ correctAnswers: +1
                    │ timeSpent: +30s  │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ UserDailyActivity│
                    │    updated       │
                    │                  │
                    │ activitiesCompleted: +1
                    │ xpEarned: +10    │
                    │ timeSpent: +30s  │
                    └──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  3. User answers activity (INCORRECT)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├──────────────┬───────────────┐
                              │              │               │
                              ▼              ▼               ▼
                    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
                    │ ActivityProgress │  │ LessonProgress   │  │  UserMistake     │
                    │   updated        │  │    updated       │  │    created       │
                    │                  │  │                  │  │                  │
                    │ isCorrect: ✗     │  │ totalIncorrect: +1│ │ questionText     │
                    │ mistakeCount: +1 │  │ accuracyRate: ↓  │  │ userAnswer       │
                    │ attempts: +1     │  └──────────────────┘  │ correctAnswer    │
                    └──────────────────┘                        │ mistakeType      │
                                                                └──────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  4. User completes lesson                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├──────────────┬───────────────┐
                              │              │               │
                              ▼              ▼               ▼
                    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
                    │ LessonProgress   │  │ LessonSession    │  │ UserDailyActivity│
                    │    updated       │  │    updated       │  │    updated       │
                    │                  │  │                  │  │                  │
                    │ isCompleted: ✓   │  │ wasCompleted: ✓  │  │ lessonsCompleted: +1
                    │ completedAt: now │  │ endedAt: now     │  │ isStreakDay: ✓  │
                    │ xpEarned: +bonus │  │ endActivity: 9   │  └──────────────────┘
                    └──────────────────┘  └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  UserProgress    │
                    │ (Unit updated)   │
                    │                  │
                    │ completedLessons: +1
                    │ progress: ↑      │
                    └──────────────────┘
```

## Key Fields Quick Reference

### Resume Point

```
LessonProgress.currentActivityIndex = 5
                                       ↑
                        User resumes at activity #5
```

### Performance Tracking

```
LessonProgress {
  totalCorrect: 8
  totalIncorrect: 2
  accuracyRate: 80.0%  ← calculated: (8 / 10) * 100
}
```

### Session Tracking

```
LessonSession #1 {
  startActivityIndex: 0
  endActivityIndex: 4
  activitiesCompleted: 5
  timeSpent: 300s (5 minutes)
  wasCompleted: false  ← didn't finish lesson
}

LessonSession #2 {
  startActivityIndex: 5
  endActivityIndex: 9
  activitiesCompleted: 5
  timeSpent: 240s (4 minutes)
  wasCompleted: true   ← finished lesson
}
```

### Answer History

```
ActivityProgress {
  answerHistory: [
    { answer: "Habari", timestamp: "2025-11-10T10:00:00Z", isCorrect: false },
    { answer: "Habari za asubuhi", timestamp: "2025-11-10T10:00:30Z", isCorrect: false },
    { answer: "Jambo", timestamp: "2025-11-10T10:01:00Z", isCorrect: true }
  ],
  attempts: 3,
  mistakeCount: 2,
  perfectScore: false
}
```

### Mistake Review

```
UserMistake {
  questionText: "What is 'good morning' in Swahili?",
  userAnswer: "Habari",
  correctAnswer: "Habari za asubuhi",
  mistakeType: "vocabulary",
  wasReviewed: false,
  reviewCount: 0,
  isMastered: false
}
```

### Daily Activity

```
UserDailyActivity (2025-11-10) {
  lessonsCompleted: 3
  activitiesCompleted: 30
  timeSpent: 1800s (30 minutes)
  xpEarned: 225
  isStreakDay: true  ← user met minimum criteria
}
```

### XP Calculation

```
Activity Completion:
├─ Perfect Score (first try, no hints): 10 XP
├─ Good (2-3 tries, no hints): 7 XP
├─ Completed (many tries OR with hints): 5 XP
└─ Skipped: 0 XP

Lesson Bonuses:
├─ Completion: +15 XP
├─ Perfect Lesson (all perfect): +25 XP
├─ Speed Bonus (< avg time): +5 XP
└─ Streak Milestone: +50/100/500 XP
```

## Indexes for Performance

```sql
-- Fast lookups
CREATE INDEX ON lesson_progress (userId, lastAccessedAt);
CREATE INDEX ON activity_progress (userId, isCompleted);
CREATE INDEX ON lesson_sessions (userId, startedAt);
CREATE INDEX ON user_daily_activity (userId, date);
CREATE INDEX ON user_mistakes (userId, wasReviewed, isMastered);

-- Unique constraints (prevent duplicates)
CREATE UNIQUE INDEX ON lesson_progress (userId, lessonId);
CREATE UNIQUE INDEX ON activity_progress (userId, activityId);
CREATE UNIQUE INDEX ON user_daily_activity (userId, date);
```

## State Transitions

```
Lesson State Machine:
┌─────────┐    start     ┌────────────┐   complete   ┌───────────┐
│  NEW    │ ──────────▶ │ IN_PROGRESS│ ───────────▶ │ COMPLETED │
└─────────┘              └─────┬──────┘              └───────────┘
                               │                            ▲
                               │ resume                     │
                               └────────────────────────────┘

Activity State Machine:
┌─────────┐    start     ┌────────────┐   correct    ┌───────────┐
│  NEW    │ ──────────▶ │ IN_PROGRESS│ ───────────▶ │ COMPLETED │
└─────────┘              └─────┬──────┘              └───────────┘
                               │
                               │ incorrect
                               ▼
                         ┌────────────┐
                         │  RETRY     │
                         └─────┬──────┘
                               │
                               │ skip
                               ▼
                         ┌────────────┐
                         │  SKIPPED   │
                         └────────────┘
```
