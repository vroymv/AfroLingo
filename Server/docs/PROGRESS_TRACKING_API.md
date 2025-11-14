# Comprehensive Lesson Progress Tracking API

## Overview

This document outlines the enhanced database schema and API endpoints for tracking user progress through lessons with granular detail.

## Enhanced Database Schema

### Key Improvements

1. **Current Position Tracking**: `LessonProgress.currentActivityIndex` tracks exactly where the user left off
2. **Session Management**: `LessonSession` model tracks individual learning sessions
3. **Detailed Performance Metrics**: Accuracy rates, timing, XP per activity
4. **Mistake Tracking**: `UserMistake` model for targeted review and learning insights
5. **Daily Activity & Streaks**: `UserDailyActivity` for engagement tracking
6. **Enhanced Activity Progress**: Answer history, hints used, perfect score tracking

### Models

#### LessonProgress (Enhanced)

Tracks overall progress through a lesson:

- `currentActivityIndex`: Where user is currently (0-based)
- `accuracyRate`: % of correct answers
- `totalCorrect/totalIncorrect`: Answer tracking
- `xpEarned`: XP from this specific lesson
- `currentSessionStartedAt`: When current session began
- `totalSessions`: How many times user has worked on this lesson
- `lastActivityCompletedAt`: Timestamp of last activity completion

#### ActivityProgress (Enhanced)

Tracks individual activity completion:

- `answerHistory`: JSON array of all attempted answers
- `hintsUsed`: Number of hints requested
- `mistakeCount`: Wrong attempts before success
- `perfectScore`: Completed on first try without hints
- `xpEarned`: XP from this specific activity
- `isSkipped`: Did user skip this activity

#### LessonSession (NEW)

Tracks individual study sessions:

- `sessionNumber`: Sequential number for this lesson
- `startActivityIndex/endActivityIndex`: Session boundaries
- `activitiesCompleted`: Count for this session
- `correctAnswers/incorrectAnswers`: Session performance
- `timeSpent`: Duration in seconds
- `wasCompleted`: Did session finish the lesson

#### UserDailyActivity (NEW)

Daily engagement metrics:

- `date`: Date of activity (no time)
- `lessonsCompleted`: Daily count
- `activitiesCompleted`: Daily count
- `timeSpent`: Total seconds
- `xpEarned`: Daily XP
- `isStreakDay`: Did user meet minimum criteria

#### UserMistake (NEW)

Learning insights from mistakes:

- `questionText`: The question asked
- `userAnswer`: What they answered
- `correctAnswer`: What was correct
- `mistakeType`: Category (spelling, grammar, etc.)
- `wasReviewed/reviewCount`: Review tracking
- `isMastered`: Now gets it correct consistently

## API Endpoints to Implement

### 1. Start/Resume Lesson

```typescript
POST /api/lessons/:lessonId/start
Headers: { Authorization: Bearer <token> }

Response:
{
  "lessonProgressId": "uuid",
  "currentActivityIndex": 0,
  "totalActivities": 10,
  "sessionNumber": 1,
  "resuming": false,
  "completedActivities": 0,
  "xpEarned": 0
}
```

**Logic:**

- Check if `LessonProgress` exists for user+lesson
- If exists and not completed, resume at `currentActivityIndex`
- Create new `LessonSession` record
- Return current state

### 2. Submit Activity Answer

```typescript
POST /api/activities/:activityId/submit
Headers: { Authorization: Bearer <token> }

Body:
{
  "answer": <any>,          // User's answer
  "timeSpent": 45,          // Seconds
  "hintsUsed": 0,
  "isCorrect": true,
  "lessonProgressId": "uuid"
}

Response:
{
  "correct": true,
  "xpEarned": 5,
  "perfectScore": true,
  "explanation": "Great job!",
  "nextActivityIndex": 1,
  "lessonCompleted": false,
  "totalXP": 5
}
```

**Logic:**

- Create/update `ActivityProgress` record
- Add to `answerHistory` array
- If incorrect, create `UserMistake` record
- Calculate XP based on performance (perfect score = more XP)
- Update `LessonProgress`:
  - Increment `completedActivities`
  - Update `currentActivityIndex`
  - Update `totalCorrect/totalIncorrect`
  - Recalculate `accuracyRate`
  - Add to `xpEarned`
- Update `LessonSession` stats
- Update `UserDailyActivity` for today
- Return feedback and next steps

### 3. Skip Activity

```typescript
POST /api/activities/:activityId/skip
Headers: { Authorization: Bearer <token> }

Body:
{
  "lessonProgressId": "uuid",
  "timeSpent": 10
}

Response:
{
  "nextActivityIndex": 1,
  "lessonCompleted": false
}
```

**Logic:**

- Mark `ActivityProgress.isSkipped = true`
- Don't award XP
- Move to next activity

### 4. Request Hint

```typescript
POST /api/activities/:activityId/hint
Headers: { Authorization: Bearer <token> }

Body:
{
  "hintNumber": 1  // Which hint (activities may have multiple)
}

Response:
{
  "hint": "Try looking at the first letter...",
  "hintsRemaining": 2
}
```

**Logic:**

- Increment `ActivityProgress.hintsUsed`
- Return appropriate hint
- Reduce potential XP for this activity

### 5. Get Lesson Progress

```typescript
GET /api/lessons/:lessonId/progress
Headers: { Authorization: Bearer <token> }

Response:
{
  "lessonProgress": {
    "currentActivityIndex": 3,
    "totalActivities": 10,
    "completedActivities": 3,
    "isCompleted": false,
    "accuracyRate": 85.5,
    "totalCorrect": 3,
    "totalIncorrect": 0,
    "xpEarned": 15,
    "totalSessions": 2,
    "totalTimeSpent": 240,
    "canResume": true
  },
  "currentSession": {
    "sessionNumber": 2,
    "activitiesCompleted": 1,
    "startedAt": "2025-11-10T10:30:00Z",
    "timeSpent": 60
  },
  "activities": [
    {
      "activityId": "uuid",
      "order": 0,
      "isCompleted": true,
      "isCorrect": true,
      "attempts": 1,
      "perfectScore": true
    },
    // ... more activities
  ]
}
```

### 6. Complete Lesson

```typescript
POST /api/lessons/:lessonId/complete
Headers: { Authorization: Bearer <token> }

Body:
{
  "finalScore": 95,
  "totalTimeSpent": 300
}

Response:
{
  "lessonCompleted": true,
  "totalXP": 75,
  "bonusXP": 10,  // For high accuracy
  "accuracyRate": 95,
  "perfectActivities": 8,
  "totalActivities": 10,
  "nextLessonId": "uuid",
  "achievements": ["first_lesson_complete"],
  "streakUpdated": true,
  "currentStreak": 5
}
```

**Logic:**

- Set `LessonProgress.isCompleted = true`
- Set `completedAt` timestamp
- Award bonus XP for high accuracy/speed
- Update `LessonSession.wasCompleted = true`
- Update `UserDailyActivity`
- Check for achievements
- Update unit progress
- Return summary and next lesson

### 7. Get Daily Progress

```typescript
GET /api/users/me/daily-progress
Headers: { Authorization: Bearer <token> }

Query Params:
?startDate=2025-11-01&endDate=2025-11-10

Response:
{
  "dailyActivities": [
    {
      "date": "2025-11-10",
      "lessonsCompleted": 2,
      "activitiesCompleted": 20,
      "timeSpent": 900,
      "xpEarned": 150,
      "isStreakDay": true
    },
    // ... more days
  ],
  "currentStreak": 7,
  "longestStreak": 15,
  "totalXP": 1250
}
```

### 8. Get Mistakes for Review

```typescript
GET /api/users/me/mistakes
Headers: { Authorization: Bearer <token> }

Query Params:
?unreviewed=true&limit=10

Response:
{
  "mistakes": [
    {
      "id": "uuid",
      "questionText": "What is 'thank you' in Swahili?",
      "userAnswer": "Asante sana",
      "correctAnswer": "Asante",
      "mistakeType": "vocabulary",
      "lessonTitle": "Basic Greetings",
      "createdAt": "2025-11-09T14:30:00Z",
      "reviewCount": 0,
      "isMastered": false
    },
    // ... more mistakes
  ],
  "totalMistakes": 25,
  "unmasteredCount": 15
}
```

### 9. Mark Mistake as Reviewed

```typescript
POST /api/mistakes/:mistakeId/review
Headers: { Authorization: Bearer <token> }

Body:
{
  "gotItCorrect": true
}

Response:
{
  "reviewCount": 3,
  "isMastered": true,
  "nextReviewDate": "2025-11-15T00:00:00Z"
}
```

### 10. Get Session History

```typescript
GET /api/lessons/:lessonId/sessions
Headers: { Authorization: Bearer <token> }

Response:
{
  "sessions": [
    {
      "sessionNumber": 1,
      "startedAt": "2025-11-09T10:00:00Z",
      "endedAt": "2025-11-09T10:15:00Z",
      "timeSpent": 900,
      "activitiesCompleted": 5,
      "correctAnswers": 4,
      "incorrectAnswers": 1,
      "wasCompleted": false
    },
    {
      "sessionNumber": 2,
      "startedAt": "2025-11-10T09:00:00Z",
      "endedAt": "2025-11-10T09:25:00Z",
      "timeSpent": 1500,
      "activitiesCompleted": 5,
      "correctAnswers": 5,
      "incorrectAnswers": 0,
      "wasCompleted": true
    }
  ],
  "totalSessions": 2,
  "totalTimeSpent": 2400,
  "averageSessionTime": 1200
}
```

## XP Calculation Rules

### Base XP per Activity

- **Perfect Score** (first try, no hints): 10 XP
- **Good** (< 3 attempts, no hints): 7 XP
- **Completed** (any attempts, no hints): 5 XP
- **With Hints**: -1 XP per hint used (min 2 XP)

### Bonus XP

- **Lesson completion**: +15 XP
- **Perfect lesson** (all activities perfect): +25 XP
- **Speed bonus** (< average time): +5 XP
- **Streak milestone** (7, 30, 100 days): +50/100/500 XP

## Client Implementation Guide

### When User Opens a Lesson

```typescript
// 1. Call start/resume endpoint
const response = await fetch(`/api/lessons/${lessonId}/start`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
});
const { lessonProgressId, currentActivityIndex, totalActivities } =
  await response.json();

// 2. Navigate to the activity
setCurrentActivityIndex(currentActivityIndex);
```

### When User Submits an Answer

```typescript
// 1. Track time spent on activity
const timeSpent = Date.now() - activityStartTime;

// 2. Submit answer
const response = await fetch(`/api/activities/${activityId}/submit`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    answer: userAnswer,
    timeSpent: Math.floor(timeSpent / 1000),
    hintsUsed: hintsUsedCount,
    isCorrect: checkAnswer(userAnswer),
    lessonProgressId,
  }),
});

const result = await response.json();

// 3. Show feedback
showFeedback(result);

// 4. Update UI
if (result.lessonCompleted) {
  showCompletionScreen(result);
} else {
  moveToActivity(result.nextActivityIndex);
}
```

### When User Requests a Hint

```typescript
const response = await fetch(`/api/activities/${activityId}/hint`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    hintNumber: currentHintNumber + 1,
  }),
});

const { hint, hintsRemaining } = await response.json();
setHintsUsedCount((prev) => prev + 1);
displayHint(hint);
```

### When User Leaves Lesson (Auto-save)

```typescript
// Progress is auto-saved on each activity submission
// No additional call needed - currentActivityIndex is already updated
// User can close and resume later
```

## Database Indexes

All necessary indexes are already defined in the schema:

- `LessonProgress`: userId, lessonId, isCompleted, lastAccessedAt
- `ActivityProgress`: userId, activityId, isCompleted, lessonProgressId, completedAt
- `LessonSession`: userId, lessonProgressId, startedAt
- `UserDailyActivity`: userId, date, isStreakDay
- `UserMistake`: userId, activityId, lessonId, wasReviewed, isMastered, createdAt

## Migration Notes

The migration has been successfully applied with the name:
`20251110135335_comprehensive_lesson_progress_tracking`

All existing data will be preserved. New fields will have default values:

- `currentActivityIndex`: 0
- `totalSessions`: 1
- `attempts`: 1
- New boolean fields: false
- Timestamp fields: now()

## Next Steps

1. ✅ Database schema updated and migrated
2. 📝 Implement API endpoints (use this document as reference)
3. 🔄 Update client-side lesson player to call progress APIs
4. 📊 Build analytics dashboard using the new data
5. 🎯 Implement spaced repetition review using `UserMistake` data
