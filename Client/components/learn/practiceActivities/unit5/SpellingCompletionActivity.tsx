import BaseSpellingCompletionActivity, {
  componentKey,
} from "@/components/learn/activities/unit5/SpellingCompletionActivity";
import { withPracticeProgress } from "../withPracticeProgress";

export { componentKey };
export default withPracticeProgress(BaseSpellingCompletionActivity);
