import React, { createContext, useContext } from "react";

export interface LessonRuntime {
  userId: string | null;
  unitId: string;
  currentActivityNumber: number;
  totalActivities: number;
}

const LessonRuntimeContext = createContext<LessonRuntime | undefined>(
  undefined
);

export function LessonRuntimeProvider({
  value,
  children,
}: {
  value: LessonRuntime;
  children: React.ReactNode;
}) {
  return (
    <LessonRuntimeContext.Provider value={value}>
      {children}
    </LessonRuntimeContext.Provider>
  );
}

export function useLessonRuntime(): LessonRuntime {
  const ctx = useContext(LessonRuntimeContext);
  if (!ctx) {
    throw new Error(
      "useLessonRuntime must be used within LessonRuntimeProvider"
    );
  }
  return ctx;
}
