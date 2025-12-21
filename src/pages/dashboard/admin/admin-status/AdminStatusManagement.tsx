/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useGetAllIssuesQuery } from "@/redux/features/issues/issueApi";
import Loading from "@/components/shared/Loading";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { AuroraText } from "@/components/ui/aurora-text";

/* =======================
   STATUS COLOR
======================= */
const statusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "in-progress":
      return "bg-blue-100 text-blue-700";
    case "solved":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

/* =======================
   ADMIN CARD ANIMATION
======================= */
const adminCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.97,
    transition: {
      duration: 0.3,
      ease: "easeIn" as const,
    },
  },
};

/* =======================
   PAGE NUMBER GENERATOR
======================= */
const getPages = (current: number, total: number) => {
  const pages: number[] = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, 5);
    } else if (current >= total - 2) {
      pages.push(total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(current - 2, current - 1, current, current + 1, current + 2);
    }
  }

  return pages;
};

/* =======================
   COMPONENT
======================= */
const AdminStatusManagement = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetAllIssuesQuery({ page });
  const totalPages = data?.totalPages ?? 1;

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (isLoading) return <Loading />;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h1 className="text-2xl font-semibold mb-6 text-center">
        🛠 <AuroraText>Admin Status Update History</AuroraText>
      </h1>

      {/* ISSUE LIST */}
      
      <div className="grid gap-4">
        <AnimatePresence mode="wait">
          {data?.issues?.map((issue: any) => (
            <motion.div
              layout
              key={issue._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white border rounded-xl shadow-sm p-5"
            >
              {/* ISSUE INFO */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{issue.title}</h2>
                  <p className="text-sm text-gray-500 capitalize">
                    Category: {issue.category} | Division: {issue.division}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                    issue.status
                  )}`}
                >
                  {issue.status}
                </span>
              </div>

              {/* ADMIN INFO */}
              <AnimatePresence>
                {issue.approvedBy && (
                  <motion.div
                    layout
                    variants={adminCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mt-4 flex items-center gap-4 bg-gray-50 p-4 rounded-lg"
                  >
                    <img
                      src={
                        issue.approvedBy.avatar?.url ||
                        "https://randomuser.me/api/portraits/lego/7.jpg"
                      }
                      alt="admin"
                      className="w-10 h-10 rounded-full"
                    />

                    <div className="flex-1">
                      <p className="font-medium text-green-600">
                        Updated by{" "}
                        <span className="text-blue-600">
                          {issue.approvedBy.name}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        Role: {issue.approvedBy.role}
                      </p>
                      <p className="text-xs text-gray-500">
                        Email: {issue.approvedBy.email}
                      </p>
                    </div>

                    <div className="text-right text-xs text-gray-500">
                      <p>{new Date(issue.approvedAt).toLocaleDateString()}</p>
                      <p>{new Date(issue.approvedAt).toLocaleTimeString()}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* NUMBERED PAGINATION */}

      {totalPages > 1 && (
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center gap-2 mt-10"
        >
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          {getPages(page, totalPages).map((p) => (
            <motion.button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-full text-sm font-medium
          ${
            p === page
              ? "bg-blue-600 text-white"
              : "bg-white border hover:bg-gray-100"
          }`}
            >
              {p}
            </motion.button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminStatusManagement;
