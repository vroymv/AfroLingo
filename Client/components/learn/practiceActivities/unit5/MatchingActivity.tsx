import BaseMatchingActivity, {
  componentKey,
} from "@/components/learn/activities/unit5/MatchingActivity";
import { withPracticeProgress } from "../withPracticeProgress";

export { componentKey };
export default withPracticeProgress(BaseMatchingActivity);
