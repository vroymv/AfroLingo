/**
 * Central export point for all API routes
 * Import and re-export all route modules here for easier imports
 */

export { default as healthRouter } from "./health";
export { default as usersRouter } from "./users";
export { default as onboardingRouter } from "./onboarding";
export { default as lessonsRouter } from "./lessons";
export { default as progressRouter } from "./progress";
export { default as activitiesRouter } from "./activities";

// Add more routes as they are created:
// export { default as unitsRouter } from "./units";
