import IssueCard from "@/components/shared/IssueCard";
import { AuroraText } from "@/components/ui/aurora-text";
import type { Issue } from "@/types/issueType";

interface Props {
  issues: Issue[];
}

const PendingIssues = ({ issues }: Props) => {

  return (
    <div className="py-6 md:py-10 lg:py-16">
      <h2 className="text-2xl text-center font-semibold mb-4"><AuroraText>Pending Issues</AuroraText></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {issues.slice(0, 3).map((issue: Issue) => (
          <div key={issue._id}>
            <IssueCard issue={issue} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingIssues;
