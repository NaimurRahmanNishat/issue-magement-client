/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Loading from "@/components/shared/Loading";
import { toast } from "react-toastify";
import { useDeleteIssueMutation, useGetAllIssuesQuery, useUpdateIssueStatusMutation } from "@/redux/features/issues/issueApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { motion } from "framer-motion";

const StatusManagement = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState(1);

  // Only fetch assigned category if category-admin
  const queryCategory = user?.role === "category-admin" ? user.category : undefined;

  const { data, isLoading, refetch } = useGetAllIssuesQuery({ page, category: queryCategory });
  const issues = data?.issues || [];
  const totalPages = data?.totalPages || 1;

  // Modal state
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("pending");

  const [updateIssueStatus, { isLoading: updating }] = useUpdateIssueStatusMutation();
  const [deleteIssue, { isLoading: deleting }] = useDeleteIssueMutation();

  const openModal = (issue: any) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
  };

  const closeModal = () => setSelectedIssue(null);

  // ===== Update Status =====
  const handleUpdateStatus = async () => {
    try {
      const res: any = await updateIssueStatus({
        issueId: selectedIssue._id,
        status: newStatus,
      });

      if (res?.data?.success) {
        toast.success("Issue status updated!");
        closeModal();
        refetch();
      } else {
        toast.error(res?.error?.data?.message || "Failed!");
      }
    } catch (error: any) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  // ===== Delete Issue =====
  const handleDeleteIssue = async (issueId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this issue?");
    if (!confirmDelete) return;

    try {
      const res: any = await deleteIssue(issueId);
      if (res?.data?.success) {
        toast.success("Issue deleted successfully!");
        refetch();
      } else {
        toast.error(res?.error?.data?.message || "Delete failed!");
      }
    } catch (error: any) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  if (isLoading || deleting) return <Loading />;

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="p-6">
      <h1 className="text-xl font-semibold mb-4">Issue Status Management</h1>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">User</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Division</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {issues.map((issue: any) => (
              <tr key={issue._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{issue.author?.name}</td>
                <td className="p-3">{issue.title}</td>
                <td className="p-3 capitalize">{issue.category}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      issue.status === "pending"
                        ? "bg-yellow-500"
                        : issue.status === "in-progress"
                        ? "bg-blue-500"
                        : "bg-green-600"
                    }`}
                  >
                    {issue.status}
                  </span>
                </td>
                <td className="p-3">{issue.division}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button
                    onClick={() => openModal(issue)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteIssue(issue._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center mt-4 gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-1 bg-white border rounded">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Update Status – {selectedIssue.title}</h2>
            <label className="block mb-2 font-medium">Select Status</label>
            <select
              className="w-full border p-2 rounded"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="solved">Solved</option>
            </select>

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={closeModal} className="px-4 py-1 border rounded">
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updating}
                className="px-4 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {updating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StatusManagement;