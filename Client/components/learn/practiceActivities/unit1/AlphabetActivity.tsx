import BaseAlphabetActivity, {
  componentKey,
} from "@/components/learn/activities/unit1/AlphabetActivity";
import { withPracticeProgress } from "../withPracticeProgress";

export { componentKey };
export default withPracticeProgress(BaseAlphabetActivity);
