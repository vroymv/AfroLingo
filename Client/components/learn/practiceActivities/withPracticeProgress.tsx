import React, { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { updatePracticeActivityProgress } from "@/services/practiceProgress";

type PropsWithActivity = {
  activity?: any;
  onComplete: () => void;
};

export function withPracticeProgress<TProps extends PropsWithActivity>(
  BaseComponent: React.ComponentType<TProps>
): React.ComponentType<TProps> {
  function Wrapped(props: TProps) {
    const { user } = useAuth();
    const didStartRef = useRef(false);

    const activityExternalIdRaw =
      (props as any)?.activity?.id ??
      (props as any)?.activityExternalId ??
      (props as any)?.activityId;

    const activityExternalId =
      typeof activityExternalIdRaw === "string" && activityExternalIdRaw.trim()
        ? activityExternalIdRaw
        : undefined;

    useEffect(() => {
      if (didStartRef.current) return;
      if (!user?.id || !activityExternalId) return;

      didStartRef.current = true;
      updatePracticeActivityProgress({
        userId: user.id,
        activityExternalId,
        event: "start",
      }).catch(() => {
        // best-effort
      });
    }, [user?.id, activityExternalId]);

    const originalOnComplete = props.onComplete;

    const onComplete = async () => {
      if (user?.id && activityExternalId) {
        await updatePracticeActivityProgress({
          userId: user.id,
          activityExternalId,
          event: "complete",
        }).catch(() => {
          // best-effort
        });
      }

      originalOnComplete?.();
    };

    return <BaseComponent {...props} onComplete={onComplete} />;
  }

  Wrapped.displayName = `withPracticeProgress(${
    BaseComponent.displayName || BaseComponent.name || "Component"
  })`;

  return Wrapped;
}
