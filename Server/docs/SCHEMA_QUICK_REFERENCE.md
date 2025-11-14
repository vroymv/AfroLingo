# Database Schema Summary - Progress Tracking

## Quick Reference: What Gets Tracked

### 📍 Current Position

- **LessonProgress.currentActivityIndex**: Exact activity user is on (0-based)
- **LessonProgress.isCompleted**: Lesson finished or not
- **ActivityProgress.isCompleted**: Individual activity finished or not

### ✅ Performance Metrics

- **LessonProgress.accuracyRate**: % correct (Float)
- **LessonProgress.totalCorrect**: Count of correct answers
- **LessonProgress.totalIncorrect**: Count of wrong answers
- **ActivityProgress.isCorrect**: Was this activity answered correctly
- **ActivityProgress.perfectScore**: First try without hints (Boolean)
- **ActivityProgress.mistakeCount**: Wrong attempts before success

### 📝 Answer Tracking

- **ActivityProgress.userAnswer**: Final answer (JSON)
- **ActivityProgress.answerHistory**: All attempts (JSON Array)
- **ActivityProgress.hintsUsed**: Number of hints requested (Int)
- **UserMistake**: Dedicated table for wrong answers with review tracking

### ⏱️ Time Tracking

- **LessonProgress.totalTimeSpent**: Total seconds across all sessions
- **LessonProgress.averageActivityTime**: Average per activity (Float)
- **LessonProgress.lastActivityCompletedAt**: Timestamp of last activity
- **ActivityProgress.timeSpent**: Seconds spent on this activity
- **ActivityProgress.startedAt**: When activity started
- **LessonSession.timeSpent**: Session duration

### 🎯 Session Tracking

- **LessonSession**: Full table tracking each study session
- **LessonProgress.currentSessionStartedAt**: Current session start
- **LessonProgress.totalSessions**: How many times user worked on lesson
- **LessonSession.sessionNumber**: Sequential session number
- **LessonSession.startActivityIndex**: Where session began
- **LessonSession.endActivityIndex**: Where session ended
- **LessonSession.wasCompleted**: Session finished the lesson

### ⭐ XP & Rewards

- **LessonProgress.xpEarned**: XP from this specific lesson
- **ActivityProgress.xpEarned**: XP from this specific activity
- **UserDailyActivity.xpEarned**: Daily XP total

### 🔥 Engagement

- **UserDailyActivity.date**: Activity date (no time component)
- **UserDailyActivity.lessonsCompleted**: Daily lesson count
- **UserDailyActivity.activitiesCompleted**: Daily activity count
- **UserDailyActivity.timeSpent**: Daily time in seconds
- **UserDailyActivity.isStreakDay**: Met minimum criteria for streak

### 🎓 Learning Insights

- **UserMistake.questionText**: What was asked
- **UserMistake.userAnswer**: What they said
- **UserMistake.correctAnswer**: What was correct
- **UserMistake.mistakeType**: Category (spelling, grammar, vocabulary, etc.)
- **UserMistake.wasReviewed**: Seen in review session
- **UserMistake.reviewCount**: Times reviewed
- **UserMistake.isMastered**: Now gets it correct consistently

### 🔄 Skip Tracking

- **ActivityProgress.isSkipped**: User skipped this activity (Boolean)

### 🔁 Attempts

- **LessonProgress.attempts**: Times lesson was restarted
- **ActivityProgress.attempts**: Times activity was attempted

## State Flow Examples

### Starting a New Lesson

```
1. Check if LessonProgress exists for (userId, lessonId)
2. If not, create with:
   - currentActivityIndex: 0
   - totalActivities: from lesson data
   - totalSessions: 1
3. Create LessonSession:
   - sessionNumber: 1
   - startActivityIndex: 0
4. Create UserDailyActivity for today if not exists
```

### Submitting an Activity Answer (Correct)

```
1. Update/Create ActivityProgress:
   - isCompleted: true
   - isCorrect: true
   - userAnswer: answer
   - answerHistory: push to array
   - timeSpent: calculated
   - attempts: increment
   - xpEarned: calculate based on performance
   - perfectScore: attempts==1 && hintsUsed==0

2. Update LessonProgress:
   - completedActivities: +1
   - currentActivityIndex: +1 (move forward)
   - totalCorrect: +1
   - accuracyRate: recalculate
   - xpEarned: += activity XP
   - lastActivityCompletedAt: now()
   - totalTimeSpent: += activity time

3. Update LessonSession:
   - activitiesCompleted: +1
   - correctAnswers: +1
   - timeSpent: += activity time
   - endActivityIndex: current index

4. Update UserDailyActivity (today):
   - activitiesCompleted: +1
   - timeSpent: += activity time
   - xpEarned: += activity XP
```

### Submitting an Activity Answer (Incorrect)

```
1. Update/Create ActivityProgress:
   - isCompleted: false (or true if no retry)
   - isCorrect: false
   - userAnswer: answer
   - answerHistory: push to array
   - mistakeCount: +1
   - attempts: increment

2. Create UserMistake:
   - questionText: from activity
   - userAnswer: answer
   - correctAnswer: from activity
   - mistakeType: determine from activity type

3. Update LessonProgress:
   - totalIncorrect: +1
   - accuracyRate: recalculate

4. Update LessonSession:
   - incorrectAnswers: +1
```

### Using a Hint

```
1. Update ActivityProgress:
   - hintsUsed: +1
   - perfectScore: false (can't be perfect with hints)

2. Update LessonSession:
   - hintsUsed: +1

3. Reduce potential XP for this activity
```

### Skipping an Activity

```
1. Update/Create ActivityProgress:
   - isSkipped: true
   - isCompleted: false

2. Update LessonProgress:
   - currentActivityIndex: +1 (move forward)

3. No XP awarded
```

### Completing a Lesson

```
1. Update LessonProgress:
   - isCompleted: true
   - completedAt: now()
   - xpEarned: += completion bonus

2. Update LessonSession:
   - wasCompleted: true
   - endedAt: now()

3. Update UserDailyActivity:
   - lessonsCompleted: +1
   - isStreakDay: check criteria

4. Update UserProgress (unit level):
   - completedLessons: +1
   - progress: recalculate percentage
```

### Resuming a Lesson

```
1. Find LessonProgress for (userId, lessonId)
2. Read currentActivityIndex
3. Create new LessonSession:
   - sessionNumber: totalSessions + 1
   - startActivityIndex: currentActivityIndex
4. Update LessonProgress:
   - totalSessions: +1
   - currentSessionStartedAt: now()
```

## Query Examples

### Get User's Current Position

```typescript
const progress = await prisma.lessonProgress.findUnique({
  where: {
    userId_lessonId: {
      userId: userId,
      lessonId: lessonId,
    },
  },
  include: {
    lesson: {
      include: {
        activities: {
          orderBy: { order: "asc" },
        },
      },
    },
  },
});

const currentActivity =
  progress.lesson.activities[progress.currentActivityIndex];
```

### Get All Completed Activities for a Lesson

```typescript
const completedActivities = await prisma.activityProgress.findMany({
  where: {
    userId: userId,
    activity: {
      lessonId: lessonId,
    },
    isCompleted: true,
  },
  include: {
    activity: true,
  },
  orderBy: {
    completedAt: "asc",
  },
});
```

### Get User's Mistakes for Review

```typescript
const mistakesToReview = await prisma.userMistake.findMany({
  where: {
    userId: userId,
    isMastered: false,
    OR: [
      { wasReviewed: false },
      {
        AND: [
          { reviewCount: { lt: 3 } },
          { lastReviewedAt: { lt: threeDaysAgo } },
        ],
      },
    ],
  },
  include: {
    activity: true,
    lesson: true,
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 10,
});
```

### Calculate Current Streak

```typescript
const today = new Date();
const dailyActivities = await prisma.userDailyActivity.findMany({
  where: {
    userId: userId,
    isStreakDay: true,
  },
  orderBy: {
    date: "desc",
  },
});

// Calculate consecutive days
let streak = 0;
let checkDate = today;
for (const activity of dailyActivities) {
  if (isSameDay(activity.date, checkDate)) {
    streak++;
    checkDate = subtractDays(checkDate, 1);
  } else {
    break;
  }
}
```

### Get Session Statistics

```typescript
const sessions = await prisma.lessonSession.findMany({
  where: {
    userId: userId,
    lessonProgressId: lessonProgressId,
  },
  orderBy: {
    sessionNumber: "asc",
  },
});

const stats = {
  totalSessions: sessions.length,
  totalTimeSpent: sessions.reduce((sum, s) => sum + s.timeSpent, 0),
  averageTimePerSession:
    sessions.reduce((sum, s) => sum + s.timeSpent, 0) / sessions.length,
  completedSessions: sessions.filter((s) => s.wasCompleted).length,
};
```

## Unique Constraints

These prevent duplicate records:

- `userId + unitId` (UserProgress)
- `userId + lessonId` (LessonProgress)
- `userId + activityId` (ActivityProgress)
- `userId + date` (UserDailyActivity)

## Key Relationships

```
User
├── UserProgress (many units)
├── LessonProgress (many lessons)
│   └── LessonSession (many sessions per lesson)
├── ActivityProgress (many activities)
├── UserDailyActivity (many days)
└── UserMistake (many mistakes)

Unit
├── Lesson (many)
│   ├── Activity (many)
│   │   └── ActivityProgress (many users)
│   └── LessonProgress (many users)
└── UserProgress (many users)
```
