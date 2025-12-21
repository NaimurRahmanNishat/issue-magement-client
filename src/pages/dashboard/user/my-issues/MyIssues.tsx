import { useState } from "react";
import Loading from "@/components/shared/Loading";
import { useGetAllIssuesQuery } from "@/redux/features/issues/issueApi";
import type { Issue } from "@/types/issueType";
import { motion } from "framer-motion";


const MyIssues = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 8;

  const { data, isLoading, error, isFetching } = useGetAllIssuesQuery({ page, limit, sort: "-createdAt" });
  const issues: Issue[] = data?.issues ?? [];
  const totalIssues: number = data?.totalIssues ?? 0;
  const totalPages: number = data?.totalPages ?? 1;

  // Pagination Handler
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading || isFetching) return <Loading/>;
  if (error) return <div>Failed to fetch data</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="md:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
          My Issues
        </h2>
        <h3 className="bg-blue-300 px-3 py-1 rounded-full text-gray-700 text-sm md:text-base">
          Total Issues: {totalIssues}
        </h3>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {issues.length === 0 ? (
          <p className="col-span-full text-center text-gray-600 text-lg">
            No issues found.
          </p>
        ) : (
          issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Image */}
              <div className="w-full h-40 md:h-48 overflow-hidden relative">
                <img
                  src={issue?.images?.[0]?.url || "/placeholder.jpg"}  
                  alt={issue.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Status Badge */}
                <span
                  className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${
                    issue.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : issue.status === "in-progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {issue.status === "in-progress"
                    ? "In Progress"
                    : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                </span>
              </div>
              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {issue.title}
                </h3>

                {/* Category */}
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    issue.category === "water"
                      ? "bg-blue-100 text-blue-600"
                      : issue.category === "electricity"
                      ? "bg-yellow-100 text-yellow-600"
                      : issue.category === "gas"
                      ? "bg-red-100 text-red-600"
                      : issue.category === "broken_road"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {issue.category}
                </span>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-2">
                  {issue.description}
                </p>

                {/* Info */}
                <div className="text-sm text-gray-500">
                  <p>
                    <strong>📍 Location:</strong> {issue.location}
                  </p>
                  <p>
                    <strong>🗺️ Division:</strong>{" "}
                    <span className="capitalize">{issue.division}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg font-medium ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Prev
          </button>

          <span className="text-gray-700 font-semibold">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg font-medium ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default MyIssues;
