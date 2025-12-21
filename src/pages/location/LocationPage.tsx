/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useState } from "react";
import { BangladeshDivision } from "@/constants/divisions";
import Loading from "@/components/shared/Loading";
import IssueCard from "@/components/shared/IssueCard";
import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import { useGetAllIssuesQuery } from "@/redux/features/issues/issueApi";
import type { Issue } from "@/types/issueType";

const LocationPage = () => {
  const { division } = useParams<{ division: keyof typeof BangladeshDivision }>();
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  // API call
  const { data, isLoading, isFetching, isError, error } = useGetAllIssuesQuery({
      division: BangladeshDivision[division!],
      page,
      limit,
    },
    { skip: !division }
  );

  // first load (page = 1)
  if (isLoading) return <Loading />;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load issues. {String((error as any)?.data?.message || "")}
      </p>
    );

  // Safe fallback
  const totalPages = data?.totalPages ?? 1;
  const issues: Issue[] = data?.issues ?? [];

  // Pagination handlers
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div >
      <h1 className="text-3xl font-bold my-6 text-center">
        <AuroraText>Issues in {BangladeshDivision[division!]}</AuroraText>
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
          <p className="text-center text-gray-500">
            No issues found in {BangladeshDivision[division!]}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationPage;
