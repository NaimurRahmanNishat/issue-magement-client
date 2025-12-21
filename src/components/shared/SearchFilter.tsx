import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGetAllIssuesQuery } from "@/redux/features/issues/issueApi";
import type { Issue } from "@/types/issueType";

const SearchFilter = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const { data, isLoading, isError, refetch } = useGetAllIssuesQuery(
    query ? { search: query } : {},
    { skip: !isOpen } // Only fetch when the search modal is open
  );

  useEffect(() => {
    if (query.trim().length > 0) {
      const timeout = setTimeout(() => {
        refetch();
      }, 400); // debounce effect for 400ms
      return () => clearTimeout(timeout);
    }
  }, [query, refetch]);

  const issues = data?.issues || [];

  // Category-wise navigation
  const handleRowClick = (category: string) => {
    const lower = category.toLowerCase();
    if (["water", "gas", "electricity", "road", "others"].includes(lower)) {
      navigate(`/${lower}`);
      setIsOpen(false);
    } else {
      navigate(`/others`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Search Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-700 cursor-pointer pt-1 hover:text-[#239c47] transition"
      >
        <Search size={22} />
      </button>

      {/* Search Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Blur */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Centered Search Box */}
            <motion.div
              className="fixed top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/6 
                         w-[95%] sm:w-[500px] md:w-[650px] lg:w-[750px]
                         bg-white rounded-2xl shadow-2xl z-50 p-6 border border-gray-200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Search Issues
                </h2>
                <button onClick={() => setIsOpen(false)}>
                  <X
                    size={22}
                    className="text-gray-600 cursor-pointer hover:text-red-500 transition"
                  />
                </button>
              </div>

              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, category, or location..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-[#239c47]"
                  autoFocus
                />
                <Search
                  size={18}
                  className="absolute cursor-pointer right-3 top-2.5 text-gray-500"
                />
              </div>

              {/* Results */}
              <div className="mt-5 max-h-64 overflow-y-auto">
                {isLoading ? (
                  <p className="text-gray-500 text-sm text-center mt-4">
                    Loading results...
                  </p>
                ) : isError ? (
                  <p className="text-red-500 text-sm text-center mt-4">
                    Failed to load data. Please try again.
                  </p>
                ) : query.trim().length === 0 ? (
                  <p className="text-gray-500 text-sm mt-3 text-center">
                    Start typing to search...
                  </p>
                ) : issues.length > 0 ? (
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b text-gray-600">
                        <th className="py-2 px-2">Title</th>
                        <th className="py-2 px-2">Category</th>
                        <th className="py-2 px-2">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issues.map((item: Issue) => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 transition cursor-pointer"
                          onClick={() => handleRowClick(item.category)}
                        >
                          <td className="py-2 px-2">{item.title}</td>
                          <td className="py-2 px-2 capitalize">
                            {item.category}
                          </td>
                          <td className="py-2 px-2">{item.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 text-sm mt-3 text-center">
                    No results found for “{query}”
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilter;
