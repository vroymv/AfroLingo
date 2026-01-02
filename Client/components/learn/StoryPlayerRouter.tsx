import React from "react";
import type { Story } from "@/data/stories";
import DialogueStoryPlayer from "./StoryPlayer";
import { ImmersiveStoryPlayer } from "./ImmersiveStoryPlayer";

type StoryPlayerProps = {
  story: Story;
  visible: boolean;
  onClose: () => void;
};

/**
 * Smart Story Player Router
 * Renders different player experiences based on story type:
 * - "dialogue" stories -> Modal-style dialogue player
 * - "narrative" & "cultural" stories -> Immersive full-screen player
 */
export const StoryPlayer: React.FC<StoryPlayerProps> = ({
  story,
  visible,
  onClose,
}) => {
  if (story.type === "dialogue") {
    return (
      <DialogueStoryPlayer story={story} visible={visible} onClose={onClose} />
    );
  }

  return (
    <ImmersiveStoryPlayer story={story} visible={visible} onClose={onClose} />
  );
};
