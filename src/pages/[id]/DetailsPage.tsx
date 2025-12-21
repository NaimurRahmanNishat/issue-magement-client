/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/shared/Loading";
import { motion } from "framer-motion";
import { useGetIssueByIdQuery } from "@/redux/features/issues/issueApi";
import CommentSection from "@/components/review/CommentSection";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const DetailsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
 const { issueId } = useParams<{ issueId: string }>();
  const { data, isLoading, error } = useGetIssueByIdQuery(issueId!, { skip: !issueId });

  if (!user) {
    navigate("/login");
    return null;
  }

  if (isLoading) return <Loading />;
  if (error) return <p className="text-red-500">Error loading issue.</p>;
  if (!data?.issue) return <p className="text-gray-500">Issue not found.</p>;

  const { title, category, description, images, location, division, createdAt, status } = data.issue;

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">{title}</h1>
      <div className="flex items-center flex-wrap justify-between">
      <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
        <span className="px-3 py-1 bg-blue-100 rounded-full text-sm font-medium capitalize">
          Category: {category}
        </span>
        <span className="px-3 py-1 bg-green-100 rounded-full text-sm font-medium">
          Location: {location}
        </span>
        <span className="px-3 py-1 bg-purple-100 rounded-full text-sm font-medium">
          Division: {division}
        </span>
        <span className="px-3 py-1 bg-yellow-100 rounded-full text-sm font-medium">
          Date: {new Date(createdAt!).toLocaleDateString()}
        </span>
      </div>
      <span className="px-3 py-1 bg-red-100 rounded-full text-gray-700 text-sm font-medium mb-4 md:mb-0">{status}</span>
      </div>

      {images?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {images.map((img: any) => (
            <img
              key={img.public_id || img.url}
              src={img.url}
              alt={title}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
      )}
      {/* Description */}
      <div className="bg-white py-6 px-4 rounded-lg shadow-md">
        <p className="text-gray-700">{description}</p>
      </div>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-8"
      >
        <CommentSection issueId={issueId!} />
      </motion.div>
    </motion.div>
  );
};  
export default DetailsPage;
