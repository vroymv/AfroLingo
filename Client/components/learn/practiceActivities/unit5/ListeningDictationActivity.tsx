import BaseListeningDictationActivity, {
  componentKey,
} from "@/components/learn/activities/unit5/ListeningDictationActivity";
import { withPracticeProgress } from "../withPracticeProgress";

export { componentKey };
export default withPracticeProgress(BaseListeningDictationActivity);
