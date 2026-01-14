import BaseIntroductionActivity, {
  componentKey,
} from "@/components/learn/activities/unit5/IntroductionActivity";
import { withPracticeProgress } from "../withPracticeProgress";

export { componentKey };
export default withPracticeProgress(BaseIntroductionActivity);
