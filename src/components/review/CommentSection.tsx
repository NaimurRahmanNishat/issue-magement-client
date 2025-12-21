// src/components/review/CommentSection.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Loading from "../shared/Loading";
import userIcon from "../../assets/user.png";
import CommentItem from "./CommentItem";
import { useCreateCommentMutation, useGetCommentsByIssueQuery } from "@/redux/features/comments/commentApi";

interface CommentSectionProps {
  issueId: string;
}

const CommentSection = ({ issueId }: CommentSectionProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [newComment, setNewComment] = useState("");

  const { data, isLoading, isError } = useGetCommentsByIssueQuery({
    issueId,
    page: currentPage,
    limit: 10,
  });

  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to comment!");
      return;
    }

    if (!newComment.trim() || newComment.trim().length < 3) {
      toast.warning("Comment must be at least 3 characters long!");
      return;
    }

    try {
      await createComment({
        issueId,
        data: { comment: newComment.trim() },
      }).unwrap();

      toast.success("Comment added successfully!");
      setNewComment("");
    } catch (error: any) {
      console.error("Error creating comment:", error);
      toast.error(error?.data?.message || "Failed to add comment");
    }
  };

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 font-semibold mb-2">Failed to load comments</p>
        <p className="text-sm text-gray-600 mb-4">
          Please check if the backend server is running
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Reload Page
        </button>
      </div>
    );
  }

  const reviews = data?.reviews || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">
          💬 Comments ({data?.total || 0})
        </h3>
      </div>

      {/* Add Comment Form */}
      {user && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
        >
          <div className="flex gap-3">
            <img
              src={user.avatar?.url || userIcon}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  {newComment.length}/500 characters
                </p>
                <button
                  type="submit"
                  disabled={isCreating || !newComment.trim()}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    isCreating || !newComment.trim()
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isCreating ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </div>
        </motion.form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CommentItem review={review} issueId={issueId} />
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-100 rounded-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;