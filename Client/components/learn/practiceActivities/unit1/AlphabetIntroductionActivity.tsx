import BaseAlphabetIntroductionActivity, {
  componentKey,
} from "@/components/learn/activities/unit1/AlphabetIntroductionActivity";
import { withPracticeProgress } from "../withPracticeProgress";

export { componentKey };
export default withPracticeProgress(BaseAlphabetIntroductionActivity);
