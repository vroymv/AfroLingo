# XP System Documentation

## Overview

The AfroLingo XP system is designed to reward users for various activities and milestones. It uses a centralized XP service that can award XP from any source across the app.

## Architecture

### Core Components

1. **XP Rules Configuration** (`src/config/xpRules.ts`)

   - Centralized configuration for all XP values
   - Activity type bonuses
   - Streak milestones
   - Daily goals

2. **XP Service** (`src/services/xpService.ts`)

   - Universal XP transaction management
   - Duplicate prevention via idempotency keys
   - XP calculation and tracking

3. **XP Calculator** (`src/services/xpCalculator.ts`)

   - Activity performance calculations
   - Bonus calculations
   - Streak bonus logic

4. **XP Routes** (`src/routes/xp.ts`)
   - Universal API endpoints for XP management

## API Endpoints

### POST /api/xp/award

Award XP to a user for any reason.

**Request Body:**

```json
{
  "userId": "uuid",
  "amount": 10,
  "sourceType": "activity_completion",
  "sourceId": "activity-123",
  "metadata": {
    "activityType": "listening",
    "performance": { ... }
  },
  "skipDuplicateCheck": false
}
```

**Source Types:**

- `activity_completion` - Completing an activity
- `unit_completion` - Completing a unit
- `lesson_completion` - Completing a lesson
- `streak_milestone` - Reaching a streak milestone (7, 14, 30, etc.)
- `daily_streak` - Daily streak bonus
- `daily_goal_met` - Meeting daily XP goal
- `perfect_unit` - Perfect completion of a unit
- `speed_bonus` - Completing faster than expected
- `manual_adjustment` - Admin/manual XP adjustment
- `bonus_reward` - Special bonuses

**Response:**

```json
{
  "success": true,
  "data": {
    "success": true,
    "xpAwarded": 10,
    "isDuplicate": false,
    "totalXP": 250
  }
}
```

### GET /api/xp/:userId/total

Get total XP for a user.

**Response:**

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "totalXP": 250
  }
}
```

### GET /api/xp/:userId/breakdown

Get XP breakdown by source type.

**Response:**

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "totalXP": 250,
    "breakdown": {
      "activity_completion": 150,
      "streak_milestone": 50,
      "daily_goal_met": 50
    }
  }
}
```

### GET /api/xp/:userId/transactions?limit=10

Get recent XP transactions.

**Response:**

```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "transactions": [
      {
        "id": "uuid",
        "userId": "uuid",
        "amount": 10,
        "sourceType": "activity_completion",
        "sourceId": "activity-123",
        "metadata": { ... },
        "createdAt": "2025-12-29T10:00:00Z"
      }
    ]
  }
}
```

## XP Rules

### Activity Performance

- **Perfect Score** (1st try, no hints): 15 XP
- **Good Score** (< 3 attempts, no hints): 10 XP
- **Completed** (with attempts/hints): 5 XP
- **Hint Penalty**: -2 XP per hint
- **Minimum XP**: 2 XP (for any completed activity)

### Activity Type Bonuses

Bonuses added on top of performance score:

- **Listening**: +5 XP
- **Speaking**: +5 XP
- **Reading**: +2 XP
- **Writing**: +3 XP
- **Grammar**: +3 XP
- **Vocabulary**: +2 XP

### Lesson Bonuses

- **Lesson Completion**: 20 XP
- **Perfect Lesson** (all activities perfect): 50 XP
- **Speed Bonus** (faster than average): 10 XP

### Streak Bonuses

Awarded when reaching milestones:

- **7 days**: 50 XP
- **14 days**: 100 XP
- **30 days**: 250 XP
- **50 days**: 500 XP
- **100 days**: 1,000 XP
- **365 days**: 5,000 XP

### Daily Goals

- **Daily Goal Met**: 20 XP (when reaching daily XP target)

## Usage Examples

### Awarding XP for Activity Completion

Award XP after calculating performance:

```typescript
// First, calculate the XP based on performance
import { calculateActivityXP, ActivityPerformance } from '../services/xpCalculator';

const performance: ActivityPerformance = {
  isCorrect: true,
  attempts: 1,
  hintsUsed: 0,
  timeSpent: 45,
  activityType: 'listening'
};

const xpAmount = calculateActivityXP(performance);

// Then award the XP
POST /api/xp/award
{
  "userId": "user-123",
  "amount": xpAmount,
  "sourceType": "activity_completion",
  "sourceId": "activity-456",
  "metadata": {
    "activityType": "listening",
    "performance": performance
  }
}
```

### Awarding XP for Streak Milestone

```typescript
POST /api/xp/award
{
  "userId": "user-123",
  "amount": 50,
  "sourceType": "streak_milestone",
  "sourceId": "streak_7_2025-12-29",
  "metadata": {
    "streakDays": 7,
    "milestone": true
  }
}
```

### Awarding XP for Unit Completion

```typescript
POST /api/xp/award
{
  "userId": "user-123",
  "amount": 100,
  "sourceType": "unit_completion",
  "sourceId": "unit-alphabet",
  "metadata": {
    "unitTitle": "The Alphabet",
    "perfectScore": true
  }
}
```

### Manual XP Adjustment

```typescript
POST /api/xp/award
{
  "userId": "user-123",
  "amount": 500,
  "sourceType": "bonus_reward",
  "sourceId": "holiday_bonus_2025",
  "metadata": {
    "reason": "Holiday event bonus",
    "admin": "admin-456"
  },
  "skipDuplicateCheck": true
}
```

## Duplicate Prevention

The XP service uses idempotency keys to prevent duplicate XP awards:

- Format: `{sourceType}_{sourceId}_{userId}`
- Example: `activity_completion_activity-456_user-123`

If the same transaction is attempted twice, the second attempt will:

- Return `isDuplicate: true`
- Not award additional XP
- Return the current total XP

Use `skipDuplicateCheck: true` for cases where multiple awards are expected (e.g., manual bonuses).

## Integration with Other Services

### Activity Completion Flow

When a user completes an activity, you need to:

1. **Calculate XP** based on performance:

```typescript
import {
  calculateActivityXP,
  ActivityPerformance,
} from "../services/xpCalculator";

const performance: ActivityPerformance = {
  isCorrect: true,
  attempts: 1,
  hintsUsed: 0,
  timeSpent: 45,
  activityType: "listening",
};

const xpEarned = calculateActivityXP(performance);
```

2. **Award XP** using the universal XP service:

```typescript
import { awardXP } from "../services/xpService";

const result = await awardXP({
  userId,
  amount: xpEarned,
  sourceType: "activity_completion",
  sourceId: activityId,
  metadata: { activityType, performance },
});
```

3. **Update Daily Activity** and trigger streak calculation:

```typescript
import { updateDailyActivity } from "../services/streakService";

await updateDailyActivity(userId, {
  activitiesCompleted: 1,
  timeSpent: 45,
  xpEarned,
});
```

4. **Update Activity Progress** in the database:

```typescript
await prisma.activityProgress.upsert({
  where: { userId_activityId: { userId, activityId } },
  create: {
    /* ... */
  },
  update: {
    /* ... */
  },
});
```

### XP Award Flow (via /api/xp/award)

1. Client or server-side code calls `/api/xp/award` with XP details
2. `awardXP()` service checks for duplicate transactions using idempotency key
3. If not duplicate, XP transaction is created in database
4. Total XP is recalculated and returned
5. Caller receives: success status, XP awarded, duplicate flag, and total XP

### Streak Bonus Flow (automatic)

1. When `updateDailyActivity()` is called, it records activity for the day
2. `updateUserStreak()` is called automatically
3. Streak is calculated by checking consecutive streak days
4. User's `currentStreakDays` is updated in the database
5. If streak matches a milestone (7, 14, 30, 50, 100, 365 days):
   - `calculateStreakBonusXP()` determines bonus amount
   - `awardXP()` awards bonus with `streak_milestone` source type
   - Bonus XP is added to daily activity totals
6. Streak bonus appears in user's XP breakdown and transaction history

### Daily Goal Check Flow

After awarding XP, you should check if the user met their daily goal:

```typescript
import { checkAndAwardDailyGoal } from "../services/xpService";

await checkAndAwardDailyGoal(userId);
```

This automatically:

- Checks if today's XP >= user's daily XP goal
- Awards bonus if goal met (and not already awarded today)
- Updates daily activity with `metGoal: true`

## Database Schema

### XpTransaction

```prisma
model XpTransaction {
  id             String   @id @default(uuid())
  userId         String
  amount         Int      // Can be positive or negative
  sourceType     String   // One of the XPSourceType values
  sourceId       String   // ID of the source (activity, unit, date, etc.)
  idempotencyKey String   // Prevents duplicate awards
  metadata       Json?    // Additional context
  createdAt      DateTime @default(now())

  user User @relation(...)
}
```

## Best Practices

1. **Always use `awardXP()`** for XP transactions - don't create transactions directly
2. **Provide meaningful metadata** to help with debugging and analytics
3. **Use appropriate sourceTypes** to categorize XP sources
4. **Let the service handle duplicates** - don't implement your own checks
5. **Check daily goals** after awarding XP to trigger bonuses
6. **Use descriptive sourceIds** that uniquely identify the source
