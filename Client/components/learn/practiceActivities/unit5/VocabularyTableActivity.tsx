import BaseVocabularyTableActivity, {
  componentKey,
} from "@/components/learn/activities/unit5/VocabularyTableActivity";
import { withPracticeProgress } from "../withPracticeProgress";

export { componentKey };
export default withPracticeProgress(BaseVocabularyTableActivity);
