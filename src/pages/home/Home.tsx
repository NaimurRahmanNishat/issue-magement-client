import DivisionIssues from "@/components/pages/home/DivisionIssues";
import HeroImageSlider from "@/components/pages/home/HeroImageSlider";
import InProcessIssues from "@/components/pages/home/InProcessIssues";
import PendingIssues from "@/components/pages/home/PendingIssues";
import SolvedIssues from "@/components/pages/home/SolvedIssues";
import Loading from "@/components/shared/Loading";
import { useGetAllIssuesQuery } from "@/redux/features/issues/issueApi";
import type { Issue } from "@/types/issueType";


const Home = () => {
    const { data, isLoading, error } = useGetAllIssuesQuery();

  if (isLoading) return <Loading />;
  if (error) return <div>Something went wrong</div>;

  const issues: Issue[] = data?.issues ?? [];

  // 🔹 Filter issues by status
  const pendingIssues = issues.filter((issue) => issue.status === "pending");
  const inProcessIssues = issues.filter((issue) => issue.status === "in-progress");
  const solvedIssues = issues.filter((issue) => issue.status === "solved");
  return (
    <div className="min-h-screen">
      <HeroImageSlider />
      <div className="pt-[660px]">
        <DivisionIssues />

        {/* 🔹 Pass issues as props */}
        <PendingIssues issues={pendingIssues} />
        <InProcessIssues issues={inProcessIssues} />
        <SolvedIssues issues={solvedIssues} />
      </div>
    </div>
  )
}

export default Home;