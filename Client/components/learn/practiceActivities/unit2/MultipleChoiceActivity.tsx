import BaseMultipleChoiceActivity, {
  componentKey,
} from "@/components/learn/activities/unit2/MultipleChoiceActivity";
import { withPracticeProgress } from "../withPracticeProgress";

export { componentKey };
export default withPracticeProgress(BaseMultipleChoiceActivity);
