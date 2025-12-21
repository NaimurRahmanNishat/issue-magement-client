/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  useReceiveMessageQuery, 
  useMarkMessageAsReadMutation,
  useMarkAllAsReadMutation, 
  useDeleteMessageMutation
} from "@/redux/features/emergency/emergencyApi";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import type { IMessage, ISender } from "@/types/message";
import { toast } from "react-toastify";
import { useState } from "react";
import Loading from "@/components/shared/Loading";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";

const ReceiveMessage = () => {
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  // Fetch messages with pagination
  const { data, isLoading, isError, refetch } = useReceiveMessageQuery({
  page: currentPage,
  limit: itemsPerPage,
  unreadOnly: showUnreadOnly,
});

  const [markAsRead] = useMarkMessageAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);

  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId).unwrap();
      toast.success("Message deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting message:", error);
      toast.error(error?.data?.message || "Failed to delete message");
    }
  };

  // Access control
  if (user?.role !== "category-admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            ⛔ Access Denied
          </h2>
          <p className="text-gray-600">
            Only category admins can view emergency messages.
          </p>
        </div>
      </div>
    );
  }

  // Single message mark as read
  const handleMarkAsRead = async (messageId: string) => {
    try {
      setLoadingMessageId(messageId);
      await markAsRead(messageId).unwrap();
      toast.success("Message marked as read!");
    } catch (error: any) {
      console.error("Error marking message as read:", error);
      toast.error(error?.data?.message || "Failed to mark as read");
    } finally {
      setLoadingMessageId(null);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      const result = await markAllAsRead().unwrap();
      toast.success(result.message || "All messages marked as read!");
      refetch(); // Refresh data
    } catch (error: any) {
      console.error("Error marking all as read:", error);
      toast.error(error?.data?.message || "Failed to mark all as read");
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToFirstPage = () => handlePageChange(1);
  const goToLastPage = () => handlePageChange(data?.totalPages || 1);
  const goToPreviousPage = () => handlePageChange(Math.max(1, currentPage - 1));
  const goToNextPage = () => handlePageChange(Math.min(data?.totalPages || 1, currentPage + 1));

  // Toggle unread filter
  const toggleUnreadFilter = () => {
    setShowUnreadOnly(!showUnreadOnly);
    setCurrentPage(1); // Reset to first page
  };

  if (isLoading || isDeleting) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            ❌ Error Loading Messages
          </h2>
          <button
            onClick={() => refetch()}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const messages = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const totalMessages = data?.total || 0;
  const unreadCount = messages.filter((msg) => !msg.read).length;

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            🚨 Emergency Messages
          </h2>
          <p className="text-gray-600 mt-1">
            Category: <span className="font-semibold">{user.category}</span>
            <span className="ml-3 text-sm text-gray-500">
              Total: {totalMessages} messages
            </span>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                {unreadCount} Unread on this page
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Unread Filter Toggle */}
          <button
            onClick={toggleUnreadFilter}
            className={`px-4 py-2 cursor-pointer rounded-lg transition ${
              showUnreadOnly
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {showUnreadOnly ? "📋 Show All" : "🔴 Unread Only"}
          </button>

          {/* Mark All as Read */}
          {unreadCount > 0 && !showUnreadOnly && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              ✓ Mark All as Read
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={() => refetch()}
            className="px-4 py-2 cursor-pointer bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {showUnreadOnly 
              ? "No unread messages" 
              : `No emergency messages yet for ${user.category} category.`
            }
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {messages.map((msg: IMessage, index: number) => {
              const sender = typeof msg.sender === "object" ? msg.sender as ISender : null;
              const isLoadingThis = loadingMessageId === msg._id;

              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border rounded-lg p-5 shadow-md transition-all ${
                    msg.read
                      ? "bg-gray-50 border-gray-300"
                      : "bg-red-50 border-red-300"
                  }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                        {msg.category}
                      </span>
                      {msg.read ? (
                        <div className="flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-gray-400 text-white text-xs font-semibold rounded-full">
                          ✓ READ
                        </span>
                        <button className="px-3 py-1 cursor-pointer bg-red-500 text-white text-xs font-semibold rounded-full hover:bg-red-600 transition" onClick={() => handleDeleteMessage(msg._id)}>delete</button>
                        </div>
                      ) : (
                        <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">
                      {new Date(msg.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  {/* Sender Info */}
                  <div className="mb-3">
                    <p className="text-gray-700">
                      <strong>From:</strong> {msg.senderName || sender?.name || "Unknown"}
                    </p>
                    {sender && (
                      <>
                        <p className="text-gray-600 text-sm">
                          📧 {sender.email}
                        </p>
                        {sender.phone && (
                          <p className="text-gray-600 text-sm">
                            📱 {sender.phone}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Message */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
                    <p className="text-gray-800 leading-relaxed">{msg.message}</p>
                  </div>

                  {/* Mark as Read Button */}
                  {!msg.read && (
                    <button
                      onClick={() => handleMarkAsRead(msg._id)}
                      disabled={isLoadingThis}
                      className={`w-full py-2 cursor-pointer rounded-lg font-semibold transition ${
                        isLoadingThis
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      {isLoadingThis ? "Marking..." : "✓ Mark as Read"}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-gray-100 rounded-lg">
              {/* Page Info */}
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-semibold">
                  {Math.min(currentPage * itemsPerPage, totalMessages)}
                </span>{" "}
                of <span className="font-semibold">{totalMessages}</span> messages
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-white hover:bg-gray-200 text-gray-700"
                  }`}
                  title="First Page"
                >
                  <ChevronsLeft size={20} />
                </button>

                {/* Previous Page */}
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-white hover:bg-gray-200 text-gray-700"
                  }`}
                  title="Previous Page"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // Show only nearby pages
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg transition ${
                            currentPage === pageNum
                              ? "bg-blue-500 text-white font-semibold"
                              : "bg-white hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return <span key={pageNum} className="px-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                {/* Next Page */}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-white hover:bg-gray-200 text-gray-700"
                  }`}
                  title="Next Page"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Last Page */}
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-white hover:bg-gray-200 text-gray-700"
                  }`}
                  title="Last Page"
                >
                  <ChevronsRight size={20} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ReceiveMessage;