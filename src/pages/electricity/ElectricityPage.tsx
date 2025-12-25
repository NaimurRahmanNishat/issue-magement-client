import IssueCard from "@/components/shared/IssueCard";
import Loading from "@/components/shared/Loading";
import { Button } from "@/components/ui/button";
import { IssueCategory } from "@/constants/divisions";
import { useGetAllIssuesQuery } from "@/redux/features/issues/issueApi";
import type { Issue } from "@/types/issueType";
import { useState } from "react";

const ElectricityPage = () => {
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isFetching, error } = useGetAllIssuesQuery({
    category: IssueCategory.ELECTRICITY,
    page: 1,
    limit: 10,
  });

  if (isLoading) return <Loading />;
  if (error) return <p>Failed to load issues.</p>;

  const totalPages = data?.totalPages ?? 1;
  const issues: Issue[] = data?.issues ?? [];

  // Pagination handlers
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
        Electricity Issues
      </h1>

      {/* open new page then loading */}
      {isFetching ? (
        <div className="flex justify-center py-20">
          <Loading />
        </div>
      ) : issues.length > 0 ? (
        <>
          {/* Issue list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issues.map((issue) => (
              <div key={issue._id}>
                <IssueCard issue={issue} />
              </div>
            ))}
          </div>

          {/* Pagination buttons */}
          <div className="flex justify-center items-center my-12 gap-4">
            <Button
              onClick={handlePrev}
              disabled={page === 1 || isFetching}
              variant="outline"
              className="cursor-pointer"
            >
              Previous
            </Button>

            <span className="text-gray-700">
              Page {page} of {totalPages}
            </span>

            <Button
              onClick={handleNext}
              disabled={page === totalPages || isFetching}
              variant="outline"
              className="cursor-pointer"
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-center text-gray-500">No issues found.</p>
        </div>
      )}
    </div>
  );
};

export default ElectricityPage;