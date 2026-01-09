import BaseListeningDictationActivity, {
  componentKey,
} from "@/components/learn/activities/unit1/ListeningDictationActivity";
import { withPracticeProgress } from "../withPracticeProgress";

export { componentKey };
export default withPracticeProgress(BaseListeningDictationActivity);
