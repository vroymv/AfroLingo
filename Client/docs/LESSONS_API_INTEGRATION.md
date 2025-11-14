# Lessons API Integration Guide

This guide explains how lessons are now fetched from the database instead of static JSON files.

## Overview

The lesson data has been migrated from static JSON to a PostgreSQL database using Prisma. The client now fetches lessons dynamically from the server through REST API endpoints.

## Architecture

### Server Side

#### Database Schema

- `Unit` - Learning units (e.g., "The Alphabet", "Numbers")
- `Lesson` - Individual lessons within units
- `Activity` - Activities within lessons
- Relations properly maintained with cascading deletes

#### API Endpoints

**Base URL**: `/api/lessons`

1. **GET `/api/lessons`**

   - Fetches all lessons with their units and activities
   - Query params:
     - `level` (optional): Filter by level (e.g., "Absolute Beginner", "Beginner")
     - `includeActivities` (optional, default: "true"): Include activities in response
   - Response: Complete lessons data structure

2. **GET `/api/lessons/:lessonId`**

   - Fetches a specific lesson by ID
   - Returns: Single lesson with unit info and activities

3. **GET `/api/lessons/unit/:unitId`**
   - Fetches all lessons for a specific unit
   - Query params:
     - `includeActivities` (optional, default: "true")
   - Returns: Unit with all its lessons

#### Files

- `Server/src/routes/lessons.ts` - API route handlers
- `Server/src/routes/index.ts` - Route exports
- `Server/src/index.ts` - Main server file with route registration

### Client Side

#### Services

**File**: `Client/services/lessons.ts`

```typescript
// Fetch all lessons
const lessons = await fetchLessons(level?, includeActivities?);

// Fetch specific lesson
const lesson = await fetchLessonById(lessonId);

// Fetch lessons by unit
const unit = await fetchLessonsByUnit(unitId, includeActivities?);
```

#### Hooks

**File**: `Client/hooks/useLessons.ts`

```typescript
// Use all lessons
const { data, loading, error, refetch } = useLessons(level?, includeActivities?);

// Use specific lesson
const { data, loading, error, refetch } = useLesson(lessonId);

// Use unit lessons
const { data, loading, error, refetch } = useUnitLessons(unitId, includeActivities?);
```

#### Data Layer

**File**: `Client/data/lessons.ts`

- Maintains TypeScript interfaces for type safety
- Provides `getLessonsData()` function that fetches from API with fallback to static data
- Static data (`mockLessonsData`) available as fallback for offline/development

## Usage Examples

### Component with Hook

```typescript
import { useLessons } from "@/hooks/useLessons";

export function LessonsComponent() {
  const { data, loading, error } = useLessons();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return <EmptyState />;

  return (
    <View>
      {data.units.map((unit) => (
        <UnitCard key={unit.id} unit={unit} />
      ))}
    </View>
  );
}
```

### Direct Service Call

```typescript
import { fetchLessonById } from "@/services/lessons";

async function loadLesson(id: string) {
  try {
    const lesson = await fetchLessonById(id);
    console.log(lesson);
  } catch (error) {
    console.error("Failed to load lesson:", error);
  }
}
```

### With Fallback

```typescript
import { getLessonsData } from "@/data/lessons";

async function loadLessonsWithFallback() {
  // Tries API first, falls back to static data if API fails
  const data = await getLessonsData();
  return data;
}
```

## Updated Components

### LessonsTab Component

**File**: `Client/components/learn/LessonsTab.tsx`

- Now uses `useLessons()` hook instead of static `mockLessonsData`
- Shows loading state while fetching
- Displays error state if fetch fails
- Handles empty state gracefully
- ProgressTracker component now accepts `units` as prop

## Environment Configuration

**File**: `Client/config/env.ts`

```typescript
export const ENV = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
  API_ENDPOINTS: {
    USERS: `${API_BASE_URL}/users`,
    AUTH: `${API_BASE_URL}/auth`,
    LESSONS: `${API_BASE_URL}/lessons`, // New endpoint
  },
};
```

## Data Flow

1. **Component** uses hook (e.g., `useLessons()`)
2. **Hook** calls service function (e.g., `fetchLessons()`)
3. **Service** makes HTTP request to server API
4. **Server** queries database via Prisma
5. **Database** returns data
6. **Server** transforms and returns data
7. **Service** returns data to hook
8. **Hook** updates component state
9. **Component** renders data

## Type Safety

All interfaces are shared between service and data layers:

- `Activity` - Individual activity data
- `Lesson` - Lesson with activities
- `Unit` - Unit with lessons
- `LessonsData` - Complete lessons structure

TypeScript ensures type safety across the entire stack.

## Error Handling

### Client Side

- Loading states while fetching
- Error states for failed requests
- Fallback to static data when API unavailable
- Empty states for no data

### Server Side

- Try-catch blocks in all routes
- Proper error responses with status codes
- Validation error handling
- Database error handling

## Testing the API

### Using cURL

```bash
# Get all lessons
curl http://localhost:3000/api/lessons

# Get lessons for specific level
curl "http://localhost:3000/api/lessons?level=Absolute%20Beginner"

# Get specific lesson
curl http://localhost:3000/api/lessons/lesson-alphabet

# Get lessons by unit
curl http://localhost:3000/api/lessons/unit/unit-1
```

### Using Browser

Navigate to:

- http://localhost:3000/api/lessons
- http://localhost:3000/api/lessons/lesson-alphabet
- http://localhost:3000/api/lessons/unit/unit-1

## Migration Notes

### What Changed

1. ❌ Direct imports of `mockLessonsData` in components
2. ✅ Use `useLessons()` hook instead
3. ❌ Static JSON as primary data source
4. ✅ Database as primary data source with JSON fallback

### Backward Compatibility

- Static JSON data still available via `mockLessonsData` export
- Can still use `getLessonsData()` for automatic fallback
- No breaking changes to data structure/interfaces

## Next Steps

### Potential Enhancements

1. Add user progress tracking endpoints
2. Implement caching strategies (React Query, SWR)
3. Add pagination for large datasets
4. Implement search and filtering
5. Add real-time updates with WebSockets
6. Implement offline-first with service workers

### User Progress Integration

Consider creating endpoints for:

- `POST /api/progress/lesson/:lessonId` - Update lesson progress
- `GET /api/progress/user/:userId` - Get user progress
- `POST /api/progress/activity/:activityId` - Track activity completion

## Troubleshooting

### Common Issues

**Issue**: "Failed to fetch lessons"

- **Solution**: Ensure server is running on correct port
- Check `EXPO_PUBLIC_API_BASE_URL` environment variable
- Verify database is seeded with lesson data

**Issue**: No lessons showing

- **Solution**: Run database seed: `npm run db:seed` in Server directory
- Check server logs for errors
- Verify Prisma client is generated

**Issue**: Type errors

- **Solution**: Ensure types match between service and data layers
- Regenerate Prisma client if schema changed
- Check TypeScript compiler version

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
